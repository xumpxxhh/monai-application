import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { configuration } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';
import { Bill } from './bill/entities/bill.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // bundle 后 __dirname 指向 index.js 所在目录；备选 cwd 以兼容不同启动方式
      envFilePath: [path.join(__dirname, '.env'), path.join(process.cwd(), '.env')],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const db = config.get('database');
        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.dbname,
          entities: [Bill],
          synchronize: false,
          charset: 'utf8mb4',
        };
      },
      inject: [ConfigService],
    }),
    BillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
