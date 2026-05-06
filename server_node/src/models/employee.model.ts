import  {Schema, model,} from 'mongoose'
import  IEmployee  from "../interface/employee.interface";

const employeeSchema = new Schema<IEmployee>({
    title: {
        type: String,
    },
    single_image: {
        type: String,
        default: ""
    },
    multiple_image: {
        type: [String],
        default: []
    },
    DOB: {        
        type: Date
    }

})
 const Employee = model<IEmployee>('Employee', employeeSchema )
 export default Employee