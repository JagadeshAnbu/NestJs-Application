// product.service.ts
import { Body, Injectable, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  create(CreateProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: CreateProductDto,
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }


  update(id: number, UpdateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: UpdateProductDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
