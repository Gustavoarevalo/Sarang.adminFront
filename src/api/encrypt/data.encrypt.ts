import CryptoJS from "crypto-js";
import { secretKey } from "./secrect-key";

export const DataEncrypt = (value: any) => {
    return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString()
}