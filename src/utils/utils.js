
export const toTitle = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatValue = (value) => `$ ${Number(value).toFixed(2)}`;

export const getIdsFromArray = (listObj) => {
  let _listOfIds = [];
  for (let item of listObj) {
    if (item.hasOwnProperty("id")) {
      _listOfIds.push(item.id);
    }
  }
  return _listOfIds;
};

export const getObjectById = (arrayOfObjects, objectId) => {
  for (let item of arrayOfObjects) {
    if (objectId === item.id) {
      return item;
    }
  }
  return null;
};

export const arrayDifference = (arrayA, arrayB) => {
  let setA = new Set(arrayA);
  let setB = new Set(arrayB);
  let _difference = new Set(setA);
  for (let item of setB) {
    _difference.delete(item)
  }
  return [..._difference];
};
