import user from "./user/user";
import category from "./category/category";

export const services = (app) => {
  app.configure(user);
  app.configure(category);
};
