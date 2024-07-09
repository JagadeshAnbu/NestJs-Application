// create-product.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
