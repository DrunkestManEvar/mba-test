import { dataJSON, splitIntoSubArrays } from './utilities.js';

const programmesContainer = document.querySelector('.programmes-container');
const errorContainerBtn = document.querySelector('.error-container__button');
const programmes = [];
const modules = [];
const API_URL =
  'https://ipo-cp.ru/api/v1/bootcamps/605c5f71bc557b46b4f42a56/courses';

class App {
  constructor(programmes, modules) {
    this.programmes = programmes;
    this.modules = modules;
    this.error = null;
    this.init();
  }

  fetchData = async url => {
    try {
      const response = await dataJSON(url);
      this.programmes = response.data
        .filter(programme => programme.specializedSubjects.length >= 10)
        .slice(0, 5)
        .map(programme => {
          const { title, specializedSubjects: modules } = programme;
          return { title, modules };
        });
    } catch (error) {
      this.error = error.message;
    }
  };

  displayProgrammes = () => {
    const programmeArticles = this.programmes
      .map(programme => {
        const { title, modules } = programme;

        const arrayOfModulesSubArrays = splitIntoSubArrays(modules, 2);

        return `
      <article class="programme">
        <h3 class="programme__title subheading">${title}</h3>
        ${this.generateModules(arrayOfModulesSubArrays)}
      </article>
      `;
      })
      .join('');

    programmesContainer.innerHTML = programmeArticles;
  };

  generateModules = subArr => {
    return subArr
      .map((sub, i) => {
        return `
      <div class="module">
      <div class="module__toggle"></div>
      <h2 class="module__number list-heading">${i + 1} модуль</h2>
      <ul class="module__list list">
        ${this.generateListItems(sub)}
      </ul>
    </div>
      `;
      })
      .join('');
  };

  generateListItems = listItemsArray =>
    listItemsArray
      .map(item => `<li class="module__list-item">${item}</li>`)
      .join('');

  displayErrorMessage = () => {
    const loader = document.querySelector('.loader');
    programmesContainer.removeChild(loader);
    programmesContainer.classList.add('error');
  };

  removeError = () => {
    this.error = null;
    programmesContainer.classList.remove('error');
  };

  handleModuleClick = e => {
    const clickedModule = e.target.closest('.module');

    if (!clickedModule || e.target.closest('.module__list')) return;

    clickedModule.classList.toggle('active');
  };

  init = async () => {
    await this.fetchData(API_URL);
    errorContainerBtn.addEventListener('click', this.removeError);

    if (this.error) return this.displayErrorMessage();
    console.log(errorContainerBtn);
    programmesContainer.addEventListener('click', this.handleModuleClick);
    this.displayProgrammes();
  };
}

const app = new App(programmes, modules);
