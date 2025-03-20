import mongoose from 'mongoose';

const examinerSchema = new mongoose.Schema({

examinerName :
 {
   type: String,
   required: true
 },

 examinerId : {

    type: String,
    required: true,
    unique: true
 },

 moduleCode :{
    type: String,
    required: true,
    unique: true
 },

 availability : {
    type: String,
    required: true
 }

});

const Examiner = mongoose.model('examiner', examinerSchema);

export default Examiner;