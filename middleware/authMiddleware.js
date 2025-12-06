import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function attachUser(req, res, next) {
  const token = req.cookies?.auth;
  req.user = null;

  if (!token) {
    res.locals.currentUser = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).lean();
    if (user) {
      req.user = { _id: user._id.toString(), username: user.username };
      res.locals.currentUser = req.user;
    } else {
      res.locals.currentUser = null;
    }
  } catch {
    res.locals.currentUser = null;
  }

  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.redirect("/login");
  next();
}

export function requireOwnerParamId(req, res, next) {
  if (!req.user) return res.redirect("/login");
  if (req.user._id !== req.params.id) {
    return res.status(403).send("Forbidden");
  }
  next();
}
