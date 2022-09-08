const mongoose=require('mongoose')
const bcrypt=require('bcrypt');
const crypto=require('crypto')


const userSchema=new mongoose.Schema({
username:{
    type:String,required:[true,'Please Enter your name']
},
email:{
    type:String,
    required:[true,"Please Enter Email"],
    unique:[true,"Email already exists"],
    immutable:true

},
password:{
    type:String,
required:[true,"Please Enter Password"],
select:false,
},
firstname:{type:String,
required:[true,"Mandatory to Enter First Name"],
},
lastname:{
    type:String,
    required:[true,"Mandatory to Enter last name"]
},
phone:{
    type:Number,
    required:[true,"Please Enter phone number"]
},
role:{
    type:String,
    enum:["superuser","user","admin","merchant"],
    default:"user"
},
users :[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}],

ResetPasswordToken:String,
ResetPasswordExpire:Date,
user_status:{
    type:String,
    enum:['blocked','unblocked'],
    default:'unblocked'
}
});


userSchema.pre('save',async function(next){
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
}
next();
})

userSchema.methods.matchPassword =async function(password){
    return await bcrypt.compare(password,this.password)
}


module.exports=mongoose.model('User',userSchema)