const mongoose=require('mongoose')
const User=require('./user.Model')
const Turf=require('./turf.Model')


const bookingSchema= new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    turfname:{type:String},
    createdat:{type:Date,default:Date.now()},
    playground_id:{type:mongoose.Schema.Types.ObjectId,ref:'playground'},
    location:{type:String,ref:'Turf'},
    booking_price:{type:Number,ref:"Turf"},
    booking_status:{type:Boolean,required:[true,"confimed booking"]},
    payment_status:{type:String,default:"Pending"},
    st:{type:Date},
    et:{type:Date}

});





module.exports=mongoose.model('Booking',bookingSchema)