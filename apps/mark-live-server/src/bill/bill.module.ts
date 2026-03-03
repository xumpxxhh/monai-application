import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { AuthTokenGuard } from '../common/guards/auth-token.guard';
import { UploadModule } from '../common/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), UploadModule],
  controllers: [BillsController],
  providers: [BillsService, AuthTokenGuard],
})
export class BillModule {}
