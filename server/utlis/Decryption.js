// import crypto from "crypto";
import CryptoJS from "crypto-js";
const key = CryptoJS.enc.Utf8.parse(process.env.AES_SECRET);
const iv = CryptoJS.enc.Utf8.parse(process.env.AES_IV);

export const  decryptPayload = (encryptedText) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
};

export const encryptPayload = (data) => {
  const jsonString = JSON.stringify(data);
  const ciphertext  = CryptoJS.AES.encrypt(jsonString, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return ciphertext.toString();
};
