import CryptoJS from "crypto-js";
import { secretKey } from "./secrect-key";

export const DataDecrypt = (value: any) => {
    const bytes = CryptoJS.AES.decrypt(value, secretKey.toString())
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}