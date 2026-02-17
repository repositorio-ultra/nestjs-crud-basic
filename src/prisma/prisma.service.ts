import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const pool = new Pool({
      connectionString:
        config.get('DATABASE_URL') ||
        'postgres://postgres:password@localhost:5432/nest_api_example?schema=public',
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
}
