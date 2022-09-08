const express=require('express');
const { createBooking,cancelBooking,updateBooking,getBooking } = require('../controller/booking.Controller');
const { isAuthenticated ,isMerchant,isAdmin} = require('../middlewares/auth');
const router=express.Router();
router.route('/createbooking/user').post(isAuthenticated,createBooking)
router.route('/createbooking/merchant').post(isMerchant,createBooking)
router.route('/createbooking/admin').post(isAdmin,createBooking)
router.route('/updatebooking/user').put(isAuthenticated,updateBooking)
router.route('/updatebooking/merchant/:id').put(isMerchant,updateBooking)
router.route('/updatebooking/admin').put(isAdmin,updateBooking)
router.route('/cancelbooking/user').post(isAuthenticated,cancelBooking)
router.route('/cancelbooking/merchant').post(isMerchant,cancelBooking)
router.route('/cancelbooking/admin').post(isAdmin,cancelBooking)
router.route('/getbooking/user').post(isAuthenticated,getBooking)
router.route('/getbooking/merchant').post(isMerchant,getBooking)
router.route('/getbooking/admin').post(isAdmin,getBooking)

module.exports=router;

