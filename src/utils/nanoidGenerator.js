import dayjs from "dayjs";
import { customAlphabet } from "nanoid";

const nanoIDs = customAlphabet("1234567890ABCDEFGHIJKLMOPQRSTUVW", 5);

// Function to generate receipt number (or any ID)
export const generateReceiptNumber = (options={}) => {
    const { prefix = "RCP-", length = 5 } = options;
  const nano = customAlphabet("1234567890ABCDEFGHIJKLMOPQRSTUVW", length);

  return `${prefix}-${dayjs().format("YYMMDD")}-${nano()}`;
};

// You can also create generic ID function
export const generateNanoID = (options={}) => {
    const { prefix = "", length = 5 } = options;
  const nano = customAlphabet("1234567890ABCDEFGHIJKLMOPQRSTUVW", length);
  return `${prefix}${nano()}`;
};
