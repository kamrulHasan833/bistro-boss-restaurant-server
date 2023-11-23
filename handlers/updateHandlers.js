const { ObjectId } = require("mongodb");
const setUserRole = async (req, res, collection) => {
  const id = req.params.id;
  const role = "admin";
  const updatedDoc = {
    $set: {
      role,
    },
  };
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updatedDoc
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
const updateAItem = async (req, res, collection) => {
  const id = req.params.id;
  const updatedItem = req.body;

  const updatedDoc = {
    $set: updatedItem,
  };
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updatedDoc
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

module.exports = { setUserRole, updateAItem };
