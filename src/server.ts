import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import { NestFactory } from '@nestjs/core';
import { INestApplication } from "@nestjs/common";
import { ApplicationModule } from './modules/app.module';
import { UserModule } from "./modules/user/user.module";
import { RequiredPermissionGuard } from "./modules/user/required-permission.guard";

const PORT = Number(process.env.PORT) || 9000;

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
    });

    addPermissionsGuard(app);

    await app.listen(PORT);
	console.log(`App listening on port ${PORT}`);
}
bootstrap();
