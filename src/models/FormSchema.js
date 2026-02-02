
// STEP 1: FORM STRUCTURE SCHEMA (ONE TIME)
// ✅ ye sirf structure hai
// ❌ student data yahan nahi aata


import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  fieldKey: { type: String, required: true }, // gender

  label: { type: String, required: true }, // Gender

  type: {
    type: String,
    enum: ["text", "number", "select", "date", "checkbox", "file"],
    required: true,
  },

  required: { type: Boolean, default: false },

  options: [String], // for select
});

const SectionSchema = new mongoose.Schema({
  sectionKey: { type: String, required: true }, // basic_info

  title: String,

  enabled: { type: Boolean, default: true }, // 🔑 Boolean

  order: Number,

  fields: [FieldSchema],
});

const FormSchema = new mongoose.Schema({
  formKey: { type: String, required: true }, // admission_form

  version: { type: Number, default: 1 },

  sections: [SectionSchema],
});

export default mongoose.model("FormSchema", FormSchema);
