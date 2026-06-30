import "dotenv/config";
import { createRequire } from "node:module";
import { shutdown } from "../cassandra/index.js";
import { listDriversByGeohash } from "../cassandra/queries.js";

const require = createRequire(import.meta.url);
const ngeohash = require("ngeohash") as {
  encode(latitude: number, longitude: number, precision?: number): string;
};

const DEFAULT_GEOHASH = ngeohash.encode(-34.6037, -58.3816, 5);

async function main(): Promise<void> {
  const geohash = process.argv[2] ?? DEFAULT_GEOHASH;
  const result = await listDriversByGeohash(geohash);

  console.log(`Conductores para geohash ${geohash}:`);

  if (result.rowLength === 0) {
    console.log("  Sin resultados.");
    return;
  }

  for (const row of result.rows) {
    console.log(
      [
        `  ${row.get("nombre")}`,
        `licencia ${row.get("licencia")}`,
        `rating ${row.get("calificacion")}`,
        `${row.get("tipo_vehiculo")} ${row.get("marca")} ${row.get("modelo")}`,
        `patente ${row.get("patente")}`,
      ].join(" | "),
    );
  }
}

main()
  .then(async () => {
    await shutdown();
    process.exit(0);
  })
  .catch(async (err: unknown) => {
    console.error("Error listando conductores por zona:", err);
    await shutdown();
    process.exit(1);
  });
