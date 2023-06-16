const express= require("express");
const {
    createUser,
    loginUserCtrl, 
    getAllUser,
    getaUser,
    deleteaUser,
    updatedUser,
} = require("../controller/userController");
const router= express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getAllUser);
router.get("/:id", getaUser);
router.delete("/:id", deleteaUser);
router.put("/:id", updatedUser);
module.exports=router;