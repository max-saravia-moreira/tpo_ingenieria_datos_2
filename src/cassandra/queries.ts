import { cassandra } from "./index.js";

export async function listDriversByGeohash(geohash: string) {
  return cassandra.execute(
    `SELECT nombre, licencia, calificacion, viajes_total,
            patente, marca, modelo, color, tipo_vehiculo
     FROM conductores_por_zona
     WHERE geohash = ?
     LIMIT 5`,
    [geohash],
    { prepare: true },
  );
}
