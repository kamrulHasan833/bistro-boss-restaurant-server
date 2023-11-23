const { ObjectId } = require("mongodb");

const getAllUsers = async (req, res, collection) => {
  try {
    const result = await collection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// check whether a user is admin
const isAdminOrNot = async (req, res, collection) => {
  const email = req.query.email;

  try {
    const result = await collection.findOne({ email });
    let isAdmin;
    if (result.role === "admin") {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
    res.status(200).send({ isAdmin });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// get all menu items
const getMenu = async (req, res, collection) => {
  const category = req?.query?.category;
  const query =
    category === "undefined"
      ? null
      : {
          category,
        };

  try {
    let result;
    if (query) {
      result = await collection.find(query).toArray();
    } else {
      result = await collection.find().toArray();
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// get a menu item
const getAItem = async (req, res, collection) => {
  const id = req.params.id;

  const query = { _id: new ObjectId(id) };

  try {
    const result = await collection.findOne(query);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
const getReviews = async (req, res, collection) => {
  try {
    const result = await collection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
// get all cart food of a user
const getAllFoodFromCart = async (req, res, collection) => {
  const email = req.query.email;
  try {
    const result = await collection.find({ user_email: email }).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

// get all payments
const getAllPayments = async (req, res, collection) => {
  const email = req.query.email;
  try {
    const result = await collection.find({ consumer_email: email }).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
// get all payments
const getOverallStat = async (req, res, paymentCollection, menuCollection) => {
  try {
    // get total revenue
    const revenue = await paymentCollection
      .aggregate([
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$price",
            },
          },
        },
      ])
      .toArray();
    // get total customers
    const customers = await paymentCollection
      .aggregate([
        {
          $group: {
            _id: "$consumer_email",
            customers: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: null,
            customers: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    // get total orders
    const orders = await paymentCollection
      .aggregate([
        {
          $group: {
            _id: null,
            orders: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    // get total products size
    const products = await menuCollection.estimatedDocumentCount();

    // get number of salse per menu
    const sold = await paymentCollection
      .aggregate([
        {
          $unwind: "$food_ids",
        },
        {
          $lookup: {
            from: "menu",
            localField: "food_ids",
            foreignField: "_id",
            as: "menu_items",
          },
        },
        {
          $unwind: "$menu_items",
        },
        {
          $group: {
            _id: "$menu_items.category",
            quantity: {
              $sum: 1,
            },
            revenue: {
              $sum: "$menu_items.price",
            },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            quantity: "$quantity",
            revenue: "$revenue",
          },
        },
      ])
      .toArray();
    res.status(200).send({
      revenue: revenue[0]?.revenue,
      customers: customers[0]?.customers,
      products,
      orders: orders[0]?.orders,
      categories: sold,
    });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
module.exports = {
  getMenu,
  getReviews,
  getAllFoodFromCart,
  getAllUsers,
  isAdminOrNot,
  getAllPayments,
  getOverallStat,
  getAItem,
};
