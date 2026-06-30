import "dotenv/config";
import { createRequire } from "node:module";
import { types } from "cassandra-driver";
import { C, ts, U, VEH } from "../db/ids.js";
import { cassandra, shutdown } from "./index.js";

const require = createRequire(import.meta.url);
const ngeohash = require("ngeohash") as {
  encode(latitude: number, longitude: number, precision?: number): string;
};

const GEOHASH_PRECISION = 5;

type DriverLocation = {
  conductorId: string;
  usuarioId: string;
  vehiculoId: string;
  nombre: string;
  licencia: string;
  calificacion: string;
  viajesTotal: number;
  patente: string;
  marca: string;
  modelo: string;
  color: string;
  tipoVehiculo: string;
  latitud: number;
  longitud: number;
};

const driverLocations: DriverLocation[] = [
  {
    conductorId: C.carlos,
    usuarioId: U.carlos,
    vehiculoId: VEH.carlos,
    nombre: "Carlos Ruiz",
    licencia: "LIC-CARLOS-001",
    calificacion: "4.92",
    viajesTotal: 1247,
    patente: "AB123CD",
    marca: "Toyota",
    modelo: "Corolla",
    color: "Blanco",
    tipoVehiculo: "uberX",
    latitud: -34.6037,
    longitud: -58.3816,
  },
  {
    conductorId: C.ana,
    usuarioId: U.ana,
    vehiculoId: VEH.ana,
    nombre: "Ana Morales",
    licencia: "LIC-ANA-002",
    calificacion: "4.85",
    viajesTotal: 892,
    patente: "AC456EF",
    marca: "Chevrolet",
    modelo: "Tracker",
    color: "Gris",
    tipoVehiculo: "uberXL",
    latitud: -34.581,
    longitud: -58.42,
  },
  {
    conductorId: C.diego,
    usuarioId: U.diego,
    vehiculoId: VEH.diego,
    nombre: "Diego Castro",
    licencia: "LIC-DIEGO-003",
    calificacion: "4.98",
    viajesTotal: 2103,
    patente: "AD789GH",
    marca: "Volkswagen",
    modelo: "Virtus",
    color: "Negro",
    tipoVehiculo: "black",
    latitud: -34.6097,
    longitud: -58.3926,
  },
  {
    conductorId: C.paula,
    usuarioId: U.paula,
    vehiculoId: VEH.paula,
    nombre: "Paula Herrera",
    licencia: "LIC-PAULA-004",
    calificacion: "4.76",
    viajesTotal: 456,
    patente: "AE012IJ",
    marca: "Ford",
    modelo: "Mondeo",
    color: "Azul oscuro",
    tipoVehiculo: "black",
    latitud: -34.6187,
    longitud: -58.4412,
  },
  {
    conductorId: C.martin,
    usuarioId: U.martin,
    vehiculoId: VEH.martin,
    nombre: "Martín Vega",
    licencia: "LIC-MARTIN-005",
    calificacion: "4.65",
    viajesTotal: 178,
    patente: "AF345KL",
    marca: "Nissan",
    modelo: "Versa",
    color: "Rojo",
    tipoVehiculo: "uberX",
    latitud: -34.603,
    longitud: -58.421,
  },
  {
    conductorId: C.laura,
    usuarioId: U.laura,
    vehiculoId: VEH.laura,
    nombre: "Laura Navarro",
    licencia: "LIC-LAURA-006",
    calificacion: "4.88",
    viajesTotal: 634,
    patente: "AG678MN",
    marca: "Fiat",
    modelo: "Cronos",
    color: "Plateado",
    tipoVehiculo: "uberX",
    latitud: -34.5924,
    longitud: -58.3754,
  },
  {
    conductorId: C.roberto,
    usuarioId: U.roberto,
    vehiculoId: VEH.roberto,
    nombre: "Roberto Soto",
    licencia: "LIC-ROBERTO-007",
    calificacion: "4.71",
    viajesTotal: 312,
    patente: "AH901OP",
    marca: "Renault",
    modelo: "Duster",
    color: "Gris oscuro",
    tipoVehiculo: "uberXL",
    latitud: -34.5436,
    longitud: -58.4617,
  },
  {
    conductorId: C.elena,
    usuarioId: U.elena,
    vehiculoId: VEH.elena,
    nombre: "Elena Torres",
    licencia: "LIC-ELENA-008",
    calificacion: "4.95",
    viajesTotal: 1580,
    patente: "AI234QR",
    marca: "Peugeot",
    modelo: "408",
    color: "Negro",
    tipoVehiculo: "black",
    latitud: -34.5875,
    longitud: -58.3952,
  },
  {
    conductorId: C.facundo,
    usuarioId: U.facundo,
    vehiculoId: VEH.facundo,
    nombre: "Facundo Ríos",
    licencia: "LIC-FACUNDO-009",
    calificacion: "4.82",
    viajesTotal: 723,
    patente: "AJ567ST",
    marca: "Honda",
    modelo: "City",
    color: "Blanco",
    tipoVehiculo: "uberX",
    latitud: -34.61,
    longitud: -58.363,
  },
  {
    conductorId: C.gabriela,
    usuarioId: U.gabriela,
    vehiculoId: VEH.gabriela,
    nombre: "Gabriela Acosta",
    licencia: "LIC-GABRIELA-010",
    calificacion: "4.90",
    viajesTotal: 945,
    patente: "AK890UV",
    marca: "Citroen",
    modelo: "C4 Cactus",
    color: "Bordo",
    tipoVehiculo: "uberXL",
    latitud: -34.5627,
    longitud: -58.4558,
  },
];

const insertDriverLocation = `
  INSERT INTO conductores_por_zona (
    geohash,
    tipo_vehiculo,
    calificacion,
    patente,
    nombre,
    licencia,
    viajes_total,
    marca,
    modelo,
    color,
    updated_at
  )
  USING TTL 30
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

async function seed(): Promise<void> {
  console.log("Limpiando conductores_por_zona...");
  await cassandra.execute("TRUNCATE conductores_por_zona");

  console.log("Insertando conductores por zona...");
  for (const [index, driver] of driverLocations.entries()) {
    const geohash = ngeohash.encode(
      driver.latitud,
      driver.longitud,
      GEOHASH_PRECISION,
    );

    await cassandra.execute(
      insertDriverLocation,
      [
        geohash,
        driver.tipoVehiculo,
        types.BigDecimal.fromString(driver.calificacion),
        driver.patente,
        driver.nombre,
        driver.licencia,
        driver.viajesTotal,
        driver.marca,
        driver.modelo,
        driver.color,
        ts(21, 0, index),
      ],
      { prepare: true },
    );
  }

  console.log("Seed Cassandra completado:");
  console.log(`  conductores_por_zona: ${driverLocations.length}`);
}

seed()
  .then(async () => {
    await shutdown();
    process.exit(0);
  })
  .catch(async (err: unknown) => {
    console.error("Error en seed Cassandra:", err);
    await shutdown();
    process.exit(1);
  });
