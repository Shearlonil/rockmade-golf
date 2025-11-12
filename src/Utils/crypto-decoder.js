import CryptoJS from 'crypto-js';

// Ensure these match the values used in Node.js
const ENC_KEY_STRING = 'gy+0Z1R5iuEwNECAReSIgiEbMVaJMpP0g2Nk64+g1t4='; // Convert ENC_KEY from Node.js to base64 string
const IV_STRING = '6Jj+GypbG6xQKOOfbc9abA=='; // Convert IV from Node.js to base64 string

function decryptData(encryptedData) {
    const key = CryptoJS.enc.Base64.parse(ENC_KEY_STRING);
    const iv = CryptoJS.enc.Base64.parse(IV_STRING);

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export default { decryptData }