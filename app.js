if (process.env.NODE_ENV != "production") {   // is not equal to 'production' as we are in 'developement' phase
  require('dotenv').config()  // dotenv file is used in development only and not in production
}
// console.log(process.env.SECRET) // remove this after you've confirmed it is working


//whenever we'll deploy our code or upload it to github, we never have to upload "dotenv" file even 
// by mistake coz it contain our "important credentials"
// we have to use "dotenv" when not in production phase
// we don't have to use "dotenv" when in production phase

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const Review = require('./models/review');
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")
const { listingSchema, reviewSchema } = require("./schema")         //for schema validation
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

const session = require('express-session')
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');



const listingRouter = require("./routes/listing")
const reviewRouter = require("./routes/review")
const userRouter = require("./routes/user")

const port = 8080

const path = require('path')  //views ejs chroma
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')))



// error handling for express


// // 1st - create class ExpressError 
// // use it with  "async fn" as "next (new expressError(status,msg))"
// // use it with  "normal fn" as "throw new expressError(status,msg)"
// // 2nd - create err handling middleware just above app.listen
// // 3rd - create wrapAsync function instead of try catch block
// // 4th - create app.all just above error handling middleware for all other route that does not exist

//]

//we have done client side validation for form (using bootstrap that includes using 
// "needs-validation, novalidate, required"). Now client cannot send wrong info 
// but through "hopscotch" we can still give wrong info in order to prevent that we will use "JOI" 
// so that no one can send wrong info even from hopscotch.


// now we are doing schema validation through "JOI" npm package. 


// MVC BELOW
// fistly all the routes related to listing and reviews were in only app.js and making it look bulky
// so for that we created route folder (files- lisitng, reviews) and put all listing and review 
// related things in their respective files and even after that we created "controller" folder
// and put all code  starting with "async(req,res,next)" to controller (files- listing, reviews) 



// to upload files (see below)
// enctype="multipart/form-data" used for sending files in form
//Multer is a "NPM" package for handling multipart/form-data, 
//which is primarily used for uploading files
//files are not saved in database so for that we get file from client and we send this file to third party 
// app (whose work is to store files) and get the link from the app and store that link in database
// 1) create .env file, 2) read starting 10 lines of app.js , 3) create cloudConfig.js


// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderLust'
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log('Connected to DB')
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl)
};

// app.get('/', (req, res) => {
//   res.send('root')
// })


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,

})

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err)
})

//
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}


app.use(session(sessionOptions))
// if connect.sid appear in application that means session is working

//

// [  this below code should be user after session
app.use(passport.initialize())
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ]


//
app.use(flash());  //  this should come before using any route except "/" route

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  // console.log(res.locals.success)
  next()
})
//



// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@getMaxListeners.com",
//     username: "delta-student"
//   })
//   let registeredUser = await User.register(fakeUser, "helloworld")
//   res.send(registeredUser)
// })



app.use("/listings", listingRouter)      //remove listing related thing and put it in another folder
app.use("/listings/:id/reviews", reviewRouter)      //remove listing related thing and put it in another folder
// "routes" and in file "listing.js"   

// all routes related to "listing" has been transfered to ./routes/listing.js
//this code kind of make it as if nothing has happened and "all the routes related to lisitng is still
// here"
app.use("/", userRouter)

app.all("*", async (req, res, next) => {
  next(new ExpressError(404, "Page not found"))
})


app.use((err, req, res, next) => {
  let { status = 400, message = "error occurred" } = err;
  // console.log(err)
  res.status(status).render("listings/error.ejs", { message })
  // res.status(status).send(message)
})

app.listen(port, () => {
  console.log(`listening`)
})



// app.get("/testListing", async (req,res)=>{

// let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangut, Goa",
//     country: "India"
// })

// await sampleListing.save()
// console.log("sample was saved")
// console.log("successful testing")

// })



