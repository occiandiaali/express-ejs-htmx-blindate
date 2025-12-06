import User from "../models/User.js";

// export async function index(req, res) {
//   const users = await User.find().lean();
//   if (req.headers["hx-request"]) {
//     return res.render("users/show", { users, layout: false });
//   }

//   res.render("users/index", { users });
// }
export async function index(req, res) {
  const { gender, minAge } = req.query;
  const query = {};

  if (gender && gender !== "any") query.gender = gender;
  if (minAge) query.age = { $gte: Number(minAge) };

  const users = await User.find(query).lean();
  const filters = { gender: gender || "any", minAge: minAge || "" };

  const data = {
    users,
    filters,
    csrfToken: res.locals.csrfToken,
  };

  if (req.headers["hx-request"]) {
    return res.render("users/index-partial", { ...data, layout: false });
  }

  res.render("users/index", data);
}

export async function show(req, res) {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).send("User not found");
  //   if (req.headers["hx-request"]) {
  //     return res.render("users/show", { user, layout: false });
  //   }

  //   res.render("users/show", { user });
  const data = { user, csrfToken: res.locals.csrfToken };

  if (req.headers["hx-request"]) {
    return res.render("users/show", { ...data, layout: false });
  }

  res.render("users/show", data);
}

// export async function editForm(req, res) {
//   const user = await User.findById(req.params.id).lean();
//   if (!user) return res.status(404).send("User not found");
//   if (req.headers["hx-request"]) {
//     return res.render("users/show", { user, layout: false });
//   }

//   res.render("users/form", { user });
// }
export async function editForm(req, res) {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).send("User not found");

  const data = { user, csrfToken: res.locals.csrfToken };

  if (req.headers["hx-request"]) {
    return res.render("users/form", { ...data, layout: false });
  }

  res.render("users/form", data);
}

// export async function update(req, res) {
//   const updates = {
//     bio: req.body.bio,
//     gender: req.body.gender,
//     avatar: req.body.avatar,
//     age: req.body.age,
//     likes: req.body.likes,
//     status: req.body.status,
//   };

//   await User.findByIdAndUpdate(req.params.id, updates);

//   if (req.headers["hx-request"]) {
//     const user = await User.findById(req.params.id).lean();
//     return res.render("users/show", { user });
//   }

//   res.redirect(`/users/${req.params.id}`);
// }

// export async function destroy(req, res) {
//   await User.findByIdAndDelete(req.params.id);
//   res.clearCookie("auth");
//   res.redirect("/register");
// }

// export async function like(req, res) {
//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).send("User not found");

//   user.likes = (user.likes || 0) + 1;
//   await user.save();

//   if (req.headers["hx-request"]) {
//     const fresh = await User.findById(req.params.id).lean();
//     return res.render("users/show", { user: fresh });
//   }

//   res.redirect(`/users/${req.params.id}`);
// }

export async function update(req, res) {
  const updates = {
    bio: req.body.bio,
    gender: req.body.gender,
    avatar: req.body.avatar,
    age: req.body.age,
    likes: req.body.likes,
    status: req.body.status,
  };

  await User.findByIdAndUpdate(req.params.id, updates);
  const user = await User.findById(req.params.id).lean();

  const data = { user, csrfToken: res.locals.csrfToken };

  if (req.headers["hx-request"]) {
    return res.render("users/show", { ...data, layout: false });
  }

  res.redirect(`/users/${req.params.id}`);
}

export async function destroy(req, res) {
  await User.findByIdAndDelete(req.params.id);
  res.clearCookie("auth");
  res.redirect("/register");
}

// export async function like(req, res) {
//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).send("User not found");

//   user.likes = (user.likes || 0) + 1;
//   await user.save();

//   const fresh = await User.findById(req.params.id).lean();
//   const data = { user: fresh, csrfToken: res.locals.csrfToken };

//   if (req.headers["hx-request"]) {
//     return res.render("users/show", { ...data, layout: false });
//   }

//   res.redirect(`/users/${req.params.id}`);
// }
export async function toggleLike(req, res) {
  const target = await User.findById(req.params.id);
  const me = req.user.username;

  if (!target) return res.status(404).send("User not found");

  const alreadyLiked = target.likedBy.includes(me);

  if (alreadyLiked) {
    // Unlike
    target.likedBy = target.likedBy.filter((u) => u !== me);
  } else {
    // Like
    target.likedBy.push(me);
  }

  target.likes = target.likedBy.length;
  await target.save();

  const fresh = await User.findById(req.params.id).lean();

  if (req.headers["hx-request"]) {
    return res.render("users/show-partial", {
      user: fresh,
      currentUser: req.user,
      csrfToken: res.locals.csrfToken,
      layout: false,
    });
  }

  res.redirect(`/users/${req.params.id}`);
}
