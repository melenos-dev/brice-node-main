import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function handleLogin(req, res) {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  const foundUser = await User.query().findOne({ email });

  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const firstname = foundUser.firstname;
    const lastname = foundUser.lastname;
    const roles = foundUser.roles;
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          email: foundUser.email,
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

    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refresh.tokens
      : foundUser.refresh.tokens.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
      const refreshToken = cookies.jwt;
      const foundToken = await User.query()
        .select("refresh")
        .where(User.ref("refresh:tokens"), "=", refreshToken)
        .first(); // Verifier que ça recherche bien dans la totalité de l array

      // Detected refresh token reuse!
      if (!foundToken) {
        console.log("!foundtoken :" + refreshToken);
        console.log("attempted refresh token reuse at login!");
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }
    // Saving refreshToken with current user
    foundUser.refresh.tokens = [...newRefreshTokenArray, newRefreshToken];

    const result = await foundUser.$query().update(foundUser);
    console.log(result);
    console.log(roles);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: process.env.ACCESS_EXPIRES_IN,
    });

    // Send authorization roles and access token to user
    res.json({ firstname, lastname, roles, accessToken });
  } else {
    res.sendStatus(401);
  }
}
