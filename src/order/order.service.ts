import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {
    const { userId, orderItems, status } = createOrderDto;

    // Calculate the total amount
    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create the order with associated order items
    const order = await this.prisma.order.create({
      data: {
        userId,
        status,
        totalAmount,
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
          orderBy: {
            id: 'desc', // Order the orderItems in descending order by id or any other field
          },
        },
      },
      orderBy: {
        id: 'desc', // Order the orders in descending order by id or any other field
      },
    });
  }

  async findOne(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { status } = updateOrderStatusDto;
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async remove(orderId: number) {

    try {
      // Ensure prisma.orderItem is properly initialized
      if (!this.prisma.orderItem) {
        throw new Error('PrismaClient is not properly initialized');
      }

      //First, delete all related orderItems
      await this.prisma.orderItems.deleteMany({
        where: { orderId: orderId },
      });

      return this.prisma.order.delete({
        where: { id: orderId },
      });
    } catch (error){
      throw new Error(`Failed to delete order with id ${orderId}: ${error.message}`);
    }
  }
}