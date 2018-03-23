import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';

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

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule, configureServer());
	await app.listen(PORT);
	console.log(`App listening on port ${PORT}`);
}
bootstrap();
