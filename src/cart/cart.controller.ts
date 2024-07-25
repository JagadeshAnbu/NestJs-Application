import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags("cart")
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Item added to cart successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Item already in cart' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async addToCart(@Body() createCartDto: CreateCartDto) {
    try {
      const { userId, productId, quantity } = createCartDto;
      const cartItem = await this.cartService.addToCart(userId, productId, quantity);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Item added to cart successfully',
        data: cartItem,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Item already in cart');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Get(':userId')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({ description: 'Cart retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Cart not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async getCart(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const cart = await this.cartService.getCart(userId);
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Cart retrieved successfully',
        data: cart,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Cart not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Patch(':cartId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Cart item updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async updateCartItem(@Param('cartId', ParseIntPipe) cartId: number, @Body() updateCartDto: UpdateCartDto) {
    try {
      const { quantity } = updateCartDto;
      const updatedCartItem = await this.cartService.updateCartItem(cartId, quantity);
      if (!updatedCartItem) {
        throw new NotFoundException('Cart item not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Cart item updated successfully',
        data: updatedCartItem,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('Cart item not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }


  @Delete(':cartId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Cart item removed successfully' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async removeCartItem(@Param('cartId', ParseIntPipe) cartId: number) {
    try {
      const removedCartItem = await this.cartService.removeCartItem(cartId);
      if (!removedCartItem) {
        throw new NotFoundException('Cart item not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Cart item removed successfully',
        data: removedCartItem,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Cart item not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  @Delete('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Cart cleared successfully' })
  @ApiNotFoundResponse({ description: 'Cart not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async clearCart(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const clearedCart = await this.cartService.clearCart(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Cart cleared successfully',
        data: clearedCart,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Cart not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}