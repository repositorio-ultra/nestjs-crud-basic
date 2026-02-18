import { ForbiddenException, Injectable } from '@nestjs/common';
//import { CreateBookMarkDto, EditBookMarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getbookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }
  async getBookMarkById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });
  }
  async createBookmark(userId: number, dto: CreateBookMarkDto) {
    return await this.prisma.bookmark.create({
      data: {
        userId: userId,
        ...dto,
      },
    });
  }
  async editBookMarkById(
    userId: number,
    dto: EditBookMarkDto,
    bookmarkId: number,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Bookmark not found or access denied');
    }
    return await this.prisma.bookmark.update({
      where: {
        id: bookmark.id,
        userId: userId,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteBookMarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Bookmark not found or access denied');
    }
    return await this.prisma.bookmark.delete({
      where: {
        id: bookmark.id,
        userId: userId,
      },
    });
  }
}
