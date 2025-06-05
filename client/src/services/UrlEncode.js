import CryptoJS from "crypto-js"

const secretKey = "y";  // Secure rakhna!
const key = CryptoJS.enc.Utf8.parse(
  import.meta.env.VITE_REACT_APP_AES_SECRET 
);
const iv = CryptoJS.enc.Utf8.parse(
  import.meta.env.VITE_REACT_APP_AES_IV 
);

export const encryptID = (id) => {
    if (!id) return null;
    try {
        const encrypted = CryptoJS.AES.encrypt(String(id), secretKey).toString();
        return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); //  URL-Safe
    } catch (error) {
        console.error(" Encryption Error:", error);
        return null;
    }
};

// Decrypt
export const decryptID = (encryptedID) => {
    if (!encryptedID) return null;
    try {
        const normalizedID = encryptedID.replace(/-/g, '+').replace(/_/g, '/'); //  Reverse Base64
        const bytes = CryptoJS.AES.decrypt(normalizedID, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch (error) {
        console.error("Decryption Error:", error);
        return null;
    }
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


export const  decryptPayload = (encryptedText) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
};
