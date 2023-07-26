// import axios from "axios";
const axios = require("axios");

class Payment {
  sandbox_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
  live_url =
    "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";
  refund_url =
    "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";

  constructor(storeId, storePassword, live) {
    this.storeId = storeId;
    this.storePassword = storePassword;
    this.URL = live ? this.live_url : this.sandbox_url;
  }

  async fetch({ method, data }) {
    return await axios({
      method,
      url: this.URL,
      data,
    });
  }

  async initiatePayment(data) {
    return await this.fetch({
      method: "POST",
      data,
    });
  }

  async validatePayment(data) {
    return await this.fetch({
      method: "POST",
      data,
    });
  }

  async initiateRefund(params) {
    return await axios.get(this.refund_url, { params })?.data;
  }

  async queryRefund(params) {
    return await axios.get(this.refund_url, { params })?.data;
  }

  async transactionQuery(params) {
    return await axios.get(this.refund_url, { params })?.data;
  }
}

const payment = new Payment(
  "cored64bf7afe242ad",
  "cored64bf7afe242ad@ssl",
  false
);
const p = payment.initiatePayment({
  store_id: "cored64bf7afe242ad",
  store_password: "cored64bf7afe242ad@ssl",
  total_amount: 4000,
  currency: "BDT",
  tran_id: "dfgw34tfvcw",
  product_category: "General",
  success_url: "success.html",
  cancel_url: "cancel.html",
  fail_url: "fail.html",
  ipn_url: `checkout/ipn`,
  product_name: "alsjfdlksadjf ljsadf klasf",
  product_category: "General",
  product_profile: "General",
  cus_name: "asjdf kjsad ",
  cus_email: "askdjf ksadjfkaj",
  cus_add1: "alsjfdlksadjf ljsadf kl",
  cus_city: "alsjfdlksadjf ljsadf klsf",
  cus_state: "alsjfdlksadjf ljsadf kl",
  cus_postcode: "alsjfdlksadjf ljsadf kl",
  cus_country: "alsjfdlksadjf ljsadf kl",
  cus_phone: "alsjfdlksadjf ljsadf kl",
  shipping_method: "No",
  ship_name: "Customer Name",
  ship_add1: "Dhaka",
  ship_add2: "Dhaka",
  ship_city: "Dhaka",
  ship_state: "Dhaka",
  ship_postcode: 100000,
  ship_country: "Bangladesh",
});

console.log(p);

// export default Payment;
