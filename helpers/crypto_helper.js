
const crypto = require('crypto');

const  CRYPTO_SECRET= 'mousncswerwqertfcsdwsadn2231sa#@'.normalize('NFC');
const ivG="asdas".normalize('NFC');

const encrypt = function(toEncrpt,iv=null){
    console.log(CRYPTO_SECRET);
    let cipher = crypto.createCipheriv('aes-256-gcm',CRYPTO_SECRET,iv);
    console.log(cipher);
    let crypted = cipher.update(toEncrpt,'utf-8','hex');
    cipher.final('hex');
    return crypted;
}

const decrypt = function(toDecryp,iv=null){
    const decypher = crypto.createDecipheriv('aes-256-gcm',CRYPTO_SECRET,iv);
    let dec = decypher.update(toDecryp,'hex','utf-8');
     decypher.final('utf-8');
    return dec;
}



// let encrypted = encrypt("6596f3af0e692440b9b40862",ivG);


// let decrypted = decrypt(encrypted,ivG);
