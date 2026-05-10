import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model("Owner", ownerSchema);