import { IUserRepository } from "../repository/UserRepository";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { User } from "@prisma/client";


export default class EmailAuthService {
    constructor(private userRepository: IUserRepository) {}
  
    private async validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
      return bcrypt.compare(inputPassword, storedPassword);
    }
  
    private generateToken(userId: string): string {
      return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "1h" });
    }
  
    async authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
      const user = await this.userRepository.findByEmail(email);
  
      if (!user) {
        throw new NotFoundError("Email not found");
      }
  
      const auth = await this.userRepository.findAuthenticationByUserIdAndProvider(user.id, 'email');
  
      if (!auth || !auth.password) {
        throw new UnauthorizedError("Invalid email or password");
      }
  
      const isValidPassword = await this.validatePassword(password, auth.password);
  
      if (!isValidPassword) {
        throw new UnauthorizedError("Invalid email or password");
      }
  
      const token = this.generateToken(user.id);
      return { user, token };
    }
  }
  