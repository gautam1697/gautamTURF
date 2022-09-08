const express=require('express')
const{registerTurf, updateTurfOwner,updateTurfAdmin, removeTurf, createPlayground,cancelPlayground,updatePlayground}=require('../controller/turf.Controller')
const {isAdmin,isMerchant}=require('../middlewares/auth')
const router=express.Router();
router.route('/registerturf').post(isMerchant,registerTurf)
router.route('/updateturf1/:id').put(isMerchant,updateTurfOwner)
router.route('/updateturf2/:id').put(isAdmin,updateTurfAdmin)
router.route('/removeturf/:id').put(isMerchant,removeTurf)
router.route('/createplayground').post(isMerchant,createPlayground)
router.route('/updateplayground/:id').put(isMerchant,updatePlayground)
router.route('/cancelplayground/:id').put(isMerchant,cancelPlayground)
module.exports=router;