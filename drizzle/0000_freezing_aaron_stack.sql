CREATE TABLE `conductores` (
	`conductor_id` varchar(36) NOT NULL,
	`usuario_id` varchar(36) NOT NULL,
	`licencia` varchar(50) NOT NULL,
	`calificacion` decimal(3,2) NOT NULL DEFAULT '5.00',
	`viajes_total` int NOT NULL DEFAULT 0,
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `conductores_conductor_id` PRIMARY KEY(`conductor_id`),
	CONSTRAINT `conductores_usuario_id_unique` UNIQUE(`usuario_id`),
	CONSTRAINT `conductores_licencia_unique` UNIQUE(`licencia`)
);
--> statement-breakpoint
CREATE TABLE `pagos` (
	`pago_id` varchar(36) NOT NULL,
	`viaje_id` varchar(36) NOT NULL,
	`monto` decimal(10,2) NOT NULL,
	`moneda` char(3) NOT NULL DEFAULT 'ARS',
	`metodo` enum('tarjeta_credito','tarjeta_debito','efectivo','billetera_virtual') NOT NULL,
	`estado` enum('pendiente','capturado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
	`procesado_en` timestamp,
	CONSTRAINT `pagos_pago_id` PRIMARY KEY(`pago_id`),
	CONSTRAINT `pagos_viaje_id_unique` UNIQUE(`viaje_id`)
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`usuario_id` varchar(36) NOT NULL,
	`correo` varchar(255) NOT NULL,
	`telefono` varchar(20) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`creado_en` timestamp NOT NULL DEFAULT (now()),
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `usuarios_usuario_id` PRIMARY KEY(`usuario_id`),
	CONSTRAINT `usuarios_correo_unique` UNIQUE(`correo`)
);
--> statement-breakpoint
CREATE TABLE `vehiculos` (
	`vehiculo_id` varchar(36) NOT NULL,
	`conductor_id` varchar(36) NOT NULL,
	`patente` varchar(10) NOT NULL,
	`marca` varchar(80) NOT NULL,
	`modelo` varchar(80) NOT NULL,
	`color` varchar(40) NOT NULL,
	`tipo_vehiculo` enum('uberX','uberXL','black','moto') NOT NULL,
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `vehiculos_vehiculo_id` PRIMARY KEY(`vehiculo_id`),
	CONSTRAINT `vehiculos_patente_unique` UNIQUE(`patente`)
);
--> statement-breakpoint
CREATE TABLE `viajes` (
	`viaje_id` varchar(36) NOT NULL,
	`pasajero_id` varchar(36) NOT NULL,
	`conductor_id` varchar(36) NOT NULL,
	`vehiculo_id` varchar(36) NOT NULL,
	`estado` enum('solicitado','aceptado','en_progreso','completado','cancelado') NOT NULL DEFAULT 'solicitado',
	`solicitado_en` timestamp NOT NULL DEFAULT (now()),
	`aceptado_en` timestamp,
	`fecha_partida` timestamp,
	`fecha_llegada` timestamp,
	`origen_latitud` double NOT NULL,
	`origen_longitud` double NOT NULL,
	`destino_latitud` double,
	`destino_longitud` double,
	`distancia_kilometros` float,
	`duracion_minutos` int,
	`tarifa_base` decimal(10,2) NOT NULL,
	`multiplicador` float NOT NULL DEFAULT 1,
	`tarifa_total` decimal(10,2),
	CONSTRAINT `viajes_viaje_id` PRIMARY KEY(`viaje_id`)
);
--> statement-breakpoint
ALTER TABLE `conductores` ADD CONSTRAINT `conductores_usuario_id_usuarios_usuario_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_viaje_id_viajes_viaje_id_fk` FOREIGN KEY (`viaje_id`) REFERENCES `viajes`(`viaje_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehiculos` ADD CONSTRAINT `vehiculos_conductor_id_conductores_conductor_id_fk` FOREIGN KEY (`conductor_id`) REFERENCES `conductores`(`conductor_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `viajes` ADD CONSTRAINT `viajes_pasajero_id_usuarios_usuario_id_fk` FOREIGN KEY (`pasajero_id`) REFERENCES `usuarios`(`usuario_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `viajes` ADD CONSTRAINT `viajes_conductor_id_conductores_conductor_id_fk` FOREIGN KEY (`conductor_id`) REFERENCES `conductores`(`conductor_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `viajes` ADD CONSTRAINT `viajes_vehiculo_id_vehiculos_vehiculo_id_fk` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos`(`vehiculo_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_conductores_calificacion` ON `conductores` (`calificacion`);--> statement-breakpoint
CREATE INDEX `idx_pagos_estado` ON `pagos` (`estado`);--> statement-breakpoint
CREATE INDEX `idx_usuarios_telefono` ON `usuarios` (`telefono`);--> statement-breakpoint
CREATE INDEX `idx_vehiculos_conductor_id` ON `vehiculos` (`conductor_id`);--> statement-breakpoint
CREATE INDEX `idx_vehiculos_tipo_vehiculo` ON `vehiculos` (`tipo_vehiculo`);--> statement-breakpoint
CREATE INDEX `idx_viajes_pasajero_id` ON `viajes` (`pasajero_id`);--> statement-breakpoint
CREATE INDEX `idx_viajes_conductor_id` ON `viajes` (`conductor_id`);--> statement-breakpoint
CREATE INDEX `idx_viajes_vehiculo_id` ON `viajes` (`vehiculo_id`);--> statement-breakpoint
CREATE INDEX `idx_viajes_estado` ON `viajes` (`estado`);--> statement-breakpoint
CREATE INDEX `idx_viajes_solicitado_en` ON `viajes` (`solicitado_en`);