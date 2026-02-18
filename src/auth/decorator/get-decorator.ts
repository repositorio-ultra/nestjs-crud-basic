import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    //console.log('request.user: ', request);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request.user;
  },
);
