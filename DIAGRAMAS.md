# Diagramas de base de datos

## Diagrama entidad-relación MySQL

```mermaid
erDiagram
  USUARIOS {
    usuario_id uuid PK
    correo varchar UK
    telefono varchar
    nombre varchar
    creado_en timestamp
    activo boolean
  }

  CONDUCTORES {
    conductor_id uuid PK
    usuario_id uuid FK, UK
    licencia varchar UK
    calificacion decimal
    viajes_total integer
    activo boolean
  }

  VEHICULOS {
    vehiculo_id uuid PK
    conductor_id uuid FK
    patente varchar UK
    marca varchar
    modelo varchar
    color varchar
    tipo_vehiculo varchar
    activo boolean
  }

  VIAJES {
    viaje_id uuid PK
    pasajero_id uuid FK
    conductor_id uuid FK
    vehiculo_id uuid FK
    estado varchar
    solicitado_en timestamp
    aceptado_en timestamp
    fecha_partida timestamp
    fecha_llegada timestamp
    origen_latitud double
    origen_longitud double
    destino_latitud double
    destino_longitud double
    distancia_kilometros real
    duracion_minutos integer
    tarifa_base decimal
    multiplicador real
    tarifa_total decimal
  }

  PAGOS {
    pago_id uuid PK
    viaje_id uuid FK, UK
    monto decimal
    moneda char
    metodo varchar
    estado varchar
    procesado_en timestamp
  }

  USUARIOS ||--o| CONDUCTORES : "puede ser"
  CONDUCTORES ||--o{ VEHICULOS : "maneja"
  USUARIOS ||--o{ VIAJES : "solicita"
  CONDUCTORES ||--o{ VIAJES : "realiza"
  VEHICULOS ||--o{ VIAJES : "se usa en"
  VIAJES ||--o| PAGOS : "genera"
```

## Diagrama/tabla Cassandra

Tabla `conductores_por_zona`.

| Nombre | Tipo | Observación |
|--------|------|-------------|
| `geohash` | `text` | PK = PARTITION KEY |
| `tipo_vehiculo` | `text` | CK = CLUSTERING KEY |
| `calificacion` | `decimal` | CK = CLUSTERING KEY |
| `patente` | `text` | CK = CLUSTERING KEY |
| `nombre` | `text` |  |
| `licencia` | `text` |  |
| `viajes_total` | `int` |  |
| `marca` | `text` |  |
| `modelo` | `text` |  |
| `color` | `text` |  |
| `updated_at` | `timestamp` |  |
