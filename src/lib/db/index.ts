import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Obtenir le chemin absolu du fichier .env à la racine du projet
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "../../../.env");

// Charger le .env avec le chemin absolu
dotenv.config({ path: envPath });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Erreur : DATABASE_URL non trouvée");
  console.error("Chemin .env cherché :", envPath);
  console.error(
    "Variables disponibles :",
    Object.keys(process.env).filter((k) => k.includes("DATA")),
  );
  throw new Error("DATABASE_URL n'est pas définie dans le fichier .env");
}

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export * from "./schema";
