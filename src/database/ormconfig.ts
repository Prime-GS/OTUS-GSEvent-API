import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  migrationsRun: false,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
};

const dataSource = new DataSource(config);

export default dataSource;
