import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';

const PORT = Number(process.env.PORT) || 9000;

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	await app.listen(PORT);
	console.log(`App listening on port ${PORT}`);
}
bootstrap();
