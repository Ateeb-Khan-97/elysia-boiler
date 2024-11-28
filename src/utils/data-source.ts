import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENV } from './env.util';
import { isDev } from '@/constants/application.constant';

export const ApplicationDataSource = new DataSource({
  url: ENV.DATABASE_URL,
  type: 'postgres',
  synchronize: true,
  logging: isDev,
  entities: [],
});

export const connectDB = () => ApplicationDataSource.initialize();
