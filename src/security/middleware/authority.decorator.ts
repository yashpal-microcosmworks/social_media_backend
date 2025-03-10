import { SetMetadata } from '@nestjs/common';

export const Authority = (authority: string | string[]) =>
  SetMetadata('authority', Array.isArray(authority) ? authority : [authority]);
