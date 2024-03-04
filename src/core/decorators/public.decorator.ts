import { SetMetadata } from '@nestjs/common';
import { PUBLIC_GUARD_KEY } from '../constants';

export const Public = () => SetMetadata(PUBLIC_GUARD_KEY, true);
