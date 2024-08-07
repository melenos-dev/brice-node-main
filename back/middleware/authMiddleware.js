import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = {
  isLogged: async function (req, res, next) {
    try {
      const { headers } = req;
      const cookies = req.session;

      if (!cookies || !cookies.access_token) {
        return res.status(401).json("Disconnected. Refresh window");
      }

      const accessToken = cookies.access_token;

      if (!headers || headers["x-xsrf-token"]) {
        return res.status(401).json("Missing XSRF token in headers");
      }

      const xsrfToken = headers["x-xsrf-token"];

      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN, {
        algorithms: process.env.ALGORYTHM,
      });

      if (xsrfToken !== decodedToken.UserInfo.xsrfToken) {
        return res.status(401).json("Bad xsrf token");
      }

      const user = await User.findById({ id: decodedToken.UserInfo.id });
      if (!user)
        return res
          .status(401)
          .json({ message: `User ${decodedToken.UserInfo.id} not exists` });

      req.auth = {
        user,
      };
      return next();
    } catch (error) {
      res.status(500).json("internal error");
    }
  },
};

export function isAllowed(levels) {
  return (req, res, next) => {
    if (!levels.some((current) => req.auth.roles.levels.includes(current)))
      return res.status(401).json("Not authorized");
    return next();
  };
}
