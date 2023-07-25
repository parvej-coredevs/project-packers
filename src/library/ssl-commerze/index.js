import axios from "axios";

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
      data: {
        store_id: this.store_id,
        store_password: this.store_password,
        ...data,
      },
    })?.data;
  }

  async initiatePayment(data) {
    console.log(data);
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

export default Payment;
