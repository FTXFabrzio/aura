"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, X-AURA-KEY, X-AURA-SECRET',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Aura Control Plane API')
        .setDescription('The Aura API description')
        .setVersion('1.0')
        .addTag('aura')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger docs at: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map