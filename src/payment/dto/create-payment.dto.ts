import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
