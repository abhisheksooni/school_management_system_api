const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Class Name "1th" ,"2th"
    section: { type: String, default: "N/A" }, // A,B,C
    class_teacher_name: { type: String, default: "N/A" }, // A,B,C

    subjects_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassSubject",
        required: true,
        default: null,
        // default:"N/A"
      },
    ],
    // students_ids: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "StudentProfile",
    //     required: true,
    //     default: null,
    //   },
    // ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// 👇 Virtual populate for subjects
ClassSchema.virtual("subjects", {
  ref: "ClassSubject", // Model to populate from
  localField: "_id", // Class _id
  foreignField: "class_id", // Subject.class_id
});
export const SchoolClass = mongoose.model("SchoolClass", ClassSchema);
