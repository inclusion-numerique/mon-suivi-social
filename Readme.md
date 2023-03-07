# Mon Suivi Social

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/inclusion-numerique/mon-suivi-social/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/inclusion-numerique/mon-espace-collectivite/tree/main)

### Setup

#### Dependencies

This projects uses pnpm as a package manager.
https://pnpm.io/

`pnpm install`

Database client is Prisma https://www.prisma.io/

#### Environment

Environment variables are all stored in a .env file
`cp .env.dist .env`
Ask a team developer for values

#### Database

copy env variables

```sh
cp .env.dist .env

## fill .env file
```

start postgres

```sh
pnpm db:start
```

generate the prisma client

```sh
pnpm prisma:generate
```

setup your schema

```sh
pnpm prisma:migrate
```

seed your database with fixtures

```sh
pnpm prisma:seed
```

### Dev

To run the web app development server:
`pnpm -F web dev`

### Misc utility commands

Using ncu for updating dependencies :
`ncu -u && cd apps/web && ncu -u && cd ../cli && ncu -u && cd ../../packages/cdk && ncu -u && cd ../e2e && ncu -u && cd ../emails && ncu -u && cd ../lint && ncu -u && cd ../storybook && ncu -u && cd ../test && ncu -u && cd ../..`

### Testing

Les tests unitaires du projet sont définis dans les fichiers `.spec.ts`. Chacun de ces fichiers doit être placé à côté du fichier qu'il teste. Les tests sont exécutés grâce à l'utilitaire [Jest](https://jestjs.io/).

Exécutez l'ensemble des tests :

```bash
pnpm test
```

En phase de développement, vous pouvez exécuter les tests avec un _watcher_ qui relance les tests à chaque modification :

```bash
pnpm test -- -- --watch
```
