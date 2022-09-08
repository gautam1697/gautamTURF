const Booking = require('../models/booking.Model')
const User = require('../models/user.Model')
const Turf = require('../models/turf.Model')
const Playground = require('../models/playground.Model')
const { default: mongoose } = require('mongoose')





exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" })
        }
        res.status(200).json({ success: true, booking })

    } catch (error) {

    }
}
exports.cancelBooking = async (req, res) => {
    try {
    const{booking_id,booking_status}=req.body;
    let booking= await Booking.findOne({booking_id})
        // console.log(booking)
        let id=booking.playground_id.toString();
        // console.log(id)
        let playground=await Playground.findById(id)
        // console.log(playground)
        for(a of playground.slot){
            if(a.booking_id.toString()==req.body.booking_id.toString()){
                // console.log(a,"a object",b,"string",a.booking,"a.booking")
                c=playground.slot.indexOf(a)
                console.log(a,"a")
                console.log(c,"c")
                playground.slot.splice(c,1)
                await playground.save()
                console.log(playground.slot)
                booking.booking_status=false;
                await booking.save()
                res.status(200).json({ success: true, booking })
            }
        }
        return res.status(400).json({success:false,message:"cannot find id"})
       

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }

}

 
exports.createBooking=async(req,res)=>{
    try {
        // const currentTime = new Date();
        const { user_id, turfname, createdat, playground_id, location,
            booking_cost, booking_status, payment_status,st,et} = req.body;
            //if playground.slot is empty
          let turf =await Turf.findOne({turfname})

          const startTime = new Date(req.body.st);
          const endTime = new Date(req.body.et)
          let turfsTime=new Date(turf.hoursopen.ot)
          let turfeTime=new Date(turf.hoursopen.ct)
    

          const cond11 =  startTime.getTime()>turfsTime.getTime() && startTime.getTime()<turfeTime.getTime();

          const cond22 =  endTime.getTime()>turfsTime.getTime() && endTime.getTime()<turfeTime.getTime();
          if (cond11 && cond22) {
       

        booking = await Booking.findOne().where(req.body.st).where(req.body.et);
        //console.log(booking)
        let playground = await Playground.findById(playground_id);
        console.log(playground)
    
        if (playground.slot == 0) {
            console.log('hello')
            let booking = await Booking.create({
                user_id, turfname, createdat, playground_id, location,
                booking_cost, booking_status, payment_status, st, et
            })
            obj = { st: req.body.st, et: req.body.et,booking_id:booking._id}
            playground.slot.push(obj)
            await playground.save()
            return res.status(200).json({ success: true, booking });
        }

        //if playground.slot is not empty
        let flag=0;
        if (playground.slot != 0) {
            //console.log('hello1')
            for (a of playground.slot){
                console.log('hello not empty')
            //    console.log( a.st );
            const start=new Date(a.st)
            const end= new Date(a.et)

        
                if (start.getTime() == startTime.getTime() || endTime.getTime() == end.getTime()) {
                    return res.status(400).json({ success: false, message: 'already exists' })
                }
              
                const cond1 =  startTime.getTime()< start.getTime() && endTime.getTime() < start.getTime();
                const cond2 = startTime.getTime()>end.getTime()&& endTime.getTime()>end.getTime();
                if (cond1 || cond2){
                
                    flag=1;
                
                }else{
                    flag=0;
                    break;
                }
            }}

if(flag==1){
    console.log('found condition to create booking');

    let booking = await Booking.create({
        user_id, turfname, createdat, playground_id, location,
        booking_cost, booking_status, payment_status, st, et
    })
    obj = { st: req.body.st, et: req.body.et,booking_id:booking._id}
    playground.slot.push(obj)
    await playground.save()
    return res.status(200).json({ success: true, booking })

}
else{
return res.status(400).json({ success: false, message: "cannot create booking"});}
       }
    return res.status(400).json({success:false,
        message:"cannot create booking.exceeds turf opening/closing time."})
 } 
    catch (error) {
        return res.status(500).json({success:false,message:error.message})
        
    }
}






