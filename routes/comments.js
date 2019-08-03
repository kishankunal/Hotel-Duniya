var   express    = require("express"),
      router     = express.Router({ mergeParams: true }),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");

// comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
  //lookup campground using id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) { 
      console.log(err);
      res.redirect("/campgrounds");
    }
    else {
      //create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong.");
          console.log(err);
        } else {
          //add username and id to comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.campid = campground._id;
          //save comment
          comment.save();
          console.log(comment);
          //connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          //redirect to campground show page
          req.flash("success", "Successfully added comment");
          //req.flash("success", comment.text + " " + comment.author.id + " " + comment.author.username + " " + campground.name + " " +campground._id);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// commnet Update
router.put("/:comment_id", middleware.checkCommentOwenership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) { res.redirect("back"); }
    else { 
      req.flash("success", "Comment updated");
      res.redirect("/campgrounds/" + req.params.id); }
  });
});

// comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwenership, (req, res) => {
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) { res.redirect("back"); }
    else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
