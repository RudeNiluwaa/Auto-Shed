import {Router} from 'express';
import Examiner from '../models/examiner.models.js';
const router = Router();

router.route('/create').post(async (req, res) => {

    const {examinerName,  examinerId,  moduleCode,  availability} = req.body;

    const newExaminer = new Examiner({
        examinerName,
        examinerId,
        moduleCode,
        availability
    });

    await newExaminer.save().then(() => {
        res.status(200).json({message: 'Examiner created successfully'});
    }).catch(err => {
        res.status(400).json({message: err.message});
    });
});

router.route('/').get(async (req, res) => {
    await Examiner.find().then(examiners => res.json(examiners))
        .catch(err => res.status(400).json({message: err.message}));
});

router.route('/update/:id').put(async (req, res) => {

    let id = req.params.id;
    const {examinerName,  examinerId,  moduleCode,  availability} = req.body;
    
    const updateExaminer =({
        examinerName,
        examinerId,
        moduleCode,
        availability
    });


    await Examiner.findByIdAndUpdate(id, updateExaminer).then(() => {
        res.status(200).json({message: 'Examiner updated successfully'});
    }).catch(err => {
        res.status(400).json({message: err.message});
    });
    
})

router.route('/delete/:id').delete(async (req, res) => {
    let id = req.params.id;

    await Examiner.findByIdAndDelete(id).then(() => {
        res.status(200).json({message: 'Examiner deleted successfully'});
    }).catch(err => {
        res.status(400).json({message: err.message});
    });
});

router.route('/get/:id').get(async(req, res) => {

    let id = req.params.id;
    await Examiner.findById(id).then((examiner) => {
        res.status(200).json({message: 'Examiner fetched successfully', examiner});
    }).catch(err => {
        res.status(400).json({message: err.message});
    });
})
    
export default router;