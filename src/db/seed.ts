import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index.js";
import { conductores, pagos, usuarios, viajes } from "./schema.js";

const BASE_DATE = { year: 2025, month: 4, day: 22 }; // 2025-05-22 UTC

function ts(hour: number, minute: number, second = 0): Date {
  return new Date(
    Date.UTC(BASE_DATE.year, BASE_DATE.month, BASE_DATE.day, hour, minute, second),
  );
}

// ─── IDs fijos ───────────────────────────────────────────

const U = {
  carlos: "550e8400-e29b-41d4-a716-446655440000",
  ana: "550e8400-e29b-41d4-a716-446655440010",
  diego: "550e8400-e29b-41d4-a716-446655440011",
  paula: "550e8400-e29b-41d4-a716-446655440012",
  martin: "550e8400-e29b-41d4-a716-446655440013",
  laura: "550e8400-e29b-41d4-a716-446655440014",
  roberto: "550e8400-e29b-41d4-a716-446655440015",
  elena: "550e8400-e29b-41d4-a716-446655440016",
  facundo: "550e8400-e29b-41d4-a716-446655440017",
  gabriela: "550e8400-e29b-41d4-a716-446655440018",
  maria: "770e8400-e29b-41d4-a716-446655440002",
  juan: "770e8400-e29b-41d4-a716-446655440003",
  sofia: "770e8400-e29b-41d4-a716-446655440004",
  lucas: "770e8400-e29b-41d4-a716-446655440005",
  valentina: "770e8400-e29b-41d4-a716-446655440006",
  mateo: "770e8400-e29b-41d4-a716-446655440007",
  camila: "770e8400-e29b-41d4-a716-446655440008",
  tomas: "770e8400-e29b-41d4-a716-446655440009",
} as const;

const C = {
  carlos: "660e8400-e29b-41d4-a716-446655440010",
  ana: "660e8400-e29b-41d4-a716-446655440011",
  diego: "660e8400-e29b-41d4-a716-446655440012",
  paula: "660e8400-e29b-41d4-a716-446655440013",
  martin: "660e8400-e29b-41d4-a716-446655440014",
  laura: "660e8400-e29b-41d4-a716-446655440015",
  roberto: "660e8400-e29b-41d4-a716-446655440016",
  elena: "660e8400-e29b-41d4-a716-446655440017",
  facundo: "660e8400-e29b-41d4-a716-446655440018",
  gabriela: "660e8400-e29b-41d4-a716-446655440019",
} as const;

const V = {
  v1: "660e8400-e29b-41d4-a716-446655440001",
  v2: "660e8400-e29b-41d4-a716-446655440002",
  v3: "660e8400-e29b-41d4-a716-446655440003",
  v4: "660e8400-e29b-41d4-a716-446655440004",
  v5: "660e8400-e29b-41d4-a716-446655440005",
  v6: "660e8400-e29b-41d4-a716-446655440006",
  v7: "660e8400-e29b-41d4-a716-446655440007",
  v8: "660e8400-e29b-41d4-a716-446655440008",
  v9: "660e8400-e29b-41d4-a716-446655440009",
  v10: "660e8400-e29b-41d4-a716-44665544000a",
  v11: "660e8400-e29b-41d4-a716-44665544000b",
  v12: "660e8400-e29b-41d4-a716-44665544000c",
} as const;

