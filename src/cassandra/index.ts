import "dotenv/config";
import { Client } from "cassandra-driver";

export const cassandra = new Client({
  contactPoints: [process.env.CASSANDRA_HOST ?? "localhost"],
  localDataCenter: process.env.CASSANDRA_DATACENTER ?? "datacenter1",
  keyspace: process.env.CASSANDRA_KEYSPACE ?? "uber",
});

export async function shutdown(): Promise<void> {
  await cassandra.shutdown();
}
