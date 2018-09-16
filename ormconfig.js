require('ts-node/register');
let SnakeCaseNamingStrategy = require("./src/config/naming.strategy").SnakeCaseNamingStrategy;

let base_configs = {
   type: "postgres",
   logging: true,
   synchronize: false,
   namingStrategy: new SnakeCaseNamingStrategy(),
   entities: [
      "dist/modules/**/*.entity.js"
   ],
   migrations: [
      "dist/migrations/*.js"
   ],
   subscribers: [
      "dist/modules/**/*.subscriber.js"
   ],
   cli: {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscriber"
   }
};

if(process.env.NODE_ENV == "production") {
   base_configs = Object.assign(base_configs, {
      url: process.env.DATABASE_URL
   });
} else {
   if (!process.env.MIGRATE) {
      base_configs.entities.push("src/modules/**/*.entity.ts");
   }

   base_configs = Object.assign(base_configs, {
      host: "db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "rescue_tracks"
   });
}

module.exports = base_configs;
