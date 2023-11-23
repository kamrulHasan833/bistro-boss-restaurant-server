const { ObjectId } = require("mongodb");

const deleteAUser = async (req, res, collection) => {
  const id = req.params.id;
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
const deleteAFoodFromCart = async (req, res, collection) => {
  const id = req.params.id;
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// delete a menu item
const deleteAMenuItem = async (req, res, collection) => {
  const id = req.params.id;

  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

module.exports = { deleteAFoodFromCart, deleteAUser, deleteAMenuItem };
