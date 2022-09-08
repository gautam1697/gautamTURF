const mongoose=require('mongoose')
const User=require('./user.Model')
const turfSchema= new mongoose.Schema({
    owner:[{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"Owner details required"],
        ref:'User'
    }],
    managers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }],
turfname:{type:String,required:[true,"Mandatory to pass turf name"],unique:true},
sports:[{type:String,
    enum:['cricket','football','basketball','badminton','volleyball'],
    default:null
}],
playgrounds:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'playground'

}],
hoursopen:{ot:{type:Date},ct:{type:Date}},
location:{
    type:String
},
status:{type:Boolean},
availabledates:[{
    type:Date
}],
bookings:[{ type:mongoose.Schema.Types.ObjectId,
    ref:'booking'
}],
booking_price:{type:Number,required:true}
,
turf_status:{type:String}

});


module.exports=mongoose.model('Turf',turfSchema);