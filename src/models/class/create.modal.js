import mongoose from "mongoose";
import { Schema } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoID = customAlphabet("1234567890a", 8);

const classCreateSchema = new Schema(
    {
        //---- basicInfo ------
        _id: {
            type: String,
            default: () => nanoID(),
            required: true,
        },
        className: {
            type: String,
            required: true,
        },
        classTeacher: {
            type: String,
            required: true,
        }, // teacher id
        subjects: [
            {
                type: String,

            },
        ], // subject ids
        students: [
            {
                type: String,

            }
        ], // student ids

        
        section: { type: String },
        roomNumber: { type: String },
    },
    { timestamps: true, _id: false }
);

const ClassCreate = mongoose.model("ClassCreate", classCreateSchema);

export default ClassCreate;
