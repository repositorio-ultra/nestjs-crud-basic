import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import type { JwtPayload } from '../interfaces/payload-jtwt.interface';
import { EditUserDto } from './dto';
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@GetUser() user: JwtPayload) {
    const me = await this.userService.validateUser(user.sub);
    if (me) {
      return {
        id: me.id,
        email: me.email,
        createdAt: me.createdAt,
      };
    }
    return null;
  }

  @UseGuards(AuthGuard) //Não pode esquecer senão não pega os dados do JWT
  @Patch()
  async editUser(@GetUser() user: JwtPayload, @Body() dto: EditUserDto) {
    return await this.userService.editUser(user.sub, dto);
  }
}
