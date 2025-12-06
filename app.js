console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import expressLayouts from "express-ejs-layouts";

import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import meetingsRouter from "./routes/meetings.js";
import { attachUser } from "./middleware/authMiddleware.js";
import { csrfToken } from "./middleware/csrfMiddleware.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(csrfToken);
app.use(attachUser);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error", err));

app.get("/", (req, res) => {
  if (!req.user) return res.redirect("/login");
  res.redirect("/users");
});

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/meetings", meetingsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
