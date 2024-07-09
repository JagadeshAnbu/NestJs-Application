// src/recipes/dto/create-recipe.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;
}
