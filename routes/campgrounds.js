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
router.post("/", isLoggedIn, function(req, res){
   //get data from form and add to campgrounds array
   //redirect back to campgrounds page
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var author =  {
      id: req.user._id,
      username: req.user.username
   };
   var newCampground = {name: name, image: image, description: description, author: author};
   
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

router.get("/new", isLoggedIn, function(req, res) {
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
      Campground.findById(req.params.id, function(err, foundCampground){
         if(err) {
            
         } else {
            res.render("campgrounds/edit", {campground: foundCampground});
         }
      });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
         res.redirect("back");
      } else{
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("back");
      } else {
         res.redirect("/campgrounds");
      }
   })
});

//middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
   if(req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCampground){
         if(err){
            res.redirect("back");
         } else {
            if(foundCampground.author.id.equals(req.user._id)) {
               next();
            } else {
               res.redirect("back");
            }
         }
      });
   } else {
      res.redirect("back");
   }
}

module.exports = router;