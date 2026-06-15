"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.PORT) {
    throw new Error("port number not found");
}
if (!process.env.DATABASE_URL) {
    throw new Error("DB url not found");
}
const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
};
exports.default = config;
//# sourceMappingURL=config.js.map