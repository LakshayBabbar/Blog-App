import mongoose from "mongoose";

const reqSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const reqModel =
  mongoose.models.requests || mongoose.model("requests", reqSchema);

export default reqModel;
