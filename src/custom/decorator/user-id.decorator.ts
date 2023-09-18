import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserIdPipe } from '../pipe/get-user-id.pipe';

export const UserId = createParamDecorator(
  async (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    return authorization;
  },
);

export const GetUserId = () => UserId(GetUserIdPipe);
