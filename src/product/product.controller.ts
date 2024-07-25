// product.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus, UseGuards, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { error } from 'console';

@ApiTags("product")
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Product created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Product already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.create(createProductDto)
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Product already exists')
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred')
      }
    }
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({ description: 'Products retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      const paginationOptions = {
        skip: (page - 1) * limit,
        take: limit,
      };
      const products = await this.productService.findAll(paginationOptions);
      return {
        statusCode: HttpStatus.OK,
        message: 'Records retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occured')
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Product retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productService.findOne(id);
      if (!product) {
        throw new NotFoundException('Product not found')
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Record retrieved successfully',
        data: product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Product not found')
      } else {
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Product already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productService.update(id, updateProductDto);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Product already exists')
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data')
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('Product not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred')
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productService.remove(id)
      if (!product) {
        throw new NotFoundException('Product not found')
      }
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Product not found')
      } else {
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }
  }
}
