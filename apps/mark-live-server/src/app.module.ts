import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
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
