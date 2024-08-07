import User from "../models/user.js";
import jwt from "jsonwebtoken";

export async function handleRefreshToken(req, res) {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401); // pourquoi le cookie nexiste plus ?
  const refreshToken = cookies.jwt;

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.query()
    .where(User.ref("refresh:tokens"), "=", refreshToken)
    .first(); // Verifier que ça recherche bien dans la totalité de l array

  // Detected refresh token reuse!
  if (!foundUser) {
    console.log("refresh token not found.");
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Forbidden
        console.log("attempted refresh token reuse!");
        const hackedUser = await User.query().findOne({ email: decoded.email });
        hackedUser.refresh.tokens = [];
        const result = await hackedUser.$query().update(hackedUser);
        console.log(result);
      }
    );
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refresh.tokens.filter(
    (rt) => rt !== refreshToken
  );

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        // expired refresh token
        console.log("expired refresh token");
        foundUser.refresh.tokens = [...newRefreshTokenArray];
        const result = await foundUser.$query().update(foundUser);
      }
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

      // Refresh token was still valid
      const firstname = foundUser.firstname;
      const lastname = foundUser.lastname;
      const email = foundUser.email;
      const roles = foundUser.roles;
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser.id,
            email: decoded.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      const newRefreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // Saving refreshToken with current user
      foundUser.refresh.tokens = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.$query().update(foundUser);

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: process.env.ACCESS_EXPIRES_IN,
      });

      res.json({ firstname, lastname, email, roles, accessToken });
    }
  );
}
