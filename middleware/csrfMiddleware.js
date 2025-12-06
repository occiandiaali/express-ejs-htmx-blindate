import { nanoid } from "nanoid";

export function csrfToken(req, res, next) {
  let token = req.cookies?.csrf;
  if (!token) {
    token = nanoid();
    res.cookie("csrf", token, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
    });
  }
  res.locals.csrfToken = token;
  next();
}

export function verifyCsrf(req, res, next) {
  const tokenFromCookie = req.cookies?.csrf;
  const tokenFromBody = req.body?._csrf;

  if (!tokenFromCookie || !tokenFromBody || tokenFromCookie !== tokenFromBody) {
    return res.status(403).send("CSRF token mismatch");
  }

  next();
}
