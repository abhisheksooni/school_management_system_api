import { BasicInfo, Student } from "../../models/student/student_model.js";


// createStudentBasicInfo
// POST /students/basic_info/:id
export const createStudentBasicInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const student_id = id;

        const {

            form_number,
            // student_dob,
            dob,
            academic_year,
            admission_year,
            admission_number,
            admission_date,
            any_special_talent,
            area_of_interest,

            gender,
            category,
            blood_group,
            religion,
            mother_tongue,
            nationality,
            local_address,
            permanent_address,
            // city,
            // state,
            // zip_code

        } = req.body;

        const searchStudent = await Student.findById(student_id)

        if (!searchStudent) {
            return res.status(404).json({ message: "Student basicInfo not found" });
        }

        const newBasicInfo = await BasicInfo.create({

            student_id,
            form_number,
            // student_dob,
            dob,
            academic_year,
            admission_year,
            admission_number,
            admission_date,
            any_special_talent,
            area_of_interest,

            gender,
            category,
            blood_group,
            religion,
            mother_tongue,
            nationality,
            local_address,
            permanent_address,
            // city,
            // state,
            // zip_code
        });

        await newBasicInfo.save();
        searchStudent.basic_info = newBasicInfo._id;
        await searchStudent.save();

        return res.status(200).json({    
            success: true,
            message: "Student Basic Info created successfully",
            data: newBasicInfo
        })



    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Student Basic Info Error in create POST"
        });
    }
};


// updateStudentBasicInfo
// PUT /students/basic_info/:id
export const updateStudentBasicInfo = async (req, res) => {

    try {

        const { id } = req.params;
        const student_id = id;

        const {
            form_number,
            // student_dob,
            dob,
            admission_year,
            admission_number,
            admission_date,
            any_special_talent,
            area_of_interest,

            gender,
            category,
            blood_group,
            religion,
            mother_tongue,
            nationality,
            local_address,
            permanent_address,
            // city,
            // state,
            // zip_code

        } = req.body


        const getStudent = await Student.findById(student_id);

        if (!getStudent) {
            return res.status(404).json({ message: "updateStudentBasicInfo: student not found" });
        }

        const updateBasicInfo = await BasicInfo.findOneAndUpdate({student_id:student_id} , {


            form_number,
            // student_dob,
            dob,
            admission_year,
            admission_number,
            admission_date,
            any_special_talent,
            area_of_interest,

            gender,
            category,
            blood_group,
            religion,
            mother_tongue,
            nationality,
            local_address,
            permanent_address,
            // city,
            // state,
            // zip_code
        },{new :true}
        )


        if (!updateBasicInfo) {
            return res.status(404).json({ message: "BasicInfo record not found for this student." });
        }
        // await updateBasicInfo.save()

        return res.status(201).json({
            success: true,
            message: "Student Basic Info Update successfully",
            data: updateBasicInfo
        })

    } catch (error) {
        console.error("Error updating student basic info:", error);
        res.status(500).json({
            success: false,
            message: "Student Basic Info Error in create POST"
        });
    }


}