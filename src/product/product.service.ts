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

  findAll(paginationOptions: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = paginationOptions;
    return this.prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: skip,
      take: take,
      orderBy: {
        name: 'asc',
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

  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });

  }
}