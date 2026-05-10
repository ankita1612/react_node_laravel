import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model("Amenity", amenitySchema);