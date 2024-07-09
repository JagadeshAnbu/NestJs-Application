import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
