import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "cassandra-driver";

const MAX_ATTEMPTS = 12;
const INITIAL_BACKOFF_MS = 1_000;

const client = new Client({
  contactPoints: [process.env.CASSANDRA_HOST ?? "localhost"],
  localDataCenter: process.env.CASSANDRA_DATACENTER ?? "datacenter1",
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function waitForCassandra(): Promise<void> {
  let backoffMs = INITIAL_BACKOFF_MS;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await client.execute("SELECT release_version FROM system.local");
      return;
    } catch (err) {
      if (attempt === MAX_ATTEMPTS) {
        throw err;
      }

      console.log(
        `Cassandra no responde todavia (intento ${attempt}/${MAX_ATTEMPTS}). Reintentando en ${backoffMs}ms...`,
      );
      await sleep(backoffMs);
      backoffMs *= 2;
    }
  }
}

function splitStatements(schema: string): string[] {
  return schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function migrate(): Promise<void> {
  await waitForCassandra();

  const currentDir = dirname(fileURLToPath(import.meta.url));
  const schemaPath = resolve(currentDir, "../../cassandra/schema.cql");
  const schema = await readFile(schemaPath, "utf8");
  const statements = splitStatements(schema);

  for (const statement of statements) {
    await client.execute(statement);
  }

  console.log(`Migracion Cassandra completada (${statements.length} statements).`);
}

migrate()
  .then(async () => {
    await client.shutdown();
    process.exit(0);
  })
  .catch(async (err: unknown) => {
    console.error("Error en migracion Cassandra:", err);
    await client.shutdown();
    process.exit(1);
  });
