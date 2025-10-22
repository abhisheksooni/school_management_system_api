import { AdvancedInfo, Student } from "../../models/student/student_model.js";



export const createStudentAdvancedInfo = async (req, res) => {

    try {

        const { id } = req.params
        const student_id = id;


        const {

            aadhar_number,
            bank_name,
            account_number,
            ifsc_code,
            branch_name,
            pen,
            sssmid,

            disability,
            health_issues,
            apaar_id,


            // previous Acdemic records 
            previous_school,
            previous_class,
            previous_year,
            previous_percentage,
            previous_results,
            transfer_certificate_number,

            // documents images

            birth_certificate_image,
            aadhar_card_student_image,
            aadhar_card_father_image,
            aadhar_card_mother_image,
            bank_passbook_image,
            sssmid_card_image,
            transfer_certificate_image,
            pen_image,
            apaar_id_image,
            rtl_letter_image,

            // any_other: { type: String, },

        } = req.body;

        const searchStudent = await Student.findById(student_id)

        if (!searchStudent) {
            return res.status(404).json({ message: "Student Advanced Info not found" });
        }

     


        const newAdvancedInfo = await AdvancedInfo.create(
            {
                aadhar_number,
                bank_name,
                account_number,
                ifsc_code,
                branch_name,
                pen,
                sssmid,

                disability,
                health_issues,
                apaar_id,


                // previous Acdemic records 
                previous_school,
                previous_class,
                previous_year,
                previous_percentage,
                previous_results,
                transfer_certificate_number,

                // documents images

                birth_certificate_image,
                aadhar_card_student_image,
                aadhar_card_father_image,
                aadhar_card_mother_image,
                bank_passbook_image,
                sssmid_card_image,
                transfer_certificate_image,
                pen_image,
                apaar_id_image,
                rtl_letter_image,

                // any_other: { type: String, }, 
            }
        )

        searchStudent.advanced_info = newAdvancedInfo._id

        await searchStudent.save();

        return res.status(200).json({
            success: true,
            message: "Student Advanced Info scessfully",
            data: newAdvancedInfo
        })


    } catch (error) {
        console.error("Error student createStudentAdvancedInfo : ", error);
        res.status(500).json({
            success: false,
            message: "student createStudentAdvancedInfo Error in create POST"
        });
    }

}



// Update Student AdvancedInfo
export const updateStudentAdvancedInfo = async (req, res) => {

    try {

        const { id } = req.params
        const student_id = id;


        const {

            aadhar_number,

            bank_name,
            account_number,
            ifsc_code,
            branch_name,
            pen,
            sssmid,

            disability,
            health_issues,
            apaar_id,


            // previous Acdemic records 
            previous_school,
            previous_class,
            previous_year,
            previous_percentage,
            previous_results,
            transfer_certificate_number,

            // documents images

            birth_certificate_image,
            aadhar_card_student_image,
            aadhar_card_father_image,
            aadhar_card_mother_image,
            bank_passbook_image,
            sssmid_card_image,
            transfer_certificate_image,
            pen_image,
            apaar_id_image,
            rtl_letter_image,

            // any_other: { type: String, },

        } = req.body;

        const searchStudent = await Student.findById(student_id)

        if (!searchStudent) {
            return res.status(404).json({ message: "Student Advanced Info: student not found" });
        }

             // 2. Ensure student has linked advanced info
        const advancedInfoId = searchStudent.advanced_info;
        if (!advancedInfoId) {
            return res.status(404).json({ message: "AdvancedInfo not linked to this student." });
        }

        const updateAdvancedInfo = await AdvancedInfo.findByIdAndUpdate(advancedInfoId,
            {
                aadhar_number,

                bank_name,
                account_number,
                ifsc_code,
                branch_name,
                pen,
                sssmid,

                disability,
                health_issues,
                apaar_id,


                // previous Acdemic records 
                previous_school,
                previous_class,
                previous_year,
                previous_percentage,
                previous_results,
                transfer_certificate_number,

                // documents images

                birth_certificate_image,
                aadhar_card_student_image,
                aadhar_card_father_image,
                aadhar_card_mother_image,
                bank_passbook_image,
                sssmid_card_image,
                transfer_certificate_image,
                pen_image,
                apaar_id_image,
                rtl_letter_image,

                // any_other: { type: String, }, 
            }, { new: true }
        )

        if (!updateAdvancedInfo) {
            return res.status(404).json({ message: "AdvancedInfo record not found." });
        }
        return res.status(200).json({
            success: true,
            message: "Student Advanced Info Update successfully",
            data: updateAdvancedInfo
        })




    } catch (error) {
        console.error("Error student UpdateStudentAdvancedInfo : ", error);
        res.status(500).json({
            success: false,
            message: "student UpdateStudentAdvancedInfo Error in Update POST"
        });
    }

}
