import { Controller, Post, Body, Get, Param, Patch, Delete, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("orders")
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order created successfully',
      data: order,
    };
  }

  @Get()
  async findAll() {
    const orders = await this.orderService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Orders retrieved successfully',
      data: orders,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    const updatedOrder = await this.orderService.updateStatus(+id, updateOrderStatusDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Order status updated successfully',
      data: updatedOrder,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedOrder = await this.orderService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Order deleted successfully',
      data: deletedOrder,
    };
  }
}
