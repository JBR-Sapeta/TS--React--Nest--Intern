import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
}
