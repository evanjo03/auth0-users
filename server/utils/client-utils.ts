import { ManagementClient } from "auth0";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const fullPath = path.resolve(path.dirname(__filename), "../../");
dotenv.config({ path: fullPath + "/.env" });

export async function getManagementClient(): Promise<ManagementClient> {
  const configuration = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: process.env.AUDIENCE,
    grant_type: "client_credentials",
  };
  const response = await fetch(new URL(process.env.TOKEN_ENDPOINT as string), {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(configuration),
    mode: "cors",
    cache: "default",
  });
  const authRes = await response.json(); // parses JSON response into native JavaScript objects

  const managementClient = new ManagementClient({
    token: authRes.access_token,
    domain: process.env.DOMAIN as string,
  });

  return managementClient;
}
