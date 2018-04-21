var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
   Campground.find({}, function(err, allCampgrounds){
      if(err) {
         console.log("Failed to get all campgrounds.");
         console.log(err);
      } else {
         res.render("campgrounds", {campgrounds:allCampgrounds})
      }
   });
});

app.post("/campgrounds", function(req, res){
   //get data from form and add to campgrounds array
   //redirect back to campgrounds page
   var name = req.body.name;
   var image = req.body.image;
   console.log(image);
   var newCampground = {name: name, image: image};
   
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

app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started"); 
});