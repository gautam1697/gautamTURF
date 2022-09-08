const express=require('express');
const{register,loginUser,logout,updateRole,getUser, getUserDetails, updateUserProfile, blockUserProfile,getAllUsers, forgotPassword, resetPassword, updatePassword}=require('../controller/user.Controller')

const{isAuthenticated,isAdmin,isMerchant}=require('../middlewares/auth')
const router=express.Router();
router.route('/register').post(register)
router.route('/login').post(loginUser)
router.route('/updaterole').put(isMerchant,updateRole)
router.route('/getuser/:id').get(isAuthenticated,getUserDetails)
router.route('/update/:id').put(isAuthenticated,updateUserProfile)
router.route('/blockuser/:id').put(isMerchant,blockUserProfile)
router.route('/allusers').get(isMerchant,getAllUsers)
router.route('/forgot/password').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route("/updatepass/user").put(isAuthenticated,updatePassword)
router.route("/updatepass/merchant").put(isMerchant,updatePassword)
router.route('updatepass/admin').put(isAdmin,updatePassword)
router.route("/logout").get(logout)

module.exports=router;

