const Turf=require('../models/turf.Model')
const User=require('../models/user.Model')
const Playground=require('../models/playground.Model')

exports.registerTurf=async(req,res)=>{
    try {
        const{turfname,owner,hoursopen,managers,booking_price,turf_status}=req.body;
        let turf= await Turf.findOne({turfname})
        if(!turf){
           const turf=await Turf.create({turfname,owner,hoursopen,managers,booking_price,turf_status});

            return res.status(200).json({success:true,message:`Successfully registerd turf:${turfname}`,turf})
        }
        return res.status(401).json({success:false,message:'turf already exists'})
        
    } catch (error) {
return res.status(500).json({success:false,message:error.message})
    }
}
exports.updateTurfOwner= async(req,res)=>{
    try{
    const turf=await Turf.findOneAndUpdate(req.params.id,{$set:req.body},{new:true})
    return res.status(200).json({success:true,turf})

}
catch(error){
    return res.status(500).json({success:false,message:error.message})
}
}
exports.updateTurfAdmin=async(req,res)=>{
    try{
        const{playgrounds,bookings,availabledates}=req.body;
    const turf=await Turf.findOne(req.params._id)
    const user=await User.findById(req.body.id)
        if(req.body.includes(user)){
            user.username=req.body.user.username;
            user.email=req.body.user.email;
            user.firstname=req.body.user.firstname;
            user.lastname=req.body.user.lastname;
            user.phone=req.body.user.phone;
            await user.save()

        }
        if(bookings){
            Turf.bookings=req.bookings
            await bookings.save()
        }
        if(playgrounds){
            turf.playground=req.play
            await playground.save()
        }
        if(availabledates){
            turf.availabledates=req.availabledates
            await availabledates.save()
        }
        return res.status(200).json({success:true,turf})
    
    //return res.status(404).json({success:false,message:"turf not found"})

}
catch(error){
    return res.status(500).json({success:false,message:error.message})
}
}
exports.removeTurf=async(req,res)=>{
    try {
        const{status}=req.body;
        const turf= await Turf.findByIdAndUpdate(req.params.id,{$set:{'turf_status':req.body.turf_status}},{new:true})
console.log(turf)
        if(!turf){

            return res.status(404).json({success:false,message:"Turf not found"})
        }
        return res.status(200).json({success:true,message:"Turf removed successfully",turf})
    } catch (error) {
        return res.status(500).json({success:false,message:error.json})        
    }
}
exports.createPlayground=async(req,res)=>{
    try {
        const{turfname,turf_id,playground_name,playground_status,slot,managers}=req.body;
        const turf=await Turf.findOne({turfname})
        let playground=await Playground.findOne({playground_name})
        if(playground){
            return res.status(401).json({success:false,message:"playground already exists"})
        }
         playground=await Playground.create({turf_id,playground_name,playground_status,slot,managers})
        turf.playgrounds.push(playground._id)
        await turf.save()
        res.status(200).json({success:true,message:"successfully created playground",playground})
        
    } catch (error) {
        
        return res.status(500).json({success:false,message:error.message})
    }
}

exports.updatePlayground=async(req,res)=>{
    try {
        const playground=await Playground.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        return res.status(200).json({success:true,playground});

    }
        
    catch (error) {
        return res.status(500).json({success:false,message:error.message})
        
    }}
    exports.cancelPlayground=async(req,res)=>{
        try {
             const playground= await Playground.findByIdAndUpdate(req.params.id,{$set:{'playground_status':req.body.playground_status}})
            return res.status(200).send({success:true,
                data:playground})
        } catch (error) {
            return res.status(500).json({success:false,message:error.message})
        }
    }
