<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar Repo
1. Ejecutar

```{bash}
yarn install
```

3. Asegurarse de tener instalado NestCli

```bash
npm i -g @nestjs/cli
```

4. Levantar Base de datos en mongodb

```bash
docker compose up -d

```

5. Reconstruir base de datos de desarrollo con semilla

```bash
http://localhost:300/api/v2/seed

```

## Stack usado

- Nest
- MongoDB
