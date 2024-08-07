import User from "../models/user.js";

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //     No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.query().findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refresh.tokens = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.$query().update(foundUser);
  console.log(result);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.sendStatus(204);
};

export default { handleLogout };
