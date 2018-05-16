import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import { NestFactory } from '@nestjs/core';
import { INestApplication } from "@nestjs/common";
import { ApplicationModule } from './modules/app.module';
import { UserModule } from "./modules/user/user.module";
import { RequiredPermissionGuard } from "./modules/user/required-permission.guard";

const PORT = Number(process.env.PORT) || 9000;

function configureServer(): express.Application {
    const server = express();

    server.use(bodyParser.json());
    server.use(cors());

    server.use((req, res, next) => {
        res.header("access-control-expose-headers", `
            Content-Length
            X-JWT
        `.trim().replace(/\s+/g, ","));
        next();
    })

    return server;
}

function addPermissionsGuard(app: INestApplication): void {
    const permissionsGuard = app.select(UserModule).get(RequiredPermissionGuard);

    app.useGlobalGuards(permissionsGuard);
}

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule, {
        cors: {
            exposedHeaders: ["Content-Length", "X-JWT"]
        },
        bodyParser: true
    });//configureServer());

    addPermissionsGuard(app);

    await app.listen(PORT);
	console.log(`App listening on port ${PORT}`);
}
bootstrap();
