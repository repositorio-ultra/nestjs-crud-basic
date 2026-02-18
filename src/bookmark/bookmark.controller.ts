import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { AuthGuard } from '../auth/auth.guard';
import type { JwtPayload } from 'src/interfaces/payload-jtwt.interface';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';
@UseGuards(AuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkservice: BookmarkService) {}

  @Get()
  getbookmarks(@GetUser() userId: JwtPayload) {
    const { sub } = userId;
    return this.bookmarkservice.getbookmarks(sub);
  }

  @Get(':id')
  getBookMarkById(
    @GetUser() userId: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { sub } = userId;
    return this.bookmarkservice.getBookMarkById(sub, id);
  }

  @Post()
  createBookmark(
    @GetUser() userId: JwtPayload,
    @Body() dto: CreateBookMarkDto,
  ) {
    const { sub } = userId;
    return this.bookmarkservice.createBookmark(sub, dto);
  }

  @Patch(':id')
  editBookMarkById(
    @GetUser() userId: JwtPayload,
    @Body() dto: EditBookMarkDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { sub } = userId;
    return this.bookmarkservice.editBookMarkById(sub, dto, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookMarkById(
    @GetUser() userId: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { sub } = userId;
    return this.bookmarkservice.deleteBookMarkById(sub, id);
  }
}
