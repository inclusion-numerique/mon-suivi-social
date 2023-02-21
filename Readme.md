# Mon Suivi Social

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/inclusion-numerique/mon-suivi-social/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/inclusion-numerique/mon-espace-collectivite/tree/main)


### Setup

#### Dependencies
This projects uses pnpm as a package manager.
https://pnpm.io/

`pnpm install`

#### Environment

Environment variables are all stored in a .env file
`cp .env.dist .env`
Ask a team developer for values

#### Database

You need a postgresql database setup for usint the app in dev environment.
When setup, add the database connection string in `.env`

Database client is Prisma https://www.prisma.io/ 

Run `pnpm -F web prisma:generate` to geneate the prisma client, then `pnpm -F web prisma migrate deploy` to setup your schema.

To seed your database with fixtures, run `pnpm -F cli fixtures:load`


### Dev

To run the web app development server: 
`pnpm -F web dev`


### Misc utility commands

Using ncu for updating dependencies : 
`cd apps/web && ncu -u && cd ../cli && ncu -u && cd ../../packages/cdk && ncu -u && cd ../e2e && ncu -u && cd ../emails && ncu -u && cd ../lint && ncu -u && cd ../storybook && ncu -u && cd ../test && ncu -u && cd ../..`
