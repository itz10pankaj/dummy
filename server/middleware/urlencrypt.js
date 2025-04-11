import CryptoJS from "crypto-js";
const secretKey = "y";

export const encryptID = (id) => {
  if (!id) return null;
  try {
      const encrypted = CryptoJS.AES.encrypt(String(id), secretKey).toString();
      return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); 
  } catch (error) {
      console.error(" Encryption Error:", error);
      return null;
  }
};

export const decryptID = (encryptedID) => {
  if (!encryptedID) return null;
  try {
      const normalizedID = encryptedID.replace(/-/g, '+').replace(/_/g, '/'); 
      const bytes = CryptoJS.AES.decrypt(normalizedID, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch (error) {
      console.error("❌ Decryption Error:", error);
      return null;
  }
};
