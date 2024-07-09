import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("cart")
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService){}

    @Post()
    addToCart(@Body() createCartDto: CreateCartDto) {
      const { userId, productId, quantity } = createCartDto;
      return this.cartService.addToCart(userId, productId, quantity);
    }

    @Get(':userId')
    getCart(@Param('userId', ParseIntPipe) userId: number) {
      return this.cartService.getCart(userId);
    }
  
    @Patch(':cartId')
    updateCartItem(@Param('cartId', ParseIntPipe) cartId: number, @Body() updateCartDto: UpdateCartDto) {
      const { quantity } = updateCartDto;
      return this.cartService.updateCartItem(cartId, quantity);
    }
  
    @Delete(':cartId')
    removeCartItem(@Param('cartId', ParseIntPipe) cartId: number) {
      return this.cartService.removeCartItem(cartId);
    }
  
    @Delete('user/:userId')
    clearCart(@Param('userId', ParseIntPipe) userId: number) {
      return this.cartService.clearCart(userId);
    }    
}
