import user from "./user/user";
import category from "./category/category";
import product from "./product/product";
import request from "./request/request";

export const services = (app) => {
  app.configure(user);
  app.configure(category);
  app.configure(product);
  app.configure(request);
};
