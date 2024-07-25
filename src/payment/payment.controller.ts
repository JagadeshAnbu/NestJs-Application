import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ConflictException, BadRequestException, InternalServerErrorException, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Prisma } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payments')
@ApiTags("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Payment created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Payment already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const { amount, currency, status, orderId } = createPaymentDto;
      return await this.paymentService.createPayment({
        amount,
        currency,
        status,
        order: {
          connect: { id: orderId }
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Payment already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Payment retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async getPayment(@Param('id', ParseIntPipe) id: number) {
    try {
      const payment = await this.paymentService.getPayment(id);
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Payment not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Payment updated successfully' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Payment already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async updatePayment(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentService.updatePayment(id, updatePaymentDto);
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      return payment;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Payment already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('Payment not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Payment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async deletePayment(@Param('id', ParseIntPipe) id: number) {
    try {
      const payment = await this.paymentService.deletePayment(id);
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      return { message: 'Payment deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Payment not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}