import crypto from "crypto-js";
import settings from "../../settings.json";

// Encryption function
function encryptData(data) {
  data = JSON.stringify(data);
  const encryptedData = crypto.AES.encrypt(
    data,
    settings.token_secret
  ).toString();
  return encryptedData;
}

// Decryption function
function decryptData(encryptedData) {
  const decryptedData = crypto.AES.decrypt(
    encryptedData,
    settings.token_secret
  ).toString(crypto.enc.Utf8);
  const secretData = JSON.parse(decryptedData);
  console.log("secretData", secretData);
  return secretData;
}

export { encryptData, decryptData };
