//FUNCIONA
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
//import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient {
  //constructor(config: ConfigService) {
  constructor() {
    const pool = new Pool({
      connectionString: process.env['DATABASE_URL'],
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async cleanDb() {
    //const models = Reflect.getMetadata('prisma:models', this) || [];
    //TRANSACTION PARA GARANTIR QUE TODAS AS TABELAS SEJAM LIMPAS AO MESMO TEMPO,COMEÇANDO NECESSARIAMENTE PELO BOOKMARK EVITANDO PROBLEMAS DE RELACIONAMENTO
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
      // add other tables here...
    ]);
  }
}

//O PADRÃPONÃO FUNCIONA, MAS O DE CIMA FUNCIONA
// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// @Injectable()
// export class PrismaService extends PrismaClient {
//   constructor() {
//     super(); // no adapter, no options
//   }
// }
