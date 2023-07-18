import user from "./user/user";
import category from "./category/category";
import product from "./product/product";

export const services = (app) => {
  app.configure(user);
  app.configure(category);
  app.configure(product);
};
