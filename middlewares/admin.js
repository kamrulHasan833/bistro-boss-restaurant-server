const admin = async (req, res, next, collection) => {
  const email = req.user.email;
  try {
    const result = await collection.findOne({ email });
    let isAdmin;
    if (result.role === "admin") {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
    if (isAdmin) {
      next();
    } else {
      res.status(401).send({
        error: "unauthorized access",
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

module.exports = admin;
