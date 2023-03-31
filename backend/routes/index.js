const express = require("express");
const router = express();
const memberRouter = require("../routes/memberRouter");

router.use("/", memberRouter);

module.exports = router;
