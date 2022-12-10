import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export const Auth = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (!request.headers.authorization?.replace('Bearer ', '')) throw new HttpException('INVALID_TOKEN', HttpStatus.FORBIDDEN);
        return request.headers.authorization?.replace('Bearer ', '');
    },
);