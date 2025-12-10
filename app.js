console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
import express from "express";
import cors from "cors";
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

// const corsOptions = {
//   origin: 'http://example.com', // Replace with your client's origin
//   optionsSuccessStatus: 200, // For legacy browsers
// };

// app.use(cors(corsOptions));
app.use(cors({ origin: ["*"] }));

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

// // Apply CORS to only specific routes
// app.get('/api/data', cors(corsOptions), (req, res) => {
//   res.json({ message: 'This route is CORS-enabled!' });
// });

app.get("/", (req, res) => {
  if (!req.user) return res.redirect("/login");
  res.redirect("/users");
});

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/meetings", meetingsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
