# Uber Viajes — Bases de datos PostgreSQL y Cassandra

Proyecto del TPO con el modelo relacional del ciclo de vida de viajes (usuarios, conductores, vehículos, viajes y pagos), usando **PostgreSQL**, **Cassandra**, **Drizzle ORM** y **TypeScript**.

## Requisitos

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (para levantar PostgreSQL y Cassandra localmente)

## Configuración inicial

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo de entorno:

```bash
cp .env.example .env
```

Los valores por defecto apuntan a las bases levantadas con Docker Compose:

```
DATABASE_URL=postgresql://uber:uber@localhost:5432/uber_viajes
CASSANDRA_HOST=localhost
CASSANDRA_KEYSPACE=uber
CASSANDRA_DATACENTER=datacenter1
```

## Datos de conexión local

PostgreSQL:

- Host: `localhost`
- Puerto: `5432`
- Base de datos: `uber_viajes`
- Usuario: `uber`
- Password: `uber`
- URL: `postgresql://uber:uber@localhost:5432/uber_viajes`

Cassandra:

- Host: `localhost`
- Puerto: `9042`
- Keyspace: `uber`
- Datacenter local: `datacenter1`
- Usuario/password: no configurados en Docker Compose

## Levantar las bases de datos

```bash
docker compose up -d
```

Este comando levanta PostgreSQL y Cassandra. Además, el servicio `cassandra-init` crea automáticamente el keyspace `uber` si todavía no existe.

Verificar que los contenedores estén healthy:

```bash
docker compose ps
```

## Crear el esquema

PostgreSQL:

**Primera vez** (aplica la migración inicial):

```bash
npm run postgres:migrate
```

Alternativa para desarrollo rápido sin migraciones:

```bash
npm run postgres:push
```

Si modificás `src/db/schema.ts`, generá una nueva migración con:

```bash
npm run postgres:generate
npm run postgres:migrate
```

Cassandra:

```bash
npm run cassandra:migrate
```

> Cassandra puede tardar cerca de un minuto en quedar disponible después de `docker compose up -d`. Si el comando reintenta la conexión, esperá a que el healthcheck termine y volvé a ejecutarlo si fuera necesario.

## Cargar datos de prueba (seed)

Los seeds son **idempotentes**: borran las tablas y vuelven a insertar los registros definidos en `src/db/seed.ts` y `src/cassandra/seed.ts`.

PostgreSQL:

```bash
npm run postgres:seed
```

Salida esperada:

```
Seed completado:
  usuarios:    18
  conductores: 10
  vehiculos:   10
  viajes:      12
  pagos:       10
```

Cassandra:

```bash
npm run cassandra:seed
```

Salida esperada:

```
Seed Cassandra completado:
  conductores_por_zona: 10
```

También podés correr ambos seeds en secuencia:

```bash
npm run seed:all
```

## Explorar los datos

Drizzle Studio abre una interfaz web para consultar las tablas:

```bash
npm run postgres:studio
```

Para probar la consulta Cassandra del TPO, que lista hasta 5 conductores por zona (`geohash`):

```bash
npm run cassandra:list
```

El comando usa un geohash de ejemplo incluido en el seed. También acepta uno explícito:

```bash
npm run cassandra:list -- 69y7p
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run postgres:generate` | Genera migraciones a partir del schema PostgreSQL |
| `npm run postgres:migrate` | Aplica migraciones pendientes de PostgreSQL |
| `npm run postgres:push` | Sincroniza el schema PostgreSQL directo a la base (sin migración) |
| `npm run postgres:seed` | Carga los datos de prueba en PostgreSQL |
| `npm run postgres:studio` | Abre Drizzle Studio |
| `npm run cassandra:migrate` | Aplica el esquema CQL de Cassandra |
| `npm run cassandra:seed` | Carga `conductores_por_zona` en Cassandra |
| `npm run cassandra:list` | Lista hasta 5 conductores para un geohash |
| `npm run seed:all` | Corre el seed PostgreSQL y luego el seed Cassandra |

## Estructura relevante

```
src/db/
  schema.ts   # Definición de tablas y relaciones
  index.ts    # Conexión a PostgreSQL
  seed.ts     # Datos de prueba
src/cassandra/
  index.ts    # Conexión a Cassandra
  migrate.ts  # Aplica cassandra/schema.cql
  seed.ts     # Datos de prueba para consultas por geohash
  queries.ts  # Consultas Cassandra
src/scripts/
  list-conductores-zona.ts # Demo de consulta por geohash
cassandra/
  schema.cql  # Keyspace y tabla conductores_por_zona
drizzle/      # Migraciones SQL
docker-compose.yml # PostgreSQL y Cassandra locales
```

La tabla `viajes` referencia el `vehiculo_id` asignado, por lo que una consulta del viaje puede mostrar el auto que ve el pasajero: patente, marca, modelo y color.

## Detener la base de datos

```bash
docker compose down
```

Para eliminar también el volumen con los datos persistidos:

```bash
docker compose down -v
```

## Problemas frecuentes

### `postgres:migrate` se queda en "applying migrations..." y falla

Casi siempre la base no está disponible. Verificá el contenedor:

```bash
docker compose ps
docker compose logs postgres --tail 30
```

Si ves `Restarting`, reiniciá con volumen limpio (necesario si cambiaste de versión de PostgreSQL):

```bash
docker compose down -v
docker compose up -d
```

> **PostgreSQL 18+** requiere montar el volumen en `/var/lib/postgresql` (no en `/var/lib/postgresql/data`). Este proyecto ya usa esa configuración.

Esperá a que el healthcheck pase y volvé a migrar:

```bash
npm run postgres:migrate
```
