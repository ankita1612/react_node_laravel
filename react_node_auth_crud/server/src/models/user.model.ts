import  {Schema, model,} from 'mongoose'
import  IUser  from "../interface/user.interface";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    DOB: {
        type: Date,
    },
     status: {
        type: String,
        enum: ["Active","Inactive"], 
        default: "Active",
  }, 
   role: {
      type: String,
      enum: ["Admin","User"],
      default: "User",
    },
    profile_image :{
        type: String,
    },
     deletedAt: {
      type: Date,
      default: null,
    },
} ,{ timestamps: true },)
 const User = model<IUser>('User', userSchema )
 export default User