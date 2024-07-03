// product.service.ts
import { Body, Injectable, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { Product } from '.prisma/client'; // Adjust this import based on your Prisma setup


@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  create(CreateProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: CreateProductDto,
    });
  }

  // async create(CreateProductDto: CreateProductDto): Promise<Product>  {
  //   // Retrieve categoryId using category name
  //   const category = await this.prisma.category.findUnique({
  //     where: { name: CreateProductDto.category },
  //   });

  //   if (!category) {
  //     throw new Error(`Category "${CreateProductDto.category}" not found.`);
  //   }

  //   return this.prisma.product.create({
  //     data: {
  //       name: CreateProductDto.name,
  //       price: CreateProductDto.price,
  //       category: { connect: { id: category.id } }, // Connect using category id
  //     },
  //   });
  // }


  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
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
