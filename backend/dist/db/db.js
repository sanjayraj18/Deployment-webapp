"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_pg_1 = require("@prisma/adapter-pg");
const extension_1 = require("@prisma/client/extension");
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config/config"));
const connectionString = config_1.default.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new extension_1.PrismaClient({ adapter });
exports.default = prisma;
//# sourceMappingURL=db.js.map