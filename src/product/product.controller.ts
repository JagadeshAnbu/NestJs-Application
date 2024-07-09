// product.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("product")
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Records retrieved successfully',
      data: products,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new HttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Record not found',
      }, HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Record retrieved successfully',
      data: product,
    };
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateProductDto: UpdateProductDto) {
    return this.productService.update(+id, UpdateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.remove(id);
  }
}
