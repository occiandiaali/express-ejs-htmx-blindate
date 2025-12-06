// Basic validators – keep them small and obvious.

export function validateRegister(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render("auth/register", { error: "All fields are required" });
  }

  if (password.length < 6) {
    return res.render("auth/register", {
      error: "Password must be at least 6 characters",
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.render("auth/register", { error: "Invalid email" });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("auth/login", {
      error: "Email and password are required",
    });
  }

  next();
}

export function validateMeeting(req, res, next) {
  const { startDate, startTime, sceneType, duration } = req.body;

  if (!startDate || !startTime || !sceneType || !duration) {
    return res.status(400).send("Missing fields");
  }

  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(startDate)) {
    return res.status(400).send("Invalid date format");
  }

  if (!/^\d{2}:\d{2}$/.test(startTime)) {
    return res.status(400).send("Invalid time format");
  }

  if (Number.isNaN(Number(duration)) || Number(duration) <= 0) {
    return res.status(400).send("Duration must be a positive number");
  }

  next();
}