async function seed() {
  console.log("Limpiando tablas...");
  await db.execute(
    sql`TRUNCATE TABLE pagos, viajes, conductores, usuarios RESTART IDENTITY CASCADE`,
  );

  console.log("Insertando usuarios...");
  await db.insert(usuarios).values([
    { usuarioId: U.carlos, correo: "carlos.ruiz@example.com", telefono: "+5491123456701", nombre: "Carlos Ruiz", activo: true },
    { usuarioId: U.ana, correo: "ana.morales@example.com", telefono: "+5491123456702", nombre: "Ana Morales", activo: true },
    { usuarioId: U.diego, correo: "diego.castro@example.com", telefono: "+5491123456703", nombre: "Diego Castro", activo: true },
    { usuarioId: U.paula, correo: "paula.herrera@example.com", telefono: "+5491123456704", nombre: "Paula Herrera", activo: true },
    { usuarioId: U.martin, correo: "martin.vega@example.com", telefono: "+5491123456705", nombre: "Martín Vega", activo: true },
    { usuarioId: U.laura, correo: "laura.navarro@example.com", telefono: "+5491123456706", nombre: "Laura Navarro", activo: true },
    { usuarioId: U.roberto, correo: "roberto.soto@example.com", telefono: "+5491123456707", nombre: "Roberto Soto", activo: true },
    { usuarioId: U.elena, correo: "elena.torres@example.com", telefono: "+5491123456708", nombre: "Elena Torres", activo: true },
    { usuarioId: U.facundo, correo: "facundo.rios@example.com", telefono: "+5491123456709", nombre: "Facundo Ríos", activo: true },
    { usuarioId: U.gabriela, correo: "gabriela.acosta@example.com", telefono: "+5491123456710", nombre: "Gabriela Acosta", activo: false },
    { usuarioId: U.maria, correo: "maria.garcia@example.com", telefono: "+5491198765401", nombre: "María García", activo: true },
    { usuarioId: U.juan, correo: "juan.perez@example.com", telefono: "+5491198765402", nombre: "Juan Pérez", activo: true },
    { usuarioId: U.sofia, correo: "sofia.lopez@example.com", telefono: "+5491198765403", nombre: "Sofía López", activo: true },
    { usuarioId: U.lucas, correo: "lucas.martinez@example.com", telefono: "+5491198765404", nombre: "Lucas Martínez", activo: true },
    { usuarioId: U.valentina, correo: "valentina.rodriguez@example.com", telefono: "+5491198765405", nombre: "Valentina Rodríguez", activo: true },
    { usuarioId: U.mateo, correo: "mateo.fernandez@example.com", telefono: "+5491198765406", nombre: "Mateo Fernández", activo: true },
    { usuarioId: U.camila, correo: "camila.diaz@example.com", telefono: "+5491198765407", nombre: "Camila Díaz", activo: true },
    { usuarioId: U.tomas, correo: "tomas.suarez@example.com", telefono: "+5491198765408", nombre: "Tomás Suárez", activo: false },
  ]);

  console.log("Insertando conductores...");
  await db.insert(conductores).values([
    { conductorId: C.carlos, usuarioId: U.carlos, licencia: "AB123CD", tipoVehiculo: "uberX", calificacion: "4.92", viajesTotal: 1247, activo: true },
    { conductorId: C.ana, usuarioId: U.ana, licencia: "AC456EF", tipoVehiculo: "uberXL", calificacion: "4.85", viajesTotal: 892, activo: true },
    { conductorId: C.diego, usuarioId: U.diego, licencia: "AD789GH", tipoVehiculo: "black", calificacion: "4.98", viajesTotal: 2103, activo: true },
    { conductorId: C.paula, usuarioId: U.paula, licencia: "AE012IJ", tipoVehiculo: "black", calificacion: "4.76", viajesTotal: 456, activo: true },
    { conductorId: C.martin, usuarioId: U.martin, licencia: "AF345KL", tipoVehiculo: "uberX", calificacion: "4.65", viajesTotal: 178, activo: false },
    { conductorId: C.laura, usuarioId: U.laura, licencia: "AG678MN", tipoVehiculo: "uberX", calificacion: "4.88", viajesTotal: 634, activo: true },
    { conductorId: C.roberto, usuarioId: U.roberto, licencia: "AH901OP", tipoVehiculo: "uberXL", calificacion: "4.71", viajesTotal: 312, activo: true },
    { conductorId: C.elena, usuarioId: U.elena, licencia: "AI234QR", tipoVehiculo: "black", calificacion: "4.95", viajesTotal: 1580, activo: true },
    { conductorId: C.facundo, usuarioId: U.facundo, licencia: "AJ567ST", tipoVehiculo: "uberX", calificacion: "4.82", viajesTotal: 723, activo: true },
    { conductorId: C.gabriela, usuarioId: U.gabriela, licencia: "AK890UV", tipoVehiculo: "uberXL", calificacion: "4.90", viajesTotal: 945, activo: false },
  ]);

  console.log("Insertando viajes...");
  await db.insert(viajes).values([
    {
      viajeId: V.v1,
      pasajeroId: U.maria,
      conductorId: C.carlos,
      estado: "completado",
      solicitadoEn: ts(10, 0, 0),
      aceptadoEn: ts(10, 0, 15),
      fechaPartida: ts(10, 4, 30),
      fechaLlegada: ts(10, 22, 45),
      origenLatitud: -34.6037,
      origenLongitud: -58.3816,
      destinoLatitud: -34.5875,
      destinoLongitud: -58.3952,
      distanciaKilometros: 4.2,
      duracionMinutos: 18,
      tarifaBase: "5000.00",
      multiplicador: 1.2,
      tarifaTotal: "8900.00",
    },
    {
      viajeId: V.v2,
      pasajeroId: U.juan,
      conductorId: C.ana,
      estado: "en_progreso",
      solicitadoEn: ts(14, 10, 0),
      aceptadoEn: ts(14, 10, 20),
      fechaPartida: ts(14, 15, 0),
      origenLatitud: -34.581,
      origenLongitud: -58.42,
      destinoLatitud: -34.61,
      destinoLongitud: -58.363,
      tarifaBase: "6500.00",
      multiplicador: 1.0,
    },
    {
      viajeId: V.v3,
      pasajeroId: U.sofia,
      conductorId: C.diego,
      estado: "aceptado",
      solicitadoEn: ts(16, 30, 0),
      aceptadoEn: ts(16, 30, 18),
      origenLatitud: -34.6097,
      origenLongitud: -58.3926,
      destinoLatitud: -34.6212,
      destinoLongitud: -58.3731,
      tarifaBase: "4000.00",
      multiplicador: 1.0,
    },
    {
      viajeId: V.v4,
      pasajeroId: U.lucas,
      conductorId: C.paula,
      estado: "solicitado",
      solicitadoEn: ts(18, 0, 0),
      origenLatitud: -34.6187,
      origenLongitud: -58.4412,
      destinoLatitud: -34.5592,
      destinoLongitud: -58.4156,
      tarifaBase: "7000.00",
      multiplicador: 1.5,
    },
    {
      viajeId: V.v5,
      pasajeroId: U.valentina,
      conductorId: C.martin,
      estado: "cancelado",
      solicitadoEn: ts(11, 45, 0),
      aceptadoEn: ts(11, 45, 30),
      origenLatitud: -34.5875,
      origenLongitud: -58.3952,
      destinoLatitud: -34.581,
      destinoLongitud: -58.42,
      tarifaBase: "5500.00",
      multiplicador: 1.0,
    },
    {
      viajeId: V.v6,
      pasajeroId: U.mateo,
      conductorId: C.carlos,
      estado: "completado",
      solicitadoEn: ts(9, 0, 0),
      aceptadoEn: ts(9, 0, 12),
      fechaPartida: ts(9, 5, 0),
      fechaLlegada: ts(9, 19, 0),
      origenLatitud: -34.61,
      origenLongitud: -58.363,
      destinoLatitud: -34.6037,
      destinoLongitud: -58.3816,
      distanciaKilometros: 3.1,
      duracionMinutos: 14,
      tarifaBase: "4500.00",
      multiplicador: 1.0,
      tarifaTotal: "6200.00",
    },
    {
      viajeId: V.v7,
      pasajeroId: U.camila,
      conductorId: C.ana,
      estado: "completado",
      solicitadoEn: ts(13, 20, 0),
      aceptadoEn: ts(13, 20, 25),
      fechaPartida: ts(13, 25, 0),
      fechaLlegada: ts(13, 37, 0),
      origenLatitud: -34.6212,
      origenLongitud: -58.3731,
      destinoLatitud: -34.6097,
      destinoLongitud: -58.3926,
      distanciaKilometros: 2.8,
      duracionMinutos: 12,
      tarifaBase: "4000.00",
      multiplicador: 1.0,
      tarifaTotal: "5400.00",
    },
    {
      viajeId: V.v8,
      pasajeroId: U.tomas,
      conductorId: C.diego,
      estado: "completado",
      solicitadoEn: ts(20, 0, 0),
      aceptadoEn: ts(20, 0, 40),
      fechaPartida: ts(20, 8, 0),
      fechaLlegada: ts(20, 36, 0),
      origenLatitud: -34.5592,
      origenLongitud: -58.4156,
      destinoLatitud: -34.6187,
      destinoLongitud: -58.4412,
      distanciaKilometros: 8.5,
      duracionMinutos: 28,
      tarifaBase: "9000.00",
      multiplicador: 1.3,
      tarifaTotal: "14800.00",
    },
    {
      viajeId: V.v9,
      pasajeroId: U.maria,
      conductorId: C.paula,
      estado: "completado",
      solicitadoEn: ts(15, 0, 0),
      aceptadoEn: ts(15, 0, 10),
      fechaPartida: ts(15, 4, 0),
      fechaLlegada: ts(15, 19, 0),
      origenLatitud: -34.581,
      origenLongitud: -58.42,
      destinoLatitud: -34.5875,
      destinoLongitud: -58.3952,
      distanciaKilometros: 3.6,
      duracionMinutos: 15,
      tarifaBase: "5000.00",
      multiplicador: 1.0,
      tarifaTotal: "7100.00",
    },
    {
      viajeId: V.v10,
      pasajeroId: U.juan,
      conductorId: C.carlos,
      estado: "completado",
      solicitadoEn: ts(8, 30, 0),
      aceptadoEn: ts(8, 30, 8),
      fechaPartida: ts(8, 33, 0),
      fechaLlegada: ts(8, 43, 0),
      origenLatitud: -34.6037,
      origenLongitud: -58.3816,
      destinoLatitud: -34.61,
      destinoLongitud: -58.363,
      distanciaKilometros: 2.5,
      duracionMinutos: 10,
      tarifaBase: "4000.00",
      multiplicador: 1.0,
      tarifaTotal: "5000.00",
    },
    {
      viajeId: V.v11,
      pasajeroId: U.sofia,
      conductorId: C.laura,
      estado: "completado",
      solicitadoEn: ts(17, 0, 0),
      aceptadoEn: ts(17, 0, 22),
      fechaPartida: ts(17, 5, 0),
      fechaLlegada: ts(17, 25, 0),
      origenLatitud: -34.5627,
      origenLongitud: -58.4558,
      destinoLatitud: -34.5436,
      destinoLongitud: -58.4617,
      distanciaKilometros: 5.3,
      duracionMinutos: 20,
      tarifaBase: "5500.00",
      multiplicador: 1.0,
      tarifaTotal: "8300.00",
    },
    {
      viajeId: V.v12,
      pasajeroId: U.lucas,
      conductorId: C.roberto,
      estado: "completado",
      solicitadoEn: ts(19, 30, 0),
      aceptadoEn: ts(19, 30, 35),
      fechaPartida: ts(19, 35, 0),
      fechaLlegada: ts(19, 51, 0),
      origenLatitud: -34.629,
      origenLongitud: -58.4638,
      destinoLatitud: -34.625,
      destinoLongitud: -58.412,
      distanciaKilometros: 4.0,
      duracionMinutos: 16,
      tarifaBase: "4800.00",
      multiplicador: 1.1,
      tarifaTotal: "7500.00",
    },
  ]);

  console.log("Insertando pagos...");
  await db.insert(pagos).values([
    { pagoId: "880e8400-e29b-41d4-a716-446655440001", viajeId: V.v1, monto: "8900.00", moneda: "ARS", metodo: "tarjeta_credito", estado: "capturado", procesadoEn: ts(10, 23, 0) },
    { pagoId: "880e8400-e29b-41d4-a716-446655440002", viajeId: V.v2, monto: "6500.00", moneda: "ARS", metodo: "tarjeta_debito", estado: "pendiente" },
    { pagoId: "880e8400-e29b-41d4-a716-446655440003", viajeId: V.v3, monto: "4000.00", moneda: "ARS", metodo: "tarjeta_credito", estado: "pendiente" },
    { pagoId: "880e8400-e29b-41d4-a716-446655440004", viajeId: V.v6, monto: "6200.00", moneda: "ARS", metodo: "tarjeta_debito", estado: "capturado", procesadoEn: ts(9, 19, 30) },
    { pagoId: "880e8400-e29b-41d4-a716-446655440005", viajeId: V.v7, monto: "5400.00", moneda: "ARS", metodo: "efectivo", estado: "capturado", procesadoEn: ts(13, 37, 30) },
    { pagoId: "880e8400-e29b-41d4-a716-446655440006", viajeId: V.v8, monto: "14800.00", moneda: "ARS", metodo: "tarjeta_credito", estado: "fallido", procesadoEn: ts(20, 36, 30) },
    { pagoId: "880e8400-e29b-41d4-a716-446655440007", viajeId: V.v9, monto: "7100.00", moneda: "ARS", metodo: "tarjeta_debito", estado: "reembolsado", procesadoEn: ts(15, 20, 0) },
    { pagoId: "880e8400-e29b-41d4-a716-446655440008", viajeId: V.v10, monto: "5000.00", moneda: "ARS", metodo: "efectivo", estado: "capturado", procesadoEn: ts(8, 43, 30) },
    { pagoId: "880e8400-e29b-41d4-a716-446655440009", viajeId: V.v11, monto: "8300.00", moneda: "ARS", metodo: "tarjeta_debito", estado: "capturado", procesadoEn: ts(17, 25, 30) },
    { pagoId: "880e8400-e29b-41d4-a716-44665544000a", viajeId: V.v12, monto: "7500.00", moneda: "ARS", metodo: "efectivo", estado: "capturado", procesadoEn: ts(19, 51, 30) },
  ]);

  const counts = await db.execute(sql`
    SELECT
      (SELECT COUNT(*)::int FROM usuarios) AS usuarios,
      (SELECT COUNT(*)::int FROM conductores) AS conductores,
      (SELECT COUNT(*)::int FROM viajes) AS viajes,
      (SELECT COUNT(*)::int FROM pagos) AS pagos
  `);

  const row = counts.rows[0] as {
    usuarios: number;
    conductores: number;
    viajes: number;
    pagos: number;
  };

  console.log("Seed completado:");
  console.log(`  usuarios:    ${row.usuarios}`);
  console.log(`  conductores: ${row.conductores}`);
  console.log(`  viajes:      ${row.viajes}`);
  console.log(`  pagos:       ${row.pagos}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error en seed:", err);
    process.exit(1);
  });
