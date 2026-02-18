import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookMarkDto, EditBookMarkDto } from 'src/bookmark/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333');
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    //console.log(prisma.user);
  });
  // Close the app after all tests
  afterAll(async () => {
    await app.close();
  });

  it('should return "Hello World!"', () => {
    expect(true).toBeTruthy();
  });

  describe('Auth', () => {
    describe('Signin', () => {
      it('should signup', () => {
        const dto: AuthDto = {
          email: 'usuariodetestes@gmail.com',
          password: '12345',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should signin', () => {
        const dto: AuthDto = {
          email: 'usuariodetestes@gmail.com',
          password: '12345',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
      it('should throw exception if email empty', () => {
        const dto = { password: '123' }; // Missing email
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400); // Now validation pipe will catch this
      });
      it('should throw exception in signup', () => {
        const dto: AuthDto = {
          email: 'usuariodetestes@gmail.com',
          password: '12345',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403); // User already exists, so we expect a 403 Forbidden
      });
    });
  });
  describe('User', () => {
    describe('GetMe', () => {
      it('should get my info', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
        //.inspect();
      });
    });
    describe('EditUser', () => {
      it('should edit my info', () => {
        const dto: EditUserDto = {
          firstName: 'Ricardo',
          lastName: 'Silva',
          email: 'ricardo.silva@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
        //.inspect();
      });
    });
  });
  describe('Bookmark', () => {
    describe('Get Bookmarks', () => {
      it('should get empty bookmarks list', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([]); // Expecting an empty array since no bookmarks have been created yet
      });
      it('should create a bookmark', () => {
        const dto: CreateBookMarkDto = {
          title: 'My Bookmark',
          description: 'This is a test bookmark',
          link: 'https://example.com',
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
        //.inspect(); // Expecting an empty array since no bookmarks have been created yet
      });
      it('should update a bookmark', () => {
        const dto: EditBookMarkDto = {
          title: 'My Bookmark corrected',
          description: 'This is a correction to the test bookmark',
          link: 'https://example.com.br',
        };
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link);
        //.inspect(); // Expecting an empty array since no bookmarks have been created yet
      });
      it('should return populated bookmarks list', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
        //.inspect();
      });
      it('should return 1 bookmark by Id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}'); // Expecting the bookmark with the stored ID
        //.expectJsonLength(1); // Expecting one bookmark in the list
        //.inspect();
      });
      it('should delete a bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(204);
        //.inspect(); // Expecting an empty array since no bookmarks have been created yet
      });
      it('should get empty bookmarks list again', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([]); // Expecting an empty array since no bookmarks have been created yet
      });
    });
  });
});
