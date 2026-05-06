export default interface IUser {
  name: string;
  email:string,
  password: string,
  DOB ?: Date,
  status: string,
  role: string,
  profile_image ?: string;
  deletedAt?:Date
}


export interface ILoginResponse {  
  user: IUser;
  adminToken: string;
}
export interface ILogin {
  email: string;
  password: string;
}