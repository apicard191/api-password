const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

class CryptoService {
    static encrypt(string) {
        console.log('CryptoService:encrypt',string);
        const absolutePath = path.resolve('./config/crypto/id_rsa');
        const privateKey = fs.readFileSync(absolutePath, "utf8");
        const buffer = Buffer.from(string);
        const encrypted = crypto.privateEncrypt(privateKey, buffer);
        return encrypted.toString("base64");
    }

    static decrypt(string) {
        console.log('CryptoService:decrypt', string);
        const absolutePath = path.resolve('./config/crypto/id_rsa.pub');
        const publicKey = fs.readFileSync(absolutePath, "utf8");
        const buffer = Buffer.from(string, "base64");
        const decrypted = crypto.publicDecrypt(publicKey, buffer);
        return decrypted.toString("utf8");
    }
}

module.exports = CryptoService;
