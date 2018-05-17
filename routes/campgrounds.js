var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//campgrounds read
router.get("/", function(req, res){
   Campground.find({}, function(err, allCampgrounds){
      if(err) {
         console.log("Failed to get all campgrounds.");
         console.log(err);
      } else {
         res.render("campgrounds/index", {campgrounds:allCampgrounds})
      }
   });
});

//campgroungs create
router.post("/", function(req, res){
   //get data from form and add to campgrounds array
   //redirect back to campgrounds page
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   console.log(image);
   var newCampground = {name: name, image: image, description: description};
   
   Campground.create(newCampground, function(err, newlyCreated){
      if(err) {
         console.log("Failed to create new campground.");
         console.log(err);
      }
      else {
         res.redirect("campgrounds");
      }
   })
});

router.get("/new", function(req, res) {
   res.render("campgrounds/new");
});


// SHOW - Shows more information about one campgronud
router.get("/:id", function(req, res) {
   //Get campground based on id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
         console.log(err);
      }
      else {
         res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

//middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
}

module.exports = router;