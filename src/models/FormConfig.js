// STEP 2: SECTION ON/OFF (SCHOOL CONFIG)

import mongoose from "mongoose";

const FormConfigSchema = new mongoose.Schema({
  school_id: mongoose.Schema.Types.ObjectId,
  formKey: String,

  sections: {
    basic_info: { type: Boolean, default: true },
    advanced_info: { type: Boolean, default: true },
    parents_info: { type: Boolean, default: true }
  }
});

export default mongoose.model("FormConfig", FormConfigSchema);
