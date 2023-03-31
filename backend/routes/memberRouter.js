const express = require("express");
const router = express();
const MemberController = require("../Controller/MemberController");

router.post("/borrow", MemberController.borrowBook);
router.post("/return", MemberController.returnBook);
router.get("/all/book", MemberController.allAvailableBook);
router.get("/all/member", MemberController.allMember);

module.exports = router;
