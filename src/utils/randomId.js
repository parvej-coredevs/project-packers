export default function () {
  const chars =
    "A1B2C3ERD4E5F6GASF7HTRY8KI9J0ILH1MI2ON3UIOO4PF5BQ6RV7MSNM8BTCDS9DUDWE0V1WDF2XN3HY4KZK50";
  let orderId = "";
  for (let i = 0; i < 6; i++) {
    orderId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return orderId;
}
