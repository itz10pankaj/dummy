import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012');
const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

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
  const ciphertext = CryptoJS.AES.encrypt(jsonString, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return ciphertext.toString();
};

console.log(encryptPayload({ message: 'Hello, World!' }));