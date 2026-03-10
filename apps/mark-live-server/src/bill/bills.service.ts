import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import { Bill } from './entities/bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ListBillsQueryDto } from './dto/list-bills-query.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepo: Repository<Bill>,
  ) {}

  async list(uid: number, query: ListBillsQueryDto) {
    const { page = 1, pageSize = 20, startDate, endDate } = query;
    const qb = this.billRepo
      .createQueryBuilder('bill')
      .where('bill.uid = :uid', { uid })
      .andWhere('bill.is_deleted = 0');

    if (startDate) {
      qb.andWhere('bill.time >= :startDate', {
        startDate: dayjs(startDate).toDate(),
      });
    }
    if (endDate) {
      qb.andWhere('bill.time <= :endDate', {
        endDate: dayjs(endDate).endOf('day').toDate(),
      });
    }

    qb.orderBy('bill.time', 'DESC').addOrderBy('bill.created_at', 'DESC');

    const [items, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items: items.map(toTransactionDto),
      total,
      page,
      pageSize,
    };
  }

  /** 查询已删除的账单 */
  async listDeleted(uid: number, query: ListBillsQueryDto) {
    const { page = 1, pageSize = 20, startDate, endDate } = query;
    const qb = this.billRepo
      .createQueryBuilder('bill')
      .where('bill.uid = :uid', { uid })
      .andWhere('bill.is_deleted = 1');

    if (startDate) {
      qb.andWhere('bill.time >= :startDate', {
        startDate: dayjs(startDate).toDate(),
      });
    }
    if (endDate) {
      qb.andWhere('bill.time <= :endDate', {
        endDate: dayjs(endDate).endOf('day').toDate(),
      });
    }

    qb.orderBy('bill.time', 'DESC').addOrderBy('bill.created_at', 'DESC');

    const [items, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items: items.map(toTransactionDto),
      total,
      page,
      pageSize,
    };
  }

  async create(uid: number, dto: CreateBillDto): Promise<Record<string, unknown>> {
    const timeStr = dto.time ?? dto.date;
    if (!timeStr) throw new Error('Missing time or date');
    const timeDayjs = dayjs(timeStr);
    if (!timeDayjs.isValid()) throw new Error('Invalid date');
    const timeDate = timeDayjs.toDate();
    const category = dto.category ?? dto.categoryId ?? '';
    const remark = dto.remark ?? dto.note ?? null;
    const bill = this.billRepo.create({
      uid,
      type: dto.type,
      title: dto.title,
      amount: dto.amount,
      category,
      tags: dto.tags ?? null,
      imageUrl: dto.imageUrl ?? null,
      time: timeDate,
      remark,
      isDeleted: 0,
    });
    const saved = await this.billRepo.save(bill);
    return toTransactionDto(saved);
  }

  async update(uid: number, id: string, dto: UpdateBillDto): Promise<Record<string, unknown>> {
    const bill = await this.billRepo.findOne({
      where: { id: String(id), uid, isDeleted: 0 },
    });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
    if (dto.type !== undefined) bill.type = dto.type;
    if (dto.title !== undefined) bill.title = dto.title;
    if (dto.amount !== undefined) bill.amount = dto.amount;
    const category = dto.category ?? dto.categoryId;
    if (category !== undefined) bill.category = category;
    if (dto.tags !== undefined) bill.tags = dto.tags ?? null;
    if (dto.imageUrl !== undefined) bill.imageUrl = dto.imageUrl ?? null;
    const timeStr = dto.time ?? dto.date;
    if (timeStr !== undefined) {
      const timeDayjs = dayjs(timeStr);
      if (timeDayjs.isValid()) bill.time = timeDayjs.toDate();
    }
    const remark = dto.remark ?? dto.note;
    if (remark !== undefined) bill.remark = remark ?? null;
    const saved = await this.billRepo.save(bill);
    return toTransactionDto(saved);
  }

  async remove(uid: number, id: string): Promise<void> {
    const bill = await this.billRepo.findOne({
      where: { id: String(id), uid, isDeleted: 0 },
    });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
    bill.isDeleted = 1;
    await this.billRepo.save(bill);
  }
}

function toTransactionDto(bill: Bill): Record<string, unknown> {
  const timeStr =
    bill.time instanceof Date ? dayjs(bill.time).format('YYYY-MM-DD') : String(bill.time);
  const createdAt =
    bill.createdAt instanceof Date ? dayjs(bill.createdAt).valueOf() : Number(bill.createdAt);
  return {
    id: String(bill.id),
    title: bill.title,
    amount: Number(bill.amount),
    category: bill.category,
    time: timeStr,
    remark: bill.remark ?? undefined,
    type: bill.type,
    imageUrl: bill.imageUrl ?? undefined,
    createdAt,
  };
}
