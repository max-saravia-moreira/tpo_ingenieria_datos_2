CREATE KEYSPACE IF NOT EXISTS uber
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE IF NOT EXISTS uber.conductores_por_zona (
  geohash text,
  tipo_vehiculo text,
  calificacion decimal,
  patente text,
  nombre text,
  licencia text,
  viajes_total int,
  conductor_activo boolean,
  marca text,
  modelo text,
  color text,
  vehiculo_activo boolean,
  updated_at timestamp,
  PRIMARY KEY (geohash, tipo_vehiculo, calificacion, patente)
) WITH CLUSTERING ORDER BY (
  tipo_vehiculo ASC,
  calificacion DESC,
  patente ASC
);
