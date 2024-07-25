import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, ConflictException, BadRequestException, InternalServerErrorException, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiBasicAuth, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Category created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Category already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryService.create(createCategoryDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category already exists');
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
  @ApiOkResponse({ description: 'Categories retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findAll() {
    try {
      const categories = await this.categoryService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Categories retrieved successfully',
        data: categories,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Category retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const category = await this.categoryService.findOne(id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Category not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Category updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiConflictResponse({ description: 'Category already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.categoryService.update(id, updateCategoryDto);
      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('Category not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Category deleted successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletedCategory = await this.categoryService.remove(id);
      if (!deletedCategory) {
        throw new NotFoundException('Category not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Category deleted successfully',
        data: deletedCategory,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Category not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}
