// import crypto from "crypto";
// import Meeting from "../models/Meeting.js";

// export async function indexMyMeetings(req, res) {
//   const meetings = await Meeting.find({
//     participants: req.user.username,
//   }).lean();
//   if (req.headers["hx-request"]) {
//     return res.render("users/show", { user, layout: false });
//   }

//   res.render("meetings/index", { meetings });
// }

// export function newForm(req, res) {
//   const targetUsername = req.params.username;
//   if (req.headers["hx-request"]) {
//     return res.render("users/show", { user, layout: false });
//   }

//   res.render("meetings/form", { targetUsername });
// }

// export async function create(req, res) {
//   const { targetUsername, startDate, startTime, sceneType, duration } =
//     req.body;

//   const meetingID = crypto.randomBytes(6).toString("hex");

//   await Meeting.create({
//     meetingID,
//     startDate,
//     startTime,
//     sceneType,
//     duration,
//     participants: [req.user.username, targetUsername],
//   });

//   if (req.headers["hx-request"]) {
//     const meetings = await Meeting.find({
//       participants: req.user.username,
//     }).lean();
//     return res.render("meetings/list", { meetings });
//   }

//   res.redirect("/meetings");
// }

// export async function show(req, res) {
//   const meeting = await Meeting.findById(req.params.id).lean();
//   if (!meeting) return res.status(404).send("Meeting not found");

//   if (!meeting.participants.includes(req.user.username)) {
//     return res.status(403).send("Forbidden");
//   }
//   if (req.headers["hx-request"]) {
//     return res.render("users/show", { user, layout: false });
//   }

//   res.render("meetings/show", { meeting });
// }

// export async function destroy(req, res) {
//   const meeting = await Meeting.findById(req.params.id).lean();
//   if (!meeting) return res.status(404).send("Meeting not found");

//   if (!meeting.participants.includes(req.user.username)) {
//     return res.status(403).send("Forbidden");
//   }

//   await Meeting.findByIdAndDelete(req.params.id);

//   if (req.headers["hx-request"]) {
//     const meetings = await Meeting.find({
//       participants: req.user.username,
//     }).lean();
//     return res.render("meetings/list", { meetings });
//   }

//   res.redirect("/meetings");
// }

//=======================================
// controllers/meetingsController.js
import crypto from "crypto";
import Meeting from "../models/Meeting.js";

export async function indexMyMeetings(req, res) {
  const meetings = await Meeting.find({
    participants: req.user.username,
  }).lean();

  const data = { meetings, csrfToken: res.locals.csrfToken };

  if (req.headers["hx-request"]) {
    return res.render("meetings/index-partial", { ...data, layout: false });
  }

  res.render("meetings/index", data);
}

export function newForm(req, res) {
  const targetUsername = req.params.username;
  const data = { targetUsername, csrfToken: res.locals.csrfToken };

  if (req.headers["hx-request"]) {
    return res.render("meetings/form", { ...data, layout: false });
  }

  res.render("meetings/form", data);
}

export async function create(req, res) {
  const {
    targetUsername,
    currentUser,
    startDate,
    startTime,
    sceneType,
    duration,
  } = req.body;

  const meetingID = crypto.randomBytes(6).toString("hex");
  //   const sceneURL = `https://playcanv.as/p/your-scene-id/?` +
  //   `meetingID=${meetingID}` +
  //   `&host=${req.user.username}` +
  //   `&guest=${targetUsername}` +
  //   `&sceneType=${sceneType}` +
  //   `&duration=${duration}`;
  //https://playcanv.as/p/kkYFilt6/ (layout place)

  let baseUrl = "";
  if (sceneType === "collonade_park") {
    baseUrl = "https://playcanv.as/p/kkYFilt6/";
  } else if (sceneType === "white_court") {
    baseUrl = "https://playcanv.as/p/ITn9wsmF/";
  } else if (sceneType === "haunted_house") {
    // baseUrl = " https://playcanv.as/p/0ue0ILM8/";
    baseUrl = "https://playcanv.as/p/i7WYC5nR/";
  }
  // if (sceneType === "collonade_park") {}
  // if (sceneType === "collonade_park") {}
  // const sceneURL =
  //   `${baseUrl}?` +
  //   `meetingID=${encodeURIComponent(meetingID)}` +
  //   `&host=${encodeURIComponent(req.user.username)}` +
  //   `&guest=${encodeURIComponent(targetUsername)}` +
  //   `&duration=${encodeURIComponent(duration)}`;
  const sceneURL =
    `${baseUrl}?` +
    `meetingID=${encodeURIComponent(meetingID)}` +
    `&me=${encodeURIComponent(currentUser)}` +
    `&guest=${encodeURIComponent(targetUsername)}` +
    `&duration=${encodeURIComponent(duration)}`;

  try {
    await Meeting.create({
      meetingID,
      startDate,
      startTime,
      sceneType,
      duration,
      sceneURL,
      me: currentUser,
      participants: [req.user.username, targetUsername],
    });
    console.log(`sceneUrl: ${sceneURL}`);
    console.log(`Current user ${currentUser}`);

    const meetings = await Meeting.find({
      participants: req.user.username,
    }).lean();

    const data = { meetings, csrfToken: res.locals.csrfToken };

    if (req.headers["hx-request"]) {
      return res.render("meetings/list", { ...data, layout: false });
    }
    res.redirect("/meetings");
  } catch (error) {
    console.error(error);
  }
}

export async function show(req, res) {
  const meeting = await Meeting.findById(req.params.id).lean();
  if (!meeting) return res.status(404).send("Meeting not found");

  if (!meeting.participants.includes(req.user.username)) {
    return res.status(403).send("Forbidden");
  }

  const data = { meeting, csrfToken: res.locals.csrfToken };

  if (req.headers["hx-request"]) {
    return res.render("meetings/show", { ...data, layout: false });
  }

  res.render("meetings/show", data);
}

export async function destroy(req, res) {
  const meeting = await Meeting.findById(req.params.id).lean();
  if (!meeting) return res.status(404).send("Meeting not found");

  if (!meeting.participants.includes(req.user.username)) {
    return res.status(403).send("Forbidden");
  }

  await Meeting.findByIdAndDelete(req.params.id);

  const meetings = await Meeting.find({
    participants: req.user.username,
  }).lean();

  const data = { meetings, csrfToken: res.locals.csrfToken };

  if (req.headers["hx-request"]) {
    return res.render("meetings/list", { ...data, layout: false });
  }

  res.redirect("/meetings");
}

export async function join(req, res) {
  const meeting = await Meeting.findById(req.params.id).lean();
  if (!meeting) return res.status(404).send("Meeting not found");

  if (!meeting.participants.includes(req.user.username)) {
    return res.status(403).send("Forbidden");
  }

  return res.render("meetings/join", {
    meeting,
    layout: false,
  });
}
