const express = require('express')

const router = express.Router()

const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const { listingSchema } = require("../schema")
const Listing = require('../models/listing');
const {isLoggedIn, isOwner} = require("../middleware")

const listingController = require("../controllers/listing")

const {storage} = require("../cloudConfig")  //use it above upload

const multer  = require('multer')
const upload = multer({ storage })   // destination where file will be uploaded. Earlier it was 'uploads'

// MVC => model for (database), views for (frontend), controllers for (backend)

//after transfering of "all the routes related to lisitng"

// 1st write this ---        const router = express.Router()

//2nd replace "app" with "router"

// 3rd write this ---        module.exports = router;

//4th remove common "word" that is "listing" word from "route" e.g below

// from the below code remove "/listing"   >>>>

// router.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs")                        don't remove "listing" word from here okay
//   })

//and keep it like this  >>>

// router.get("/new", (req, res) => {
//     res.render("listings/new.ejs")
//   })

const validateListing = (req, res, next) => {

  let { error } = listingSchema.validate(req.body)

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(404, errMsg)
  } else {
    next()
  }
}



//
router.route("/")
// index route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing))
//




//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)  // keep this above from ("/:id") otherwise 
// ("/new") will be considered an id and will be looked for in database and will surely throw an error




//
router.route("/:id") 

//Show Route
.get(wrapAsync(listingController.showListing))

//delete route
.delete(isLoggedIn, isOwner, listingController.destroyListing)

//update route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
//



//edit route

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;