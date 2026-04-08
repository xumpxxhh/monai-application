import { IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListBillsQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 && parsed <= 100 ? parsed : undefined;
  })
  pageSize?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
