const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    let allListings = await Listing.find()
    // console.log(allListings)
    res.render("listings/index.ejs", { allListings })
  }

  module.exports.renderNewForm =  (req, res) => {
    // console.log(req.user)
    res.render("listings/new.ejs")
  }

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    
    }).populate("owner")
  
    console.log(listing)
  
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist")
      res.redirect("/listings")
    }
    // console.log(listing)
    // console.log(listing)
    res.render("listings/show.ejs", { listing })
  
  }


  module.exports.createListing = async (req, res, next) => {

    // let {title,description,price,location,country} = req.body;
    // console.log(newListing)
  
    let url = req.file.path
    let filename = req.file.filename
    // console.log(url)
    // console.log(filename)

    let listing = req.body.listing;
    let newListing = new Listing(listing)
    newListing.image = {url, filename}
    newListing.owner  = req.user._id;
    await newListing.save()
    req.flash("success", "New Listing Created")
    res.redirect("/listings")
  
  
  }

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist")
      res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url
    // let originalImage = originalImageUrl.replace("/upload", "/upload/h_200,w_250")
    console.log(originalImageUrl)

    res.render("listings/edit.ejs", { listing , originalImageUrl})
  }

  module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
    let lisitng = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    if(typeof req.file !== 'undefined'){
      let url = req.file.path
      let filename = req.file.filename
      lisitng.image = {url, filename}
      await lisitng.save()
    }

    req.flash("success", "Listing Updated")
  
    res.redirect(`/listings/${id}`)
  }

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted")
    // console.log(deletedListing)
    res.redirect("/listings")
  }