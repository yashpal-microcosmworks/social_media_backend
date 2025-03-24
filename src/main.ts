import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RuntimeExceptionFilter } from 'src/common/filters/runtimeException.filter';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BootstrapService } from './bootstrap.service';
import * as passport from 'passport';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
declare const module: any;

import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

async function createDatabaseAndTables() {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
  ];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing environment variable: ${envVar}`);
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }

  const dbName = process.env.DB_DATABASE;

  const baseConnectionOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: '', // No database initially
    synchronize: false, // Disable sync initially
  };

  const baseDataSource = new DataSource(baseConnectionOptions);

  try {
    // Initialize the base connection (without specifying a database)
    await baseDataSource.initialize();
    console.log('Connection initialized (without database)');

    // Check if the database exists
    const dbExists = await baseDataSource.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [dbName],
    );

    // Create the database if it doesn't exist
    if (dbExists?.length === 0) {
      await baseDataSource.query(`CREATE DATABASE \`${dbName}\``);
      console.log(`Database ${dbName} created.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }

    // Close the base connection
    await baseDataSource.destroy();
    console.log('Base database connection closed.');

    // Create a new connection with the specified database
    const dbConnectionOptions: DataSourceOptions = {
      ...baseConnectionOptions,
      database: dbName,
      entities: [path.join(__dirname, './models/**/*.entity.{ts,js}')], // Pass your entity definitions here
      synchronize: true, // Automatically sync tables based on entities
    };

    const dbDataSource = new DataSource(dbConnectionOptions);

    // Initialize and synchronize the database
    await dbDataSource.initialize();
    console.log('Database connection initialized (with tables).');

    // Optional: Run any seed data scripts here
    console.log('All necessary tables created.');
  } catch (err) {
    console.error('Error during database and table creation:', err);
  }
}

async function bootstrap() {
  await createDatabaseAndTables();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'debug', 'warn'],
  });

  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_FRONTEND_URL || 'http://localhost:5174',
  ];

  const corsOptions: CorsOptions = {
    // origin: [process.env.FRONTEND_URL, process.env.ADMIN_FRONTEND_URL],
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useLogger(app.get(CustomLogger));

  app.useGlobalFilters(new RuntimeExceptionFilter(app.get(CustomLogger)));

  app.useGlobalPipes(new ValidationPipe());

  app.use(passport.initialize());

  const options = new DocumentBuilder()
    .setTitle('App API')
    .setDescription('This API is for App.')
    .setVersion('1.0')
    .addBearerAuth() // Add this line to enable Bearer token support
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const bootstrapService = app.get(BootstrapService);
  await bootstrapService.createAdmin();

  const PORT = parseInt(process.env.SERVER_PORT) || 4000;

  await app.listen(PORT);

  console.log(`\nlistening on PORT : ${PORT}...\n`);
}

bootstrap();
