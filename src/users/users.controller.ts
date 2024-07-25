import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.usersService.create(createUserDto);
      return plainToInstance(UserEntity, user, { excludeExtraneousValues: true })
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ConflictException('Email already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data');
      } else {
        throw new BadRequestException('An unexpected error occured')
      }
    }
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.usersService.findAll();
      return users.map((user) => plainToInstance(UserEntity, user, { excludeExtraneousValues: true }));
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occured');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserEntity, user, { excludeExtraneousValues: true })
  }

  //condition and password field dont show on ui
  // return this.usersService.findOne(id);

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Email already exists' })

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return plainToInstance(UserEntity, user, { excludeExtraneousValues: true })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid data')
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'An unexpected error occurred' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      const user = await this.usersService.remove(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }
  }
}