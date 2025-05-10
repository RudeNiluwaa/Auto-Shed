import {Router} from 'express';
import Rechedule from '../models/reschedul.model.js';
const router = Router();

router.route('/add').post(async(req, res) => {

    const {userId, examinerId, module_code, current_date, req_date, current_time, req_time, current_venue, req_venue} = req.body;


  
    const newRequest = new Rechedule ({
        userId,
        examinerId,
        module_code,
        current_date,
        req_date,
        current_time,
        req_time,
        current_venue,
        req_venue
    });

    await newRequest.save().then(() => {
        res.status(200).send({status : "Reschedule a new request"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status : "Error with reschedulling"});
    })
});

router.route('/').get(async(req, res) => {
    
    await Rechedule.find().then((requests) => {
        res.json(requests);
    }).catch((err) => {
        console.log(err);
    })
});

router.route('/update/:id').put(async(req, res) => {

    let id = req.params.id;

    const {userId, examinerId, module_code, current_date, req_date, current_time, req_time, current_venue, req_venue} = req.body;

    const updateRequest = ({
        userId,
        examinerId,
        module_code,
        current_date,
        req_date,
        current_time,
        req_time,
        current_venue,
        req_venue
    });

     await Rechedule.findByIdAndUpdate(id, updateRequest).then(() => {
        res.status(200).send({status : "Request update successfully"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status : "Error with updating"});
    })
});

router.route('/delete/:id').delete(async (req, res) => {

    let id = req.params.id;

   await Rechedule.findByIdAndDelete(id).then(() => {
        res.status(200).send({status : "Request deleted successfully"});
    });
});

router.route('/get/:id').get(async (req, res) => {

    let id = req.params.id;

    const request = await Rechedule.findById(id).then((fetch) => {
        res.status(200).send({status : "Request fetched successfully", fetch})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status : "Error with fetching the request"});
    });
})

export default router;
