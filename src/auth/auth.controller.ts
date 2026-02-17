import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  //  Funciona, básico
  // signin(@Body() dto: AuthDto) {
  //   console.log({ dto });
  // }
  // Funciona também com parseIntPipe, mas não é recomendado
  //   signin(@Body('email') email: string, @Body('password',ParseIntPipe) password: number) {
  //   console.log({
  //     email: email,
  //     password: password,
  //     'Tipo de email: ': typeof email,
  //     'Tipo de password: ': typeof password,
  //   });
  // }
  // signin(@Body('email') email: string, @Body('password') password: string) {
  //   console.log({
  //     email: email,
  //     password: password,
  //     'Tipo de email: ': typeof email,
  //     'Tipo de password: ': typeof password,
  //   });
  // }
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
}
