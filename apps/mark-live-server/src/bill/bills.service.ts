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
    const { page, pageSize, startDate, endDate } = query;
    const shouldPaginate = Number.isInteger(page) && Number.isInteger(pageSize);
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

    if (shouldPaginate) {
      qb.skip(((page as number) - 1) * (pageSize as number)).take(pageSize as number);
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map(toTransactionDto),
      total,
      page: shouldPaginate ? page : undefined,
      pageSize: shouldPaginate ? pageSize : undefined,
    };
  }

  /** 查询已删除的账单 */
  async listDeleted(uid: number, query: ListBillsQueryDto) {
    const { page, pageSize, startDate, endDate } = query;
    const shouldPaginate = Number.isInteger(page) && Number.isInteger(pageSize);
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

    if (shouldPaginate) {
      qb.skip(((page as number) - 1) * (pageSize as number)).take(pageSize as number);
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map(toTransactionDto),
      total,
      page: shouldPaginate ? page : undefined,
      pageSize: shouldPaginate ? pageSize : undefined,
    };
  }

  async stats(uid: number) {
    const now = dayjs();
    const todayStart = now.startOf('day');
    const todayEnd = now.endOf('day');
    const weekStart = now.startOf('week');
    const monthStart = now.startOf('month');
    const monthEnd = now.endOf('month');
    const yearStart = now.startOf('year');

    const raw = await this.billRepo
      .createQueryBuilder('bill')
      .select(
        "SUM(CASE WHEN bill.type = 'income' AND bill.time >= :monthStart AND bill.time <= :monthEnd THEN bill.amount ELSE 0 END)",
        'monthIncome',
      )
      .addSelect(
        "SUM(CASE WHEN bill.type = 'expense' AND bill.time >= :monthStart AND bill.time <= :monthEnd THEN bill.amount ELSE 0 END)",
        'monthExpense',
      )
      .addSelect(
        "SUM(CASE WHEN bill.type = 'expense' AND bill.time >= :todayStart AND bill.time <= :todayEnd THEN bill.amount ELSE 0 END)",
        'todayExpense',
      )
      .addSelect(
        "SUM(CASE WHEN bill.type = 'expense' AND bill.time >= :weekStart AND bill.time <= :todayEnd THEN bill.amount ELSE 0 END)",
        'weekExpense',
      )
      .addSelect(
        "SUM(CASE WHEN bill.type = 'expense' AND bill.time >= :yearStart AND bill.time <= :todayEnd THEN bill.amount ELSE 0 END)",
        'yearExpense',
      )
      .where('bill.uid = :uid', { uid })
      .andWhere('bill.is_deleted = 0')
      .setParameters({
        monthStart: monthStart.toDate(),
        monthEnd: monthEnd.toDate(),
        todayStart: todayStart.toDate(),
        todayEnd: todayEnd.toDate(),
        weekStart: weekStart.toDate(),
        yearStart: yearStart.toDate(),
      })
      .getRawOne<Record<string, string | number | null>>();

    const monthIncome = toNumber(raw?.monthIncome);
    const monthExpense = toNumber(raw?.monthExpense);
    const todayExpense = toNumber(raw?.todayExpense);
    const weekExpense = toNumber(raw?.weekExpense);
    const yearExpense = toNumber(raw?.yearExpense);

    const weekDays = now.diff(weekStart, 'day') + 1;
    const monthDays = now.date();
    const yearDays = now.diff(yearStart, 'day') + 1;

    const weekDailyAverageExpense = weekDays > 0 ? weekExpense / weekDays : 0;
    const monthDailyAverageExpense = monthDays > 0 ? monthExpense / monthDays : 0;
    const yearDailyAverageExpense = yearDays > 0 ? yearExpense / yearDays : 0;

    return {
      totalBalance: roundMoney(monthIncome - monthExpense),
      totalIncome: roundMoney(monthIncome),
      totalExpense: roundMoney(monthExpense),
      todayExpense: roundMoney(todayExpense),
      weekDailyAverageExpense: roundMoney(weekDailyAverageExpense),
      monthDailyAverageExpense: roundMoney(monthDailyAverageExpense),
      yearDailyAverageExpense: roundMoney(yearDailyAverageExpense),
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

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundMoney(value: number): number {
  return Number(value.toFixed(2));
}
