'use strict';
var CryptoJS = require('crypto-js');

const self = module.exports = {

    /**
     * Hàm mã hóa AES (AES/CBC/PKCS5PADDING)
     * @param message
     * @param aesKEY
     * @param aesIV
     * @returns {string}
     */
    aesEncryptWithKey: (message, aesKEY, aesIV) => {
        const key = CryptoJS.enc.Utf8.parse(aesKEY);
        const iv = CryptoJS.enc.Utf8.parse(aesIV);
        const cipherData = CryptoJS.AES.encrypt(message, key, {
            iv
        });
        return cipherData.toString();
    },

    /**
     * Hàm mã hóa AES (AES/CBC/PKCS5PADDING)
     * @param message
     * @returns {string}
     */
    aesEncrypt: (message) => {
        return self.aesEncryptWithKey(message, cons._AES_KEY, cons._AES_IV);
    },

    /**
     * Hàm giải mã AES (AES/CBC/PKCS5PADDING)
     * @param cipherData
     * @param aesKEY
     * @param aesIV
     * @returns {string}
     */
    aesDecryptWithKey: (cipherData, aesKEY, aesIV) => {
        const key = CryptoJS.enc.Utf8.parse(aesKEY);
        const iv = CryptoJS.enc.Utf8.parse(aesIV);
        const decrypted = CryptoJS.AES.decrypt(cipherData, key, {
            iv
        });
        let rtVal = '';
        try {
            rtVal = decrypted.toString(CryptoJS.enc.Utf8);
        } catch (err) {
            if (err)
                rtVal = decrypted.toString();
        }
        return rtVal.trim();
    },

    /**
     * Hàm giải mã AES (AES/CBC/PKCS5PADDING)
     * @param cipherData
     * @returns {string}
     */
    aesDecrypt: (cipherData) => {
        return self.aesDecryptWithKey(cipherData, cons._AES_KEY, cons._AES_IV);
    }
}
 
// Mã hóa
var message = CryptoJS.AES.encrypt('Nội dung cần mã hóa', 'itsasecret123', {
    iv: 'hehe'
}).toString();
 
// Xem chuỗi đã mã hóa
console.log(message);