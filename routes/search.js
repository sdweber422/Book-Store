const express = require("express");
const router = express.Router();

router.get("/", (request, response, next) => {
  response.render("search");
});

module.exports = router;
