import mongoose, { Document } from "mongoose";
export default interface IProperty extends Document {
  property_name: string;
  property_detail: string;
  property_type: "Residential" | "Commercial";
  property_size?: "2 BHK" | "3 BHK";
  property_owner: mongoose.Types.ObjectId;
  amenities: mongoose.Types.ObjectId[];
  property_address: string;
  brochure: string;
  photos: string[];
}