import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { authService } from './auth.service';
import { Types } from "mongoose";
import User from "../models/user.model"
import  {Status, ILogin}  from "../interface/user.interface";
import dotenv from "dotenv";
dotenv.config();
describe('authService CRUD with MongoDB', () => {
  let mongoServer: MongoMemoryServer;
  const email="ankita@yopmail.com"
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = process.env.DB_NAME_FOR_TESTING   
    if (!uri) {
     throw new Error("DB_NAME is not defined in environment variables");
    }
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    //await User.deleteMany({});
  });

  afterAll(async () => {
     await mongoose.disconnect();
     await mongoServer.stop();
  });

  it('should registration a user', async () => {
    //this will create same user as above and throw error
    await expect(
      authService.registration({
        name: "AnKita",
        email: email,
        password: "Aspl@123",
        DOB: new Date("2026-10-19"),
        profile_image: '',
        status: Status.ACTIVE
      })
    )
    .rejects
    .toMatchObject({
         statusCode: 409,
         message: "User with email already exist",
       });
      //this will create user
      const user = await authService.registration({
        name: "AnKita",
        email: "X"+email,
        password: "Aspl@123",
        DOB: new Date("2026-10-19"),
        profile_image:'',
        status:Status.ACTIVE
      });
     expect(user?._id).toBeDefined();
     expect(user?.name).toBe('AnKita');
   });

  it('should throw USER_NOT_EXISTS if user is not found', async () => {
    const data: ILogin = {
      email: "X1"+email,
      password: 'Aspl@123',
    };

    await expect(authService.login(data))
      .rejects
      .toMatchObject({
        statusCode: 404,
        message: "User not exist",
      });
  });
  it('should throw INVALID_PASSWORD if password is wrong', async () => {
    const data: ILogin = {
      email: email,           // existing email
      password: 'aAspl@123',  // wrong password
    };

    await expect(authService.login(data))
      .rejects
      .toMatchObject({
        statusCode: 401,
        message: "Invalid password",
      });
  });

  it('should login user successfully', async () => {
  const data: ILogin = {
    email: email,
    password: 'Aspl@123',
  };

  const result = await authService.login(data);

  expect(result).toBeDefined();
  expect(result.token).toBeDefined();
  expect(result.user.email).toBe(email);
});

});
