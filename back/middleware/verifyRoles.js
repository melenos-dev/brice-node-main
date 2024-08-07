const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles?.levels) {
      return res.sendStatus(401);
    }
    const rolesArray = [...allowedRoles];
    const result = req.roles.levels
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) {
      return res.sendStatus(401);
    }
    next();
  };
};

export default verifyRoles;
