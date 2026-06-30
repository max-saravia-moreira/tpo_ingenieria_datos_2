import { randomUUID } from "node:crypto";
import { relations } from "drizzle-orm";
import {
  boolean,
  char,
  decimal,
  double,
  float,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const uuidColumn = (name: string) => varchar(name, { length: 36 });
const uuidPrimaryKey = (name: string) =>
  uuidColumn(name).primaryKey().$defaultFn(randomUUID);

// ─── Enumeraciones ───────────────────────────────────────

export const estadoViajeValues = [
  "solicitado",
  "aceptado",
  "en_progreso",
  "completado",
  "cancelado",
] as const;

export const metodoPagoValues = [
  "tarjeta_credito",
  "tarjeta_debito",
  "efectivo",
  "billetera_virtual",
] as const;

export const estadoPagoValues = [
  "pendiente",
  "capturado",
  "fallido",
  "reembolsado",
] as const;

export const tipoVehiculoValues = [
  "uberX",
  "uberXL",
  "black",
  "moto",
] as const;

// ─── Tablas ──────────────────────────────────────────────

export const usuarios = mysqlTable(
  "usuarios",
  {
    usuarioId: uuidPrimaryKey("usuario_id"),
    correo: varchar("correo", { length: 255 }).notNull().unique(),
    telefono: varchar("telefono", { length: 20 }).notNull(),
    nombre: varchar("nombre", { length: 255 }).notNull(),
    creadoEn: timestamp("creado_en", { mode: "date" })
      .notNull()
      .defaultNow(),
    activo: boolean("activo").notNull().default(true),
  },
  (table) => [index("idx_usuarios_telefono").on(table.telefono)],
);

export const conductores = mysqlTable(
  "conductores",
  {
    conductorId: uuidPrimaryKey("conductor_id"),
    usuarioId: uuidColumn("usuario_id")
      .notNull()
      .unique()
      .references(() => usuarios.usuarioId),
    licencia: varchar("licencia", { length: 50 }).notNull().unique(),
    calificacion: decimal("calificacion", { precision: 3, scale: 2 })
      .notNull()
      .default("5.00"),
    viajesTotal: int("viajes_total").notNull().default(0),
    activo: boolean("activo").notNull().default(true),
  },
  (table) => [index("idx_conductores_calificacion").on(table.calificacion)],
);

export const vehiculos = mysqlTable(
  "vehiculos",
  {
    vehiculoId: uuidPrimaryKey("vehiculo_id"),
    conductorId: uuidColumn("conductor_id")
      .notNull()
      .references(() => conductores.conductorId),
    patente: varchar("patente", { length: 10 }).notNull().unique(),
    marca: varchar("marca", { length: 80 }).notNull(),
    modelo: varchar("modelo", { length: 80 }).notNull(),
    color: varchar("color", { length: 40 }).notNull(),
    tipoVehiculo: mysqlEnum("tipo_vehiculo", tipoVehiculoValues).notNull(),
    activo: boolean("activo").notNull().default(true),
  },
  (table) => [
    index("idx_vehiculos_conductor_id").on(table.conductorId),
    index("idx_vehiculos_tipo_vehiculo").on(table.tipoVehiculo),
  ],
);

export const viajes = mysqlTable(
  "viajes",
  {
    viajeId: uuidPrimaryKey("viaje_id"),
    pasajeroId: uuidColumn("pasajero_id")
      .notNull()
      .references(() => usuarios.usuarioId),
    conductorId: uuidColumn("conductor_id")
      .notNull()
      .references(() => conductores.conductorId),
    vehiculoId: uuidColumn("vehiculo_id")
      .notNull()
      .references(() => vehiculos.vehiculoId),
    estado: mysqlEnum("estado", estadoViajeValues)
      .notNull()
      .default("solicitado"),
    solicitadoEn: timestamp("solicitado_en", { mode: "date" })
      .notNull()
      .defaultNow(),
    aceptadoEn: timestamp("aceptado_en", { mode: "date" }),
    fechaPartida: timestamp("fecha_partida", { mode: "date" }),
    fechaLlegada: timestamp("fecha_llegada", { mode: "date" }),
    origenLatitud: double("origen_latitud").notNull(),
    origenLongitud: double("origen_longitud").notNull(),
    destinoLatitud: double("destino_latitud"),
    destinoLongitud: double("destino_longitud"),
    distanciaKilometros: float("distancia_kilometros"),
    duracionMinutos: int("duracion_minutos"),
    tarifaBase: decimal("tarifa_base", { precision: 10, scale: 2 }).notNull(),
    multiplicador: float("multiplicador").notNull().default(1.0),
    tarifaTotal: decimal("tarifa_total", { precision: 10, scale: 2 }),
  },
  (table) => [
    index("idx_viajes_pasajero_id").on(table.pasajeroId),
    index("idx_viajes_conductor_id").on(table.conductorId),
    index("idx_viajes_vehiculo_id").on(table.vehiculoId),
    index("idx_viajes_estado").on(table.estado),
    index("idx_viajes_solicitado_en").on(table.solicitadoEn),
  ],
);

export const pagos = mysqlTable(
  "pagos",
  {
    pagoId: uuidPrimaryKey("pago_id"),
    viajeId: uuidColumn("viaje_id")
      .notNull()
      .unique()
      .references(() => viajes.viajeId),
    monto: decimal("monto", { precision: 10, scale: 2 }).notNull(),
    moneda: char("moneda", { length: 3 }).notNull().default("ARS"),
    metodo: mysqlEnum("metodo", metodoPagoValues).notNull(),
    estado: mysqlEnum("estado", estadoPagoValues).notNull().default("pendiente"),
    procesadoEn: timestamp("procesado_en", { mode: "date" }),
  },
  (table) => [index("idx_pagos_estado").on(table.estado)],
);

// ─── Relaciones ───────────────────────────────────────────

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  conductor: one(conductores, {
    fields: [usuarios.usuarioId],
    references: [conductores.usuarioId],
  }),
  viajesComoPasajero: many(viajes),
}));

export const conductoresRelations = relations(conductores, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [conductores.usuarioId],
    references: [usuarios.usuarioId],
  }),
  vehiculos: many(vehiculos),
  viajes: many(viajes),
}));

export const vehiculosRelations = relations(vehiculos, ({ one, many }) => ({
  conductor: one(conductores, {
    fields: [vehiculos.conductorId],
    references: [conductores.conductorId],
  }),
  viajes: many(viajes),
}));

export const viajesRelations = relations(viajes, ({ one }) => ({
  pasajero: one(usuarios, {
    fields: [viajes.pasajeroId],
    references: [usuarios.usuarioId],
  }),
  conductor: one(conductores, {
    fields: [viajes.conductorId],
    references: [conductores.conductorId],
  }),
  vehiculo: one(vehiculos, {
    fields: [viajes.vehiculoId],
    references: [vehiculos.vehiculoId],
  }),
  pago: one(pagos, {
    fields: [viajes.viajeId],
    references: [pagos.viajeId],
  }),
}));

export const pagosRelations = relations(pagos, ({ one }) => ({
  viaje: one(viajes, {
    fields: [pagos.viajeId],
    references: [viajes.viajeId],
  }),
}));
