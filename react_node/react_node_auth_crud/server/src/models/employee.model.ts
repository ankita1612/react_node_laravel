import  {Schema, model,} from 'mongoose'
import  IEmployee  from "../interface/employee.interface";

const employeeSchema = new Schema<IEmployee>({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        default: null
    },
    salary: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        default: null
    },
    dob: {        
        type: Date,
        required: true
    },
    DOJ: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        default: ""
    },
    logo: {
        type: String,
        default: ""
    },
    hobbies: {
        type: String,
        enum: ["Cricket", "Football", "Basket ball"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        required: true,
        default: "active"
    }
}, { timestamps: true })
 const Employee = model<IEmployee>('Employee', employeeSchema )
 export default Employee