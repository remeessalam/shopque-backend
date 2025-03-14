import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  streetAddress: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
});
const Address = mongoose.model("Address", AddressSchema);
