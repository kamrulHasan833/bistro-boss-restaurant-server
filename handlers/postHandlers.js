const stripe = require("stripe");
const { ObjectId } = require("mongodb");
const { paymentIntents } = stripe(process.env.STRIPE_SECRET_KEY);
// create a user
const createAUser = async (req, res, collection) => {
  const userInfo = req.body;
  const { email, displayName, photoURL } = userInfo;
  try {
    const query = { email: email };
    const existedUser = await collection.find(query).toArray();
    const isUserExist = existedUser && existedUser.length === 0 ? false : true;
    if (!isUserExist) {
      const result = await collection.insertOne({
        name: displayName,
        email,
        avatar: photoURL,
      });
      res.status(200).send(result);
    } else {
      res.status(200).send({ alreadyExist: true });
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// create a item
const creatAItem = async (req, res, collection) => {
  const food = req.body;

  try {
    const result = await collection.insertOne(food);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// add food to cart
const addAFoodToCart = async (req, res, collection) => {
  const food = req.body;

  try {
    const result = await collection.insertOne(food);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// add food to cart
const paymentIntent = async (req, res) => {
  const { price } = req.body;

  try {
    const paymentIntent = await paymentIntents.create({
      amount: parseInt(price * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
// add payment
const addPayment = async (req, res, paymentCollection, cartCollection) => {
  const paymentInfo = req.body;
  const { cart_ids, food_ids } = paymentInfo ? paymentInfo : {};

  try {
    const new_food_ids = food_ids.map((food_id) => new ObjectId(food_id));
    paymentInfo.food_ids = new_food_ids;
    const postResult = await paymentCollection.insertOne(paymentInfo);
    if (postResult.insertedId) {
      const ids = cart_ids.map((cart_id) => new ObjectId(cart_id));
      const query = {
        _id: {
          $in: ids,
        },
      };

      const deleteResult = await cartCollection.deleteMany(query);

      res.status(200).send({ postResult, deleteResult });
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

module.exports = {
  addAFoodToCart,
  createAUser,
  creatAItem,
  paymentIntent,
  addPayment,
};
