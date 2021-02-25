const keyPrefix = 'studygorize-';
const LocalStorageService = {};

LocalStorageService.setItem = (key, value) => {
  value = JSON.stringify({ value: value });
  localStorage.setItem(keyPrefix + key, value);
};

LocalStorageService.getItem = (key) => {
  let item = localStorage.getItem(keyPrefix + key);
  if (item !== null) {
    return JSON.parse(item).value;
  }
  return null;
};

LocalStorageService.removeItem = (key) => {
  localStorage.removeItem(keyPrefix + key);
}

LocalStorageService.clear = () => {
  localStorage.clear();
}

export default LocalStorageService;