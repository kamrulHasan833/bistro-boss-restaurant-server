const jwt = require("jsonwebtoken");
const authGuard = (req, res, next) => {
  try {
    const token = req?.headers?.authorization.split(" ")[1];

    if (!token) {
      res.status(401).send({ error: "unauthorized access" });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          res.status(401).send({ error: "unauthorized access" });
        } else {
          req.user = decode;
          next();
        }
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
module.exports = authGuard;
