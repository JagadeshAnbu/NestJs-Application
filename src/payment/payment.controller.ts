import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Prisma } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount, currency, status, orderId } = createPaymentDto;
    return this.paymentService.createPayment({
      amount,
      currency,
      status,
      order: {
        connect: { id: orderId }
      }
    });
  }

  @Get(':id')
  async getPayment(@Param('id') id: number) {
    return this.paymentService.getPayment(id);
  }

  @Put(':id')
  async updatePayment(@Param('id') id: number, @Body() updatePaymentDto: CreatePaymentDto) {
    return this.paymentService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: number) {
    return this.paymentService.deletePayment(id);
  }
}
