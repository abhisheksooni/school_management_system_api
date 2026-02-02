import mongoose from "mongoose";
import FormSchema from "../models/FormSchema.js";

await mongoose.connect("mongodb://127.0.0.1:27017/yourDB");

const admissionForm = {
  formKey: "admission_form",
  version: 1,
  sections: [
    {
      sectionKey: "basic_info",
      title: "Basic Information",
      enabled: true,
      order: 1,
      fields: [
        {
          fieldKey: "gender",
          label: "Gender",
          type: "select",
          required: true,
          options: ["male", "female", "transgender"]
        },
        {
          fieldKey: "blood_group",
          label: "Blood Group",
          type: "select",
          options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
        },
        {
          fieldKey: "religion",
          label: "Religion",
          type: "select",
          options: ["hindu", "muslim", "christian", "sikh", "other"]
        },
        {
          fieldKey: "address_local",
          label: "Local Address",
          type: "text"
        }
      ]
    },
    {
      sectionKey: "advanced_info",
      title: "Advanced Information",
      enabled: false,
      order: 2,
      fields: [
        {
          fieldKey: "aadhar_number",
          label: "Aadhar Number",
          type: "text"
        },
        {
          fieldKey: "bank_account_number",
          label: "Bank Account Number",
          type: "text"
        }
      ]
    }
  ]
};

await FormSchema.create(admissionForm);
console.log("✅ Admission form schema inserted");
process.exit();
