import { IsNotEmpty, IsNumber, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

class OrderItemDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;
  
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
  
    @IsNumber()
    @IsNotEmpty()
    price: number;
  }
  
  export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];
  
    @IsEnum(OrderStatus)
    status: OrderStatus;
  }
  