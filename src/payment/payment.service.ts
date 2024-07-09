import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    });
  }

  async getPayment(id: number): Promise<Payment> {
    return this.prisma.payment.findUnique({
      where: { id:Number(id) },
    });
  }

  async updatePayment(id: number, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id:Number(id)  },
      data,
    });
  }

  async deletePayment(id: number): Promise<Payment> {
    return this.prisma.payment.delete({
      where: { id },
    });
  }
}
