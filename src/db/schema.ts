import { relations } from "drizzle-orm";
import {
  boolean,
  char,
  decimal,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Enumeraciones ───────────────────────────────────────

export const estadoViajeEnum = pgEnum("estado_viaje", [
  "solicitado",
  "aceptado",
  "en_progreso",
  "completado",
  "cancelado",
]);

export const metodoPagoEnum = pgEnum("metodo_pago", [
  "tarjeta_credito",
  "tarjeta_debito",
  "efectivo",
  "billetera_virtual",
]);

export const estadoPagoEnum = pgEnum("estado_pago", [
  "pendiente",
  "capturado",
  "fallido",
  "reembolsado",
]);

export const tipoVehiculoEnum = pgEnum("tipo_vehiculo", [
  "uberX",
  "uberXL",
  "black",
  "moto",
]);

// ─── Tablas ──────────────────────────────────────────────

export const usuarios = pgTable(
  "usuarios",
  {
    usuarioId: uuid("usuario_id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    telefono: varchar("telefono", { length: 20 }).notNull(),
    nombre: varchar("nombre", { length: 255 }).notNull(),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
    activo: boolean("activo").notNull().default(true),
  },
  (table) => [index("idx_usuarios_telefono").on(table.telefono)],
);

export const conductores = pgTable(
  "conductores",
  {
    conductorId: uuid("conductor_id").primaryKey().defaultRandom(),
    usuarioId: uuid("usuario_id")
      .notNull()
      .unique()
      .references(() => usuarios.usuarioId),
    licencia: varchar("licencia", { length: 50 }).notNull().unique(),
    tipoVehiculo: tipoVehiculoEnum("tipo_vehiculo").notNull(),
    calificacion: decimal("calificacion", { precision: 3, scale: 2 })
      .notNull()
      .default("5.00"),
    viajesTotal: integer("viajes_total").notNull().default(0),
    activo: boolean("activo").notNull().default(true),
  },
  (table) => [
    index("idx_conductores_tipo_vehiculo").on(table.tipoVehiculo),
    index("idx_conductores_calificacion").on(table.calificacion),
  ],
);

export const viajes = pgTable(
  "viajes",
  {
    viajeId: uuid("viaje_id").primaryKey().defaultRandom(),
    pasajeroId: uuid("pasajero_id")
      .notNull()
      .references(() => usuarios.usuarioId),
    conductorId: uuid("conductor_id")
      .notNull()
      .references(() => conductores.conductorId),
    estado: estadoViajeEnum("estado").notNull().default("solicitado"),
    solicitadoEn: timestamp("solicitado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
    aceptadoEn: timestamp("aceptado_en", { withTimezone: true }),
    pickupEn: timestamp("pickup_en", { withTimezone: true }),
    dropoffEn: timestamp("dropoff_en", { withTimezone: true }),
    pickupLat: doublePrecision("pickup_lat").notNull(),
    pickupLng: doublePrecision("pickup_lng").notNull(),
    dropoffLat: doublePrecision("dropoff_lat"),
    dropoffLng: doublePrecision("dropoff_lng"),
    distanciaKm: real("distancia_km"),
    duracionMin: integer("duracion_min"),
    tarifaBase: decimal("tarifa_base", { precision: 10, scale: 2 }).notNull(),
    multiplicador: real("multiplicador").notNull().default(1.0),
    tarifaTotal: decimal("tarifa_total", { precision: 10, scale: 2 }),
  },
  (table) => [
    index("idx_viajes_pasajero_id").on(table.pasajeroId),
    index("idx_viajes_conductor_id").on(table.conductorId),
    index("idx_viajes_estado").on(table.estado),
    index("idx_viajes_solicitado_en").on(table.solicitadoEn),
  ],
);

export const pagos = pgTable(
  "pagos",
  {
    pagoId: uuid("pago_id").primaryKey().defaultRandom(),
    viajeId: uuid("viaje_id")
      .notNull()
      .unique()
      .references(() => viajes.viajeId),
    monto: decimal("monto", { precision: 10, scale: 2 }).notNull(),
    moneda: char("moneda", { length: 3 }).notNull().default("USD"),
    metodo: metodoPagoEnum("metodo").notNull(),
    estado: estadoPagoEnum("estado").notNull().default("pendiente"),
    procesadoEn: timestamp("procesado_en", { withTimezone: true }),
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
