import user from "./user/user";
import category from "./category/category";
import product from "./product/product";
import request from "./request/request";
import coupon from "./coupon/coupon";
import support, { supportSocket } from "./support/support";
import order from "./order/order";
import cart from "./cart/cart";
import customer from "./customer/customer";

export const services = (app) => {
  app.configure(user);
  app.configure(category);
  app.configure(product);
  app.configure(request);
  app.configure(coupon);
  app.configure(support);
  app.configure(order);
  app.configure(cart);
  app.configure(customer);

  // Load Socket events
  supportSocket(app);
};
