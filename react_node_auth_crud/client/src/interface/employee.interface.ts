export interface IEmployee {
  id?: number;

  first_name: string;
  last_name?: string;

  salary: number;
  age?: number;

  dob: string;
  DOJ?: string;

  description: string;

  profile_image?: File | string;
  logo?: File | string;

  hobbies: "Cricket" | "Football" | "Basket ball";

  status: "active" | "inactive";

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}