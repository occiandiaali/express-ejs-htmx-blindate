export function newMessageForm(req, res) {
  const targetUsername = req.params.username;

  return res.render("messages/form", {
    targetUsername,
    csrfToken: res.locals.csrfToken,
    layout: false,
  });
}

export async function sendMessage(req, res) {
  const { body } = req.body;
  const to = req.params.username;
  const from = req.user.username;

  await Message.create({ from, to, body });

  return res.render("messages/sent", {
    to,
    layout: false,
  });
}
