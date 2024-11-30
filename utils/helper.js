export function getFileExt(str = '') {
    const extString = str.split('.').pop();
    return extString?.split('?')[0];
}

export function b64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(parseInt('0x' + p1, 16));
        })
    );
}

export function b64DecodeUnicode(str) {
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(str), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
}


export function encodeString(str) {
    try {
        return encodeURIComponent(str);
    } catch (e) {
        try {
            return encodeURI(str);
        } catch (error) {
            return str;
        }
    }
}

export function decodeString(str) {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        try {
            return decodeURI(str);
        } catch (error) {
            return str;
        }
    }
}


export function removeUnicode(str) {
    return str
        .replace(/[àáạảãâầấậẩẫăằắặẳẵÄä]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡÖö]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳỳýỵỷỹ]/g, 'y') // notice ỳỳ
        .replace(/đ/g, 'd')
        .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
        .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
        .replace(/[ÌÍỊỈĨ]/g, 'I')
        .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
        .replace(/[ÙÚỤỦŨƯỪỨỰỬỮÜü]/g, 'U')
        .replace(/[ỲÝỴỶỸ]/g, 'Y')
        .replace(/Đ/g, 'D');
}

export function removeUnicodeRemoveSpace(str) {
    return removeUnicode(str).replace(/[\s:\/\\\.]/g, '');
}

export function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
}

export function array_move_first(arr, index) {
    if (index < arr.length) {
        arr.unshift(arr.splice(index, 1)[0]);
    }
}

export function isNumber(txt) {
    return /^\d+$/.test(txt);
}

export function isNumberPhone(txt) {
    return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(txt);
}

export function isEmail(txt) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(txt);
}


export function uniqueInArray(a, key) {
    const seen = new Set();
    return a.filter((item) => {
        const k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

export function urlify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}