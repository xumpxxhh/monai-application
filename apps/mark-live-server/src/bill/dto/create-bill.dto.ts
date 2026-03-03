import { IsString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBillDto {
  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  /** 分类 id 或名称 */
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  /** 用户选择的日期，ISO 日期字符串，如 2025-03-02 */
  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  date?: string;

  /** 备注 */
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

  /** multipart 表单中的 fileName，与 file 配合使用 */
  @IsString()
  @IsOptional()
  fileName?: string;
}