exports.updateBooking=async(req,res)=>{
    try {
        const{booking_id,new_st,new_et}=req.body;
        let booking=await Booking.findById(booking_id)
        // console.log(booking)
        id=booking.playground_id
        i=id.toString()
        let playground=await Playground.findById(i)


        // console.log(playground)
        a=playground.turf_id
        b11=a.toString()
        let turf=await Turf.findById(b11)
        // console.log(turf)
//program to removed booking from existing playground

        const nst= new Date(req.body.new_st)
        const net=new Date(req.body.new_et)
        let turfsTime=new Date(turf.hoursopen.ot)
        let turfeTime=new Date(turf.hoursopen.ct)
        cond11= nst.getTime()>turfsTime.getTime()&&nst<turfeTime.getTime();
        cond22=net.getTime()>turfsTime.getTime()&&net.getTime()<turfeTime.getTime();
        flag=0;
        if(cond11&&cond22){

        for(a of turf.playgrounds){
            b=a.toString()
            // console.log(b)
            let found_playground = 0;
            // console.log(b)
            let playground=await Playground.findById(b)
            for(a of playground.slot){
                if(playground.slot==0){
                    console.log('came into this condition.')
                    user_id=booking.user_id;                
                    booking_status=booking.booking_status;
                    location=booking.location;
                    payment_status=booking.payment_status;
                    booking_status=booking.booking_status;
                    playground_id=playground._id;
                    turfname=booking.turfname;
                    st=nst;
                    et=net;
                    await Booking.create
                    ({user_id,location,payment_status,playground_id,turfname,st,et,booking_status})
                    booking.booking_status=false;
                    await booking.save()
                    let booking=await Booking.findOne().where(nst).where(net)
                    console.log(booking)
                    id=booking._id
                    obj={st:nst,et:net,booking_id:id}
                    console.log(obj)
                    playground.push(obj)
                await playground.save()
            return res.status(200).json({success:true,message:"Successfully updated booking",booking}) 
                       }false
                if(playground.slot!=0){
                let dbst=new Date(a.st)
                let dbet=new Date(a.et)
                cond1=nst.getTime()<dbst.getTime()&&net.getTime()<dbst.getTime();
                cond2=nst.getTime()>dbet.getTime()&&net.getTime()>dbet.getTime();
                console.log(cond1||cond2)
                // console.log(dbst.getTime()==nst.getTime(),'checking before if statement')
                
                if(nst.getTime()==dbst.getTime()||net.getTime()==dbet.getTime()){
                    console.log('found same time')
                    flag=0;
                }
                if(cond1||cond2){
                    flag=1;


                }
            }
            }
            if(flag==1){
                found_p=b;
                // console.log(found_playground)
            }
            
        }
        console.log(flag)
if(flag==1){
            console.log('came into this condition 2 to update booking.')
                let booking=await Booking.findById(booking_id);
                // console.log(booking)
                let playground=await Playground.findById(found_p)
                // console.log(playground)
                
                 user_id=booking.user_id;                  
                 booking_status=booking.booking_status;
                 location=booking.location;
                 payment_status=booking.payment_status;
                 booking_status=booking.booking_status;
                  playground_id=playground._id
                //  console.log(playground._id)
                 turfname=booking.turfname;
                 st=nst;
                 et=net;
                await Booking.create({user_id,location,payment_status,playground_id,turfname,st,et,booking_status})
                booking.booking_status=false;
                await booking.save()
                booking=await Booking.findOne({st:new_st,et:new_et,booking_status:true})
                // console.log(booking)
                let id=booking._id
                //  console.log(id)
                 obj={st:nst,et:net,booking_id:id}
                //  console.log(obj,'this will console object')
                //  console.log("before",playground.slot)
                playground.slot.push(obj)
                 await playground.save()
                //  console.log("after",playground.slot)
                 playground=await Playground.findById(i)
                for(a of playground.slot){
                    if(req.body.booking_id==a.booking_id.toString()){
                        console.log("if condition working");
                 var rmid=playground.slot.indexOf(a)
                 console.log(rmid)
                playground.slot.splice(rmid,1)
                 await playground.save()}
                }
        return res.status(200).json({success:true,message:"Successfully updated booking",booking})
        }
        return res.status(400).json({success:false,message:"Time slot is occupied by other user."})}
        return res.status(400).json({success:false,
            message:"cannot create booking beyond or before turf time."})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
        
    }
    }