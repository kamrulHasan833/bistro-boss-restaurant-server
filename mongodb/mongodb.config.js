const { MongoClient, ServerApiVersion } = require("mongodb");

// require get handlers
const {
  getMenu,
  getReviews,
  getAllFoodFromCart,
  getAllUsers,
  isAdminOrNot,
  getAllPayments,
  getOverallStat,
  getAItem,
} = require("../handlers/getHandlers");
// require post handlers
const {
  addAFoodToCart,
  createAUser,
  creatAItem,
  addPayment,
} = require("../handlers/postHandlers");
// require update handlers
const { setUserRole, updateAItem } = require("../handlers/updateHandlers");
// require delete handler
const {
  deleteAFoodFromCart,
  deleteAUser,
  deleteAMenuItem,
} = require("../handlers/deleteHandlers");
const authGuard = require("../authentication/authGuard");
const admin = require("../middlewares/admin");
const mongodb_config = (app) => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qoh5erv.mongodb.net/?retryWrites=true&w=majority`;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  async function run() {
    try {
      // database
      const database = client.db("bistro-boss-restaurant");
      // create collections
      const menuCollection = database.collection("menu");
      const reviewsCollection = database.collection("reviews");
      const cartCollection = database.collection("cart");
      const userCollection = database.collection("users");
      const paymentCollection = database.collection("payments");

      // get all users
      app.get(
        "/bistro-boss-restaurant/v1/users",
        authGuard,

        (req, res) => {
          getAllUsers(req, res, userCollection);
        }
      );

      // check whether a user is admin
      app.get("/bistro-boss-restaurant/v1/admin", (req, res) => {
        isAdminOrNot(req, res, userCollection);
      });

      // create a user
      app.post("/bistro-boss-restaurant/v1/users", (req, res) => {
        createAUser(req, res, userCollection);
      });

      // updete  user role
      app.patch("/bistro-boss-restaurant/v1/users/:id", (req, res) => {
        setUserRole(req, res, userCollection);
      });
      // updete  user role
      app.delete("/bistro-boss-restaurant/v1/users/:id", (req, res) => {
        deleteAUser(req, res, userCollection);
      });

      // get all menu items
      app.get("/bistro-boss-restaurant/v1/menu", (req, res) => {
        getMenu(req, res, menuCollection);
      });
      // get a menu items
      app.get("/bistro-boss-restaurant/v1/menu/:id", (req, res) => {
        getAItem(req, res, menuCollection);
      });

      // create a item
      app.post("/bistro-boss-restaurant/v1/menu", (req, res) => {
        creatAItem(req, res, menuCollection);
      });
      // update a item
      app.patch("/bistro-boss-restaurant/v1/menu/:id", (req, res) => {
        updateAItem(req, res, menuCollection);
      });
      // delete a item
      app.delete("/bistro-boss-restaurant/v1/menu/:id", (req, res) => {
        deleteAMenuItem(req, res, menuCollection);
      });
      // get all reviews
      app.get("/bistro-boss-restaurant/v1/reviews", (req, res) => {
        getReviews(req, res, reviewsCollection);
      });

      // get all carts of a user
      app.get("/bistro-boss-restaurant/v1/cart", (req, res) => {
        getAllFoodFromCart(req, res, cartCollection);
      });

      // create a food to cart collection
      app.post("/bistro-boss-restaurant/v1/cart", (req, res) => {
        addAFoodToCart(req, res, cartCollection);
      });

      // delete a food from cart collection
      app.delete(
        "/bistro-boss-restaurant/v1/cart/:id",
        authGuard,
        (req, res) => {
          deleteAFoodFromCart(req, res, cartCollection);
        }
      );

      // get all payments
      app.get("/bistro-boss-restaurant/v1/payments", (req, res) => {
        getAllPayments(req, res, paymentCollection);
      });

      // create a payment
      app.post("/bistro-boss-restaurant/v1/payments", (req, res) => {
        addPayment(req, res, paymentCollection, cartCollection);
      });

      // get overall organization statistics for admin only
      app.get("/bistro-boss-restaurant/v1/statistics", (req, res) => {
        getOverallStat(req, res, paymentCollection, menuCollection);
      });
      // Connect the client to the server	(optional starting in v4.7)
      //   await client.connect();
      //   // Send a ping to confirm a successful connection
      //   await client.db("admin").command({ ping: 1 });
      //   console.log(
      //     "Pinged your deployment. You successfully connected to MongoDB!"
      //   );
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
};

module.exports = mongodb_config;
