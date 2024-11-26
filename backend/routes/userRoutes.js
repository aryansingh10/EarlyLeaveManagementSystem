const express = require("express");
const { auth, roleCheck } = require("../middlewares/auth");
const { getStudents, approveStudents, deleteStudentById } = require("../controllers/userController");
const router = express.Router();

router.get("/get-students", auth, roleCheck("coordinator", "hod"), getStudents);
router.patch("/approve-student/:id", auth, roleCheck("coordinator", "hod"),approveStudents );
router.delete("/delete-student/:id", auth, roleCheck("coordinator", "hod"), deleteStudentById);
module.exports = router;
