// STEP 3: STUDENT FILLED DATA (MOST IMPORTANT)

import mongoose from "mongoose";


const StudentFormDataSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile",
    required: true
  },

  formKey: {
    type: String,
    required: true
  },

  sectionKey: {
    type: String,
    required: true
  },

  values: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },

  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model("StudentFormData", StudentFormDataSchema);



// 🔹 STEP 4: STUDENT PROFILE (LIGHT KAR DO)

// Tumhara existing StudentProfile almost theek hai 👍
// Bas ye logic follow karo:

// ❌ basic_info_id, advanced_info_id
// ✅ replace with dynamic lookup

// StudentFormData.find({
//   student_id,
//   formKey: "admission_form"
// })

// 🔹 STEP 5: FRONTEND FLOW (samajhne ke liye)

// 1️⃣ React → /api/form-schema/admission_form
// 2️⃣ Backend → sections + enabled flag
// 3️⃣ React loop se form render
// 4️⃣ Submit → /api/student-form-data