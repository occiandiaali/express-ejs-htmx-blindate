import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// export function showLogin(req, res) {
//   if (req.user) return res.redirect("/users");
//   res.render("auth/login", { error: null });
// }
export function showLogin(req, res) {
  if (req.user) return res.redirect("/users");
  res.render("auth/login", { error: null, csrfToken: res.locals.csrfToken });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  //   if (!user) {
  //     return res.render("auth/login", { error: "Invalid credentials" });
  //   }

  //   const valid = await bcrypt.compare(password, user.passwordHash);
  //   if (!valid) {
  //     return res.render("auth/login", { error: "Invalid credentials" });
  //   }
  if (!user) {
    return res.render("auth/login", {
      error: "Invalid credentials",
      csrfToken: res.locals.csrfToken,
    });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.render("auth/login", {
      error: "Invalid credentials",
      csrfToken: res.locals.csrfToken,
    });
  }

  const token = jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  //   res.cookie("auth", token, {
  //     httpOnly: true,
  //     sameSite: "lax",
  //     secure: false,
  //   });

  //   res.redirect("/users");
  res.cookie("auth", token, { httpOnly: true, sameSite: "lax" });
  res.redirect("/users");
}

// export function showRegister(req, res) {
//   if (req.user) return res.redirect("/users");
//   res.render("auth/register", { error: null });
// }
export function showRegister(req, res) {
  if (req.user) return res.redirect("/users");
  res.render("auth/register", { error: null, csrfToken: res.locals.csrfToken });
}

export async function register(req, res) {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.render("auth/register", { error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    passwordHash,
  });

  const token = jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  //   res.cookie("auth", token, {
  //     httpOnly: true,
  //     sameSite: "lax",
  //     secure: false,
  //   });

  //   res.redirect("/users");
  res.cookie("auth", token, { httpOnly: true, sameSite: "lax" });
  res.redirect("/users");
}

export function logout(req, res) {
  res.clearCookie("auth");
  res.redirect("/login");
}
