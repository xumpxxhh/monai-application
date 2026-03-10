import { IsString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** 修改 bill 时所有字段可选 */
export class UpdateBillDto {
  @IsIn(['income', 'expense'])
  @IsOptional()
  type?: 'income' | 'expense';

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  remark?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
