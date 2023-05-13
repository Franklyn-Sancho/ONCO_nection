import { User } from "@prisma/client";
import UserRepository from "../repository/UserRepository";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

//service user classes
export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  //service layer create new user 
  async createUser(user: User): Promise<User> {
    const hashPassword = await hash(user.password, 10);

    user.password = hashPassword;

    const createdUser = await this.userRepository.createUser(user);

    return createdUser;
  }

  //service layer authenticate user
  async authenticate(user: User): Promise<string> {
    const findUser = await this.userRepository.findByEmail(user.email);

    if (!findUser) {
      throw new Error("Invalid Credentials");
    }

    const ValidPassword = await compare(user.password, findUser.password);

    if (!ValidPassword) {
      throw new Error("Invalid Credentials");
    }

    const token = sign({ userId: findUser.id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    return token;
  }

}
