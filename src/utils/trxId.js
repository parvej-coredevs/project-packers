function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function generateTransactionId() {
  const timestamp = Date.now().toString(36);
  const randomString = generateRandomString(6);
  const uniqueIdentifier = "TRX";
  return uniqueIdentifier + timestamp + randomString;
}

export default generateTransactionId;
