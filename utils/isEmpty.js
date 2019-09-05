module.exports = isEmpty = obj => {
  if (obj == null) return true;
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};
