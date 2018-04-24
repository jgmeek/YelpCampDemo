var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    seedDB     = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
   Campground.find({}, function(err, allCampgrounds){
      if(err) {
         console.log("Failed to get all campgrounds.");
         console.log(err);
      } else {
         res.render("campgrounds/index", {campgrounds:allCampgrounds})
      }
   });
});

app.post("/campgrounds", function(req, res){
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

app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new");
});


// SHOW - Shows more information about one campgronud
app.get("/campgrounds/:id", function(req, res) {
   //Get campground based on id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
         console.log(err);
      }
      else {
         res.render("campgrounds/show", {campground: foundCampground});
      }
   });
})

// =================
// COMMENTS ROUTES
// =================
app.get("/campgrounds/:id/comments/new", function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
      if(err){
         console.log(err);
      } else {
         res.render("comments/new", {campground: campground});
      }
   })
});

app.post("/campgrounds/:id/comments", function(req, res){
   Campground.findById(req.params.id, function(err, campground) {
       if(err) {
          console.log(err);
          res.redirect("/campgrounds");
       } else {
          Comment.create(req.body.comment, function(err, comment){
             if(err) {
                console.log(err);
             } else {
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
             }
          });
       }
   });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started"); 
});