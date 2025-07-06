import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  ForgetPasswordDto,
  UpdateUserDto,
  User,
} from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import ImageKit from 'imagekit';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    @Inject('IMAGEKIT_INSTANCE') private readonly imagekit: ImageKit,
  ) {}
  //user can be created by superadmin only
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.findOne({
        $or: [{ name: createUserDto.name }, { email: createUserDto.email }],
      });
      if (user) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      });
      newUser.save();
      return { msg: 'User created successfully' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(name: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        name: name,
      });
      if (!user) throw new BadRequestException('User doesnt exist');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        console.log(process.env.JWT_SECRET);
        const payload = { name: user.name, sub: user._id };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      } else {
        throw new BadRequestException('Incorrect password');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { email, otp, password } = forgetPasswordDto;
    const user = await this.userModel.findOne({ email: email });

    if (!user) throw new BadRequestException("User doesn't exist");

    if (!otp && email) {
      return this.sendOtp(email);
    }
    if (otp == user.otp) {
      if (password) {
        user.otp = null;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otpExpiresAt = null;
        user.save();
        return { message: ' Password reset successfully' };
      } else {
        return { message: 'Please enter new password' };
      }
    } else {
      return { message: 'Invalid otp' };
    }
  }

  async sendOtp(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user.otp) {
      user.otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpExpiresAt = new Date(
        Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES, 10) * 60 * 1000,
      );
      await user.save();
    }
    try {
      await this.mailService.sendMail({
        from: process.env.NODE_MAILER_EMAIL,
        to: user.email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${user.otp}`,
      });
    } catch (error) {
      console.error('Error sending OTP via nodemailer', error);
    }
    return { message: 'OTP sent successfully' };
  }

  async findAll() {
    try {
      return await this.userModel.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto);
      return { msg: 'User updated successfully' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async uploadSignedUrl() {
    try {
      const signature = this.imagekit.getAuthenticationParameters();
      return signature;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
