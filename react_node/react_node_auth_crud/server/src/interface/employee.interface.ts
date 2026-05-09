export default interface IEmployee {
  _id?: string;
  first_name: string;
  last_name?: string | null;
  salary: number;
  age?: number | null;
  dob: Date | string;
  DOJ?: Date | string | null;
  description: string;
  profile_image?: string;
  logo?: string;
  hobbies: "Cricket" | "Football" | "Basket ball";
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

