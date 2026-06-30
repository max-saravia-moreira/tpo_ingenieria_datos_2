# Uber Viajes — Base de datos PostgreSQL

Proyecto del TPO con el modelo relacional del ciclo de vida de viajes (usuarios, conductores, viajes y pagos), usando **PostgreSQL**, **Drizzle ORM** y **TypeScript**.

## Requisitos

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (para levantar PostgreSQL localmente)

## Configuración inicial

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo de entorno:

```bash
cp .env.example .env
```

El valor por defecto de `DATABASE_URL` apunta a la base levantada con Docker Compose:

```
postgresql://uber:uber@localhost:5432/uber_viajes
```

## Levantar la base de datos

```bash
docker compose up -d
```

Verificar que el contenedor esté healthy:

```bash
docker compose ps
```

## Crear el esquema

**Primera vez** (aplica la migración inicial):

```bash
npm run db:migrate
```

Alternativa para desarrollo rápido sin migraciones:

```bash
npm run db:push
```

Si modificás `src/db/schema.ts`, generá una nueva migración con:

```bash
npm run db:generate
npm run db:migrate
```

## Cargar datos de prueba (seed)

El seed es **idempotente**: borra las tablas y vuelve a insertar los registros definidos en `src/db/seed.ts`.

```bash
npm run db:seed
```

Salida esperada:

```
Seed completado:
  usuarios:    18
  conductores: 10
  viajes:      12
  pagos:       10
```

## Explorar los datos

Drizzle Studio abre una interfaz web para consultar las tablas:

```bash
npm run db:studio
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run db:generate` | Genera migraciones a partir del schema |
| `npm run db:migrate` | Aplica migraciones pendientes |
| `npm run db:push` | Sincroniza el schema directo a la base (sin migración) |
| `npm run db:seed` | Carga los datos de prueba |
| `npm run db:studio` | Abre Drizzle Studio |

## Estructura relevante

```
src/db/
  schema.ts   # Definición de tablas y relaciones
  index.ts    # Conexión a PostgreSQL
  seed.ts     # Datos de prueba
drizzle/      # Migraciones SQL
docker-compose.yml
```

## Detener la base de datos

```bash
docker compose down
```

Para eliminar también el volumen con los datos persistidos:

```bash
docker compose down -v
```

## Problemas frecuentes

### `db:migrate` se queda en "applying migrations..." y falla

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
npm run db:migrate
```
