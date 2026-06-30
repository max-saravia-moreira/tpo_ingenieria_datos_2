# Uber Viajes — Bases de datos MySQL y Cassandra

Proyecto del TPO con el modelo relacional del ciclo de vida de viajes (usuarios, conductores, vehículos, viajes y pagos), usando **MySQL**, **Cassandra**, **Drizzle ORM** y **TypeScript**.

Los diagramas del modelo están en [`DIAGRAMAS.md`](./DIAGRAMAS.md).

## Requisitos

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (para levantar MySQL y Cassandra localmente)

## Preparar Todo Desde Cero

1. Instalar las dependencias del proyecto:

```bash
npm install
```

2. Crear el archivo de entorno:

```bash
cp .env.example .env
```

Los valores por defecto apuntan a las bases levantadas con Docker Compose:

```env
DATABASE_URL=mysql://uber:uber@localhost:3306/uber_viajes
CASSANDRA_HOST=localhost
CASSANDRA_KEYSPACE=uber
CASSANDRA_DATACENTER=datacenter1
```

3. Levantar MySQL y Cassandra:

```bash
docker compose up -d
```

Este comando levanta ambas bases. Además, el servicio `cassandra-init` crea automáticamente el keyspace `uber` si todavía no existe.

4. Verificar que los contenedores estén healthy:

```bash
docker compose ps
```

5. Aplicar las migraciones de MySQL:

```bash
npm run mysql:migrate
```

6. Aplicar el esquema de Cassandra:

```bash
npm run cassandra:migrate
```

> Cassandra puede tardar cerca de un minuto en quedar disponible después de `docker compose up -d`. Si el comando reintenta la conexión, esperá a que el healthcheck termine y volvé a ejecutarlo si fuera necesario.

7. Cargar los datos de prueba en ambas bases:

```bash
npm run seed:all
```

Los seeds son **idempotentes**: borran las tablas y vuelven a insertar los registros definidos en `src/db/seed.ts` y `src/cassandra/seed.ts`.

8. Probar que la consulta Cassandra del TPO responde:

```bash
npm run cassandra:list
```

9. Opcionalmente, abrir Drizzle Studio para explorar MySQL:

```bash
npm run mysql:studio
```

### Comandos Útiles Del Setup

Alternativa para desarrollo rápido sin migraciones MySQL:

```bash
npm run mysql:push
```

Si modificás `src/db/schema.ts`, generá una nueva migración con:

```bash
npm run mysql:generate
npm run mysql:migrate
```

Para ejecutar los seeds por separado:

```bash
npm run mysql:seed
npm run cassandra:seed
```

Salida esperada del seed MySQL:

```text
Seed completado:
  usuarios:    18
  conductores: 10
  vehiculos:   10
  viajes:      12
  pagos:       10
```

Salida esperada del seed Cassandra:

```text
Seed Cassandra completado:
  conductores_por_zona: 10
```

## Datos de conexión local

MySQL:

- Host: `localhost`
- Puerto: `3306`
- Base de datos: `uber_viajes`
- Usuario: `uber`
- Password: `uber`
- URL: `mysql://uber:uber@localhost:3306/uber_viajes`

Cassandra:

- Host: `localhost`
- Puerto: `9042`
- Keyspace: `uber`
- Datacenter local: `datacenter1`
- Usuario/password: no configurados en Docker Compose

## Explorar los datos

Drizzle Studio abre una interfaz web para consultar las tablas:

```bash
npm run mysql:studio
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
| `npm run mysql:generate` | Genera migraciones a partir del schema MySQL |
| `npm run mysql:migrate` | Aplica migraciones pendientes de MySQL |
| `npm run mysql:push` | Sincroniza el schema MySQL directo a la base (sin migración) |
| `npm run mysql:seed` | Carga los datos de prueba en MySQL |
| `npm run mysql:studio` | Abre Drizzle Studio |
| `npm run cassandra:migrate` | Aplica el esquema CQL de Cassandra |
| `npm run cassandra:seed` | Carga `conductores_por_zona` en Cassandra |
| `npm run cassandra:list` | Lista hasta 5 conductores para un geohash |
| `npm run seed:all` | Corre el seed MySQL y luego el seed Cassandra |

## Estructura relevante

```
src/db/
  schema.ts   # Definición de tablas y relaciones
  index.ts    # Conexión a MySQL
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
docker-compose.yml # MySQL y Cassandra locales
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

### `mysql:migrate` se queda en "applying migrations..." y falla

Casi siempre la base no está disponible. Verificá el contenedor:

```bash
docker compose ps
docker compose logs mysql --tail 30
```

Si ves `Restarting`, reiniciá con volumen limpio (necesario si cambiaste de versión de MySQL):

```bash
docker compose down -v
docker compose up -d
```

> MySQL inicializa el usuario y la base solo cuando el volumen está vacío. Si cambiaste credenciales o nombre de base, recreá el volumen con `docker compose down -v`.

Esperá a que el healthcheck pase y volvé a migrar:

```bash
npm run mysql:migrate
```
