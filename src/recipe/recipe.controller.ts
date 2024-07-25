import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags("recipe")
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Recipe created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Recipe already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    try {
      return await this.recipeService.create(createRecipeDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Recipe already exists');
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
  @ApiOkResponse({ description: 'Recipes retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findAll() {
    try {
      return await this.recipeService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Recipe retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const recipe = await this.recipeService.findOne(id);
      if (!recipe) {
        throw new NotFoundException('Recipe not found');
      }
      return recipe;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Recipe not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Recipe updated successfully' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Recipe already exists' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
    try {
      const recipe = await this.recipeService.update(id, updateRecipeDto);
      if (!recipe) {
        throw new NotFoundException('Recipe not found');
      }
      return recipe;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Recipe already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('Recipe not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Recipe deleted successfully' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const recipe = await this.recipeService.remove(id);
      if (!recipe) {
        throw new NotFoundException('Recipe not found');
      }
      return { message: 'Recipe deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Recipe not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}
