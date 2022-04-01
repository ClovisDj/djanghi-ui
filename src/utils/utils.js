
export const toTitle = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatValue = (value) => `$ ${Number(value).toFixed(2)}`;