import { User } from "@prisma/client";
import UserRepository from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Nodemailer } from "../utils/nodemailer";

//* criar um serviço para enviar um email de confirmação na função de registro

//service user classes
export default class UserService {
  private userRepository: UserRepository; //object instance userRepository
  private nodemailer: Nodemailer;

  constructor() {
    this.userRepository = new UserRepository();
    this.nodemailer = new Nodemailer();
  }

  //service layer create new user
  async execute(user: User): Promise<User> {
    //*create a password hash
    const hashPassword = await bcrypt.hash(user.password, 10);

    user.password = hashPassword;
    //create fuction by object instance userRepository
    const createdUser = await this.userRepository.create(user);

    /* 
     this.nodemailer.sendConfirmationEmail(user.email); => classe para enviar email de confirmação de registro
    */

    return createdUser;
  }

  //service layer authenticate user
  //! há uma redundância de exceção entre a camada de serviço e controlador*****
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

    //return a token by jwt.sign
    const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    return token;
  }
}
