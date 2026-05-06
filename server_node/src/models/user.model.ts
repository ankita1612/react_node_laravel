import  {Schema, model,} from 'mongoose'
import  IUser, {Status}  from "../interface/user.interface";

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
        enum: Object.values(Status), 
        default: Status.ACTIVE,
  }, 
    profile_image :{
        type: String,
    }
})
 const User = model<IUser>('User', userSchema )
 export default User