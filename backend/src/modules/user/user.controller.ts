import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ForgetPasswordDto, UpdateUserDto } from './user.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SkipAuth()
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SkipAuth()
  @Post('login')
  login(@Body() body: any) {
    return this.userService.login(body.name, body.password);
  }
  @SkipAuth()
  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {}

  @Get('signed-url')
  uploadSignedUrl() {
    console.log('hi');
    return this.userService.uploadSignedUrl();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }
}
