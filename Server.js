require('dotenv').config();
const express = require("express");
const userRoute = require('./routes/UserRoutes');
const app = express();
const db = require('./db')
const pizzaRouter = require("./routes/PizzaRoutes");
const orderRouter = require('./routes/OrderRoutes') 
const BurgerRouter = require('./routes/BurgerRoutes')
const IndianMealsRouter = require('./routes/IndianMealsRoutes')
const SidesRouter = require('./routes/SidesRoutes')
const bevarageRouter = require('./routes/BevarageRoutes')
const contactRoutes = require('./routes/ContactRoutes')
const feedbackRoutes = require('./routes/FeedbackRoutes')
const donationRoutes = require('./routes/DonationRoutes')
const sessionOrderRoutes=require('./routes/SessionOrderRoutes')
const sessionDonationRoutes = require('./routes/SessionDonationRoutes')

const cors = require('cors');
const corsOptions = {
  origin: ['https://yumyard.onrender.com', 'https://yumyard.vercel.app'],
  credentials: true,
};
const cookieParser = require('cookie-parser');
app.use(express.json({ limit: '20mb' }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("server working");
});
app.use("/api/pizzas/", pizzaRouter.getPizza);
app.use("/api/pizzas/", pizzaRouter.addNewProduct);
app.use("/api/pizzas/", pizzaRouter.deleteProduct);
app.use("/api/pizzas/", pizzaRouter.getById);
app.use("/api/pizzas/", pizzaRouter.editProduct);
app.use("/api/burgers/", BurgerRouter.getAllBurgers);
app.use("/api/burgers/", BurgerRouter.getBurgerById);
app.use("/api/burgers/", BurgerRouter.addNewBurger);
app.use("/api/burgers/", BurgerRouter.editBurger);
app.use("/api/burgers/", BurgerRouter.deleteBurger);
app.use("/api/indianmeals/", IndianMealsRouter.getAllIndianMeals);
app.use("/api/indianmeals/", IndianMealsRouter.deleteIndianMeal);
app.use("/api/indianmeals/", IndianMealsRouter.getIndianMealById);
app.use("/api/indianmeals/", IndianMealsRouter.addNewIndianMeal);
app.use("/api/indianmeals/", IndianMealsRouter.editIndianMeal);
app.use("/api/sides/", SidesRouter.getAllSides);
app.use("/api/sides/", SidesRouter.addNewSide);
app.use("/api/sides/", SidesRouter.deleteSide);
app.use("/api/sides/", SidesRouter.editSide);
app.use("/api/sides/", SidesRouter.getSideById);
app.use("/api/bevarages/", bevarageRouter.getAllBevarages);
app.use("/api/bevarages/", bevarageRouter.getBevarageById);
app.use("/api/bevarages/", bevarageRouter.addNewBevarage);
app.use("/api/bevarages/", bevarageRouter.editBevarage);
app.use("/api/bevarages/", bevarageRouter.deleteBevarage);
app.use("/api/users/",userRoute.userRegister)
app.use('/api/users/',userRoute.loginInfo)
app.use('/api/users/',userRoute.getUsersRoute)
app.use('/api/users/',userRoute.removeUser)
app.use('/api/users/',userRoute.getOtp)
app.use('/api/users/',userRoute.doesExist)
app.use('/api/users/',userRoute.doesNotExist)
app.use('/api/users/',userRoute.doesAlreadyExist)
app.use('/api/users/',userRoute.doesContactExist)
app.use('/api/users/',userRoute.updatePasswordRoute)
app.use('/api/users/',userRoute.getUserByEmail)
app.use('/api/orders',orderRouter.placeOrder)
app.use('/api/orders',orderRouter.getAllOrders)
app.use('/api/orders',orderRouter.getAllUserOrders)
app.use('/api/orders',orderRouter.delivery)
app.use('/api/orders',orderRouter.cancelOrder)
app.use('/api/contacts',contactRoutes.getAllContacts)
app.use('/api/contacts',contactRoutes.submitContact)
app.use('/api/feedbacks',feedbackRoutes.getAllFeedbacks)
app.use('/api/feedbacks',feedbackRoutes.submitFeedback)
app.use('/api/donation',donationRoutes.donateRoute)
app.use('/api/donation',donationRoutes.getAllDonations)
app.use('/api/session-donations',sessionDonationRoutes.downloadDonationReceipt)
app.use('/api/session-donations',sessionDonationRoutes.findByIdAndSaveDonation)

app.use('/api/session-orders',sessionOrderRoutes.findByIdAndSave)
app.use('/api/session-orders',sessionOrderRoutes.downloadReceipt)
const port = process.env.PORT || 8000;
app.listen(port, () => "server running on port");
