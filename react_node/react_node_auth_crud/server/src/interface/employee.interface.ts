export default interface IEmployee {
  title: string;  
  single_image?:string | null;
  multiple_image?:string[];
  //existingImages?:string[];
  DOB:Date;
}

