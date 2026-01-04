import jwt from "jsonwebtoken";
import { devLog } from "../utils/devlogger.js";

export const auth = (req, res, next) => {

    devLog(`auth verify..` ,{level:"r",data:req.headers.authorization})

  const token = req.headers.authorization?.split(" ")[1];
//   const token = req.headers.authorization;

  console.log("token...-", token);
  

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify;
    
    devLog(`auth verify done..` ,{level:"s"})
    next();


  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
