const { AppError } = require("./utils/AppError.js");
const globalErrorHandling = require("./utils/GlobalErrorHandling.js");

// Routes
const login = require("./routes/login");
const register = require("./routes/register");
const profile = require("./routes/profile");
const profileUpdate = require("./routes/profileUpdate");
const changePassword = require("./routes/changePassword");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const category = require("./routes/category");
const vegetables = require("./routes/vegetables");
const grocery = require("./routes/grocery");
const drinks = require("./routes/drinks");
const fruites = require("./routes/fruits");
const dairy = require("./routes/dairy");
const forgotPassword = require("./routes/forgotPassword");
const fcm = require("./routes/fcm");
const banner = require("./routes/banner");
const address = require("./routes/address");
const post = require("./routes/post");
const newPost = require("./routes/newPost");
const comment = require("./routes/cmd");
const personalCare = require("./routes/personalCare");
const healthCare = require("./routes/healthCare");
const driedNoodles = require("./routes/driedNoodles");
const home = require("./routes/home");
const babyItems = require("./routes/babyItems");

const hijabRouter = require("./routes/musfiRouters/hijabs/hijabsRouter.js");
const featureRoute = require("./routes/musfiRouters/featureProducts/featureProductsRouter.js");
const scarfsRouter = require("./routes/musfiRouters/scarfs/scarfsRouter.js");

function bootstrap(app) {
    app.use("/api/v1/login", login);
    app.use("/api/v1/register", register);
    app.use("/api/v1/profile", profile);
    app.use("/api/v1/profileUpdate", profileUpdate);
    app.use("/api/v1/changePassword", changePassword);
    app.use("/api/v1/productRoutes", productRoutes);
    app.use("/api/v1/orderRoutes", orderRoutes);
    app.use("/api/v1/category", category);
    app.use("/api/v1/vegetables", vegetables);
    app.use("/api/v1/grocery", grocery);
    app.use("/api/v1/drinks", drinks);
    app.use("/api/v1/fruites", fruites);
    app.use("/api/v1/dairy", dairy);
    app.use("/api/v1/forgotPassword", forgotPassword);
    app.use("/api/v1/address", address);
    app.use("/api/v1/fcm", fcm);
    app.use("/api/v1/banner", banner);
    app.use("/api/v1/home", home);
    app.use("/api/v1/babyItems", babyItems);
    app.use("/api/v1/personalCare", personalCare);
    app.use("/api/v1/healthCare", healthCare);
    app.use("/api/v1/driedNoodles", driedNoodles);
    app.use("/api/v1/post", post);
    app.use("/api/v1/newPost", newPost);
    app.use("/api/v1/comment", comment);

    app.use("/api/v1/hijabs", hijabRouter);
    app.use("/api/v1/featureProducts", featureRoute)
    app.use("/api/v1/scarfs", scarfsRouter)

    // Catch-all for undefined routes
    app.all("*", (req, res, next) => {
        next(new AppError("Endpoint was not found", 404));
    });

    // // Global error handling middleware
    // app.use(globalErrorHandling);
}

module.exports = { bootstrap };
