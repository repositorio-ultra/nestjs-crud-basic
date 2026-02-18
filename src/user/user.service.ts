import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  validateUser(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = this.prisma.user
      .update({
        where: {
          id: userId,
        },
        data: { ...dto },
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
    if (user['hash']) {
      delete user['hash'];
    }
    return user;
  }
}
