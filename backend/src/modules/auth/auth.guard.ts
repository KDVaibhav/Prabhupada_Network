import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
// import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './skip-auth.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, // for verifying the token
    private readonly reflector: Reflector, //  for reading metadata from the controller
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // context contains information about the request
    const isPublic = await this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw new UnauthorizedException();
    }

    try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWt_SECRET,
      })
      request['user'] = payload;
    } catch{
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
