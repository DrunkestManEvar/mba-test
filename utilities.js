export const dataJSON = async url => {
  const response = await fetch(url);
  const data = response.json();
  return data;
};

export const splitIntoSubArrays = (originalArray, numberOfSubArrays) => {
  const itemsPerSubArray = Math.ceil(originalArray.length / numberOfSubArrays);
  return new Array(numberOfSubArrays)
    .fill('')
    .map((_, index) =>
      originalArray.slice(
        index * itemsPerSubArray,
        (index + 1) * itemsPerSubArray
      )
    );
};
