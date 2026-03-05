import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { ListBillsQueryDto } from './dto/list-bills-query.dto';
import { User, RequestUser } from '../common/decorators/user.decorator';
import { AuthTokenGuard } from '../common/guards/auth-token.guard';
import { UploadService } from '../common/upload/upload.service';
import { getAuthTokenFromRequest } from '../common/utils/auth-token.util';

@Controller('bills')
@UseGuards(AuthTokenGuard)
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private readonly uploadService: UploadService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  async list(@User() user: RequestUser, @Query() query: ListBillsQueryDto) {
    return this.billsService.list(user.id, query);
  }

  @Get('deleted')
  async listDeleted(@User() user: RequestUser, @Query() query: ListBillsQueryDto) {
    return this.billsService.listDeleted(user.id, query);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @User() user: RequestUser,
    @Req() req: Request,
    @Body() body: CreateBillDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl: string | null = body.imageUrl ?? null;
    if (file) {
      const cookieName = this.config.get<string>('auth.cookieName') ?? 'auth_token';
      const token = getAuthTokenFromRequest(req, cookieName);
      if (!token) {
        throw new UnauthorizedException('缺少鉴权 token，无法上传图片');
      }
      const ext =
        file.originalname?.split('.').pop()?.toLowerCase() ||
        (file.mimetype?.startsWith('image/') ? file.mimetype.replace('image/', '') : 'jpg');
      const createAt = new Date()
        .toISOString()
        .replace(/[-:T.Z]/g, '')
        .slice(0, 14);
      const safeTitle =
        (body.title || 'image').replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_') || 'image';
      const defaultName = `${safeTitle}_${createAt}.${ext}`;
      const fileName = body.fileName ?? file.originalname ?? defaultName;
      const result = await this.uploadService.saveImage(fileName, file, token);
      imageUrl = result.route;
    }
    return this.billsService.create(user.id, { ...body, imageUrl: imageUrl ?? undefined });
  }

  @Delete(':id')
  async remove(@User() user: RequestUser, @Param('id') id: string) {
    await this.billsService.remove(user.id, id);
  }
}
