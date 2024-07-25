import { Controller, Post, Body, Get, Param, Patch, Delete, HttpStatus, UseGuards, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiBadRequestResponse, ApiBasicAuth, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("orders")
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Order created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Order already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.create(createOrderDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Order already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({ description: 'Orders retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findAll() {
    try {
      const orders = await this.orderService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Order retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const order = await this.orderService.findOne(id);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Order not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Order status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const updatedOrder = await this.orderService.updateStatus(id, updateOrderStatusDto);
      if (!updatedOrder) {
        throw new NotFoundException('Order not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Order status updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Order already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('Order not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Order deleted successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletedOrder = await this.orderService.remove(id);
      if (!deletedOrder) {
        throw new NotFoundException('Order not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Order deleted successfully',
        data: deletedOrder,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Order not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}