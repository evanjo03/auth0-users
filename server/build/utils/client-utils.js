var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ManagementClient } from "auth0";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const fullPath = path.resolve(path.dirname(__filename), "../../../");
dotenv.config({ path: fullPath + "/.env" });
export function getManagementClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            audience: process.env.AUDIENCE,
            grant_type: "client_credentials",
        };
        const response = yield fetch(new URL(process.env.TOKEN_ENDPOINT), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(configuration),
            mode: "cors",
            cache: "default",
        });
        const authRes = yield response.json(); // parses JSON response into native JavaScript objects
        const managementClient = new ManagementClient({
            token: authRes.access_token,
            domain: process.env.DOMAIN,
        });
        return managementClient;
    });
}
