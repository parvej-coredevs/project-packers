import slugify from "slugify";

export default (data, option = { lower: true }) => {
  return slugify(data, option);
};
