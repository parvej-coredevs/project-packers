const slugify = require("slugify");

export default slugify = (data) => {
  return slugify(data, { lower: true });
};
