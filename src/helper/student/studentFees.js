
import { populate } from "dotenv";
import { FeeTemplate } from "../../models/studentsFeesModel.js";
import { devLog } from "../../utils/devlogger.js";



// // Create
// await CreateStudentFeeTemplateBreakdown({ name: "Monthly Fees", amount: 5000 }, { create: true });

// // Update
// await CreateStudentFeeTemplateBreakdown({ id: "65f...", amount: 6000 }, { update: true });

// // Delete
// await CreateStudentFeeTemplateBreakdown({ id: "65f..." }, { deleted: true });





/**
 * Helper: Create, update, or delete a FeeTemplate
 * @param {object} data - The data or ID to act on
 * @param {object} options - Operation flags
 * @param {boolean} options.create - Create new FeeTemplate
 * @param {boolean} options.update - Update existing FeeTemplate
 * @param {boolean} options.deleted - Delete FeeTemplate
 * @param {boolean} options.getall - Get All FeeTemplate
 * @param {boolean} options.get - Get One FeeTemplate
 * @param {boolean} options.populate - Get All With populate FeeTemplate
 */

export const CreateStudentFeeTemplatebreakdown = async (data, options = {}) => {
  const { create = null, update = null, deleted = null ,get=null ,getall=null ,populate=null } = options;

  let result;
   
  if (create) {
     result = await FeeTemplate.create(data);
  
     if (!result) throw { status: 404, message: "Failed to create FeeTemplate" };
      devLog(`Created FeeTemplate`, { id: result._id, level: "s" });

   
  } else if (update) {
    const { id } = data.params;
    const { ...updateData } = data.body;
    result = await FeeTemplate.findByIdAndUpdate(id, updateData,{ new: true });

    if (!result) throw { status: 404, message: "FeeTemplate not found for update" };

      devLog(`Updated FeeTemplate`, { id: result._id, level: "i" });
   
  } else if (deleted) {

     const { id } = data.params;

    result = await FeeTemplate.findByIdAndDelete(id);
      if (!result) throw { status: 404, message: "FeeTemplate not found for delete" };
      devLog(`Deleted FeeTemplate`, { id: result._id, level: "w" });
   
  } else if (get) {

     if (populate) {
       result = await FeeTemplate.findById(data).populate(populate);
     }

    result = await FeeTemplate.findById(data);

      if (!result) throw { status: 404, message: "FeeTemplate not found for Get One data" };
      devLog(`Get one data FeeTemplate`, { id: result._id, level: "w" });
   
  } 
  
  
  if (getall) {

    result = await FeeTemplate.find();
      if (!result) throw { status: 404, message: "FeeTemplate not found for Get All" };
      devLog(`Get All FeeTemplate`, { id: result._id, level: "w" });
   
  } 
  if (getall && populate ) {

    result = await FeeTemplate.find().populate(populate);
      if (!result) throw { status: 404, message: "FeeTemplate not found for Get All populate" };
      devLog(`Get All FeeTemplate`, { id: result._id, level: "w" });
   
  } 










    if (!result) {
        throw { status: 400, message: "No operation type specified (create/update/delete)" };
    }
  

  devLog(`Create fees Breakdown Template`, {
    id: result.id,
    level: "s",
  });

  return result

};
