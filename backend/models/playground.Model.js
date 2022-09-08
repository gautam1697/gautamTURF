const mongoose=require('mongoose')

const playgroundSchema= new mongoose.Schema({
    turf_id:{type:mongoose.Schema.Types.ObjectId,ref:'Turf',required:true},
    slot:[{st:{type:Date},et:{type:Date},booking_id:{type:mongoose.Schema.Types.ObjectId}}],
    playground_name:{type:String,required:true},
    managers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    playground_status:{type:String,default:'Unoccupied',required:true}
});

module.exports= mongoose.model('Playground',playgroundSchema)