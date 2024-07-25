import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  clearCart(userId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) { }

  // Add product to cart or update quantity if already exists
  async addToCart(userId: number, productId: number, quantity: number) {
    return this.prisma.cart.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });
  }

  async getCart(userId: number) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: { product: true },
      orderBy: {
        createdAt: 'asc', // Replace 'createdAt' with the field you want to order by
      },
    });
  }

  async updateCartItem(cartId: number, quantity: number) {
    return this.prisma.cart.update({
      where: { id: cartId },
      data: { quantity },
    });
  }
  async removeCartItem(cartId: number) {
    return this.prisma.cart.delete({
      where: { id: cartId },
    });
  }
}
