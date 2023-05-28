import { User } from "@prisma/client";
import UserRepository from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//service user classes
export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  //service layer create new user
  async execute(user: User): Promise<User> {
    const hashPassword = await bcrypt.hash(user.password, 10);

    user.password = hashPassword;

    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }

  //service layer authenticate user
  async authenticate(user: User): Promise<string> {
    const findUser = await this.userRepository.findByEmail(user.email);

    if (!findUser) {
      throw new Error("Invalid Credentials");
    }

    const ValidPassword = await bcrypt.compare(
      user.password,
      findUser.password
    );

    if (!ValidPassword) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign({ userId: findUser.id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    return token;
  }
}
