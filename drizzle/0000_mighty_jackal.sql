CREATE TYPE "public"."estado_pago" AS ENUM('pendiente', 'capturado', 'fallido', 'reembolsado');--> statement-breakpoint
CREATE TYPE "public"."estado_viaje" AS ENUM('solicitado', 'aceptado', 'en_progreso', 'completado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."metodo_pago" AS ENUM('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'billetera_virtual');--> statement-breakpoint
CREATE TYPE "public"."tipo_vehiculo" AS ENUM('uberX', 'uberXL', 'black', 'moto');--> statement-breakpoint
CREATE TABLE "conductores" (
	"conductor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"licencia" varchar(50) NOT NULL,
	"tipo_vehiculo" "tipo_vehiculo" NOT NULL,
	"calificacion" numeric(3, 2) DEFAULT '5.00' NOT NULL,
	"viajes_total" integer DEFAULT 0 NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "conductores_usuario_id_unique" UNIQUE("usuario_id"),
	CONSTRAINT "conductores_licencia_unique" UNIQUE("licencia")
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"pago_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viaje_id" uuid NOT NULL,
	"monto" numeric(10, 2) NOT NULL,
	"moneda" char(3) DEFAULT 'USD' NOT NULL,
	"metodo" "metodo_pago" NOT NULL,
	"estado" "estado_pago" DEFAULT 'pendiente' NOT NULL,
	"procesado_en" timestamp with time zone,
	CONSTRAINT "pagos_viaje_id_unique" UNIQUE("viaje_id")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"usuario_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"correo" varchar(255) NOT NULL,
	"telefono" varchar(20) NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "usuarios_correo_unique" UNIQUE("correo")
);
--> statement-breakpoint
CREATE TABLE "viajes" (
	"viaje_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pasajero_id" uuid NOT NULL,
	"conductor_id" uuid NOT NULL,
	"estado" "estado_viaje" DEFAULT 'solicitado' NOT NULL,
	"solicitado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"aceptado_en" timestamp with time zone,
	"fecha_partida" timestamp with time zone,
	"fecha_llegada" timestamp with time zone,
	"origen_latitud" double precision NOT NULL,
	"origen_longitud" double precision NOT NULL,
	"destino_latitud" double precision,
	"destino_longitud" double precision,
	"distancia_kilometros" real,
	"duracion_minutos" integer,
	"tarifa_base" numeric(10, 2) NOT NULL,
	"multiplicador" real DEFAULT 1 NOT NULL,
	"tarifa_total" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "conductores" ADD CONSTRAINT "conductores_usuario_id_usuarios_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("usuario_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_viaje_id_viajes_viaje_id_fk" FOREIGN KEY ("viaje_id") REFERENCES "public"."viajes"("viaje_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_pasajero_id_usuarios_usuario_id_fk" FOREIGN KEY ("pasajero_id") REFERENCES "public"."usuarios"("usuario_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_conductor_id_conductores_conductor_id_fk" FOREIGN KEY ("conductor_id") REFERENCES "public"."conductores"("conductor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_conductores_tipo_vehiculo" ON "conductores" USING btree ("tipo_vehiculo");--> statement-breakpoint
CREATE INDEX "idx_conductores_calificacion" ON "conductores" USING btree ("calificacion");--> statement-breakpoint
CREATE INDEX "idx_pagos_estado" ON "pagos" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "idx_usuarios_telefono" ON "usuarios" USING btree ("telefono");--> statement-breakpoint
CREATE INDEX "idx_viajes_pasajero_id" ON "viajes" USING btree ("pasajero_id");--> statement-breakpoint
CREATE INDEX "idx_viajes_conductor_id" ON "viajes" USING btree ("conductor_id");--> statement-breakpoint
CREATE INDEX "idx_viajes_estado" ON "viajes" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "idx_viajes_solicitado_en" ON "viajes" USING btree ("solicitado_en");