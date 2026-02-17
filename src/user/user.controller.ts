import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { JwtPayload } from 'src/interfaces/payload-jtwt.interface';

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
}
