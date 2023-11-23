const jwt = require("jsonwebtoken");
const createJWTToken = (req, res) => {
  try {
    const payload = req.body;
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send({ error: "internal server error!" });
  }
};
module.exports = createJWTToken;
