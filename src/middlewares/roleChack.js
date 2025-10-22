export const checkRole = function (requiredRole) {
  return function (req, res, next) {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
}


export const checkMultipleRoles = function (allowedRoles) {
  return function (req, res, next) {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
}   