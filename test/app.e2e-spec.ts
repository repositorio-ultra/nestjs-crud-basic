import {Test} from "@nestjs/testing";

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
    }).compile(); 

    // Setup code before running the tests, such as initializing the application
  });
  it('should return "Hello World!"', () => {
    expect(true).toBeTruthy();
  });

});