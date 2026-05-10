import { Schema, model } from "mongoose";
import IEmployee from "../interface/property.interface";

const PropertySchema = new Schema(
  {
    property_name: {
      type: String,
      required: true,
      trim: true,
    },

    property_detail: {
      type: String,
      required: true,
      trim: true,
    },

    property_type: {
      type: String,
      enum: ["Residential", "Commercial"],
      required: true,
    },

    property_size: {
      type: String,
      enum: ["2 BHK", "3 BHK"],
      required: function () {
        return this.property_type === "Residential";
      },
    },

    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

   amenities: {
  type: [String],
  default: [],
},

    property_address: {
      type: String,
      required: true,
      trim: true,
    },

    brochure: {
      type: String,
      default: "",
    },

    photos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Property = model<IEmployee>(
  "Property",
  PropertySchema
);

export default Property;