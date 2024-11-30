const CryptoJS = require('crypto-js');
const AES_API_KEY = 'empeippiepme';
const AES_API_IV = 'eippie';

// key required size = 16 charater
export function aesEncryptWithKey(message, $key) {
    if ($key === 'OFF') return message;

    const key = CryptoJS.enc.Utf8.parse($key),
        cipherData = CryptoJS.AES.encrypt(message.trim(), key, { iv: key });
    return cipherData.toString();
}

export function aesDecryptWithKey(cipherData, $key) {
    if ($key === 'OFF') return cipherData;
    if (!cipherData) return '';
    try {
        // remove special character
        let rtVal = '';
        cipherData = cipherData.replace(/\n|\r|\t/g, '').replace(/ /g, '+');
        const key = CryptoJS.enc.Utf8.parse($key);
        const decrypted = CryptoJS.AES.decrypt(cipherData, key, {
            iv: key
        });
        try {
            rtVal = decrypted.toString(CryptoJS.enc.Utf8);
        } catch (err) {
            rtVal = decrypted.toString();
        }
        return rtVal.trim();
    } catch (error) {
        console.log('-->cipherData', cipherData, '-->key', $key);
        console.log('descrypt->', error);
        return cipherData;
    }
}

export function aesDecryptDef(cipherData) {
    try {
        // remove special character
        const AES_KEY = 'fjk393shs323fh2j',
            AES_IV = 'zxcmjasdhksahd33',
            SALT = 'piepme2020';

        cipherData = cipherData.replace(/\n|\r|\t/g, '').replace(/ /g, '+');
        const key = CryptoJS.enc.Utf8.parse(AES_KEY),
            iv = CryptoJS.enc.Utf8.parse(AES_IV),
            decrypted = CryptoJS.AES.decrypt(cipherData, key, { iv });
        let rtVal = '';
        try {
            rtVal = decrypted.toString(CryptoJS.enc.Utf8);
        } catch (err) {
            if (err) rtVal = decrypted.toString();
        }
        return rtVal.trim();
    } catch (error) {
        console.log('-->cipherData', cipherData);
        console.log('descrypt->', error);
    }
}

export function aesDecryptApi(cipherData) {
    try {
        // cipherData = cipherData.replace(/\n|\r|\t/g, '').replace(/ /g, '+');
        const key = CryptoJS.enc.Utf8.parse(AES_API_KEY),
            iv = CryptoJS.enc.Utf8.parse(AES_API_IV),
            decrypted = CryptoJS.AES.decrypt(cipherData, key, { iv });
        let rtVal = '';
        try {
            rtVal = decrypted.toString(CryptoJS.enc.Utf8);
        } catch (err) {
            rtVal = decrypted.toString();
        }
        return rtVal.trim().length === 0 ? cipherData : rtVal.trim();
    } catch (error) {
        return cipherData;
    }
}

export function aesDecryptWithL000(cipherData, $key) {
    if (!cipherData) return '';
    try {
        cipherData = cipherData.replace(/\n|\r|\t/g, '');
        const key = CryptoJS.enc.Utf8.parse($key);
        const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
        const encrypted = CryptoJS.enc.Hex.parse(cipherData);
        const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, { iv: iv });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.log('-->cipherData', cipherData, '-->key', $key);
        console.log('descrypt->', error);
    }
}
