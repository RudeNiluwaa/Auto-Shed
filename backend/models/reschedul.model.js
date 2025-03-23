import mongoose from "mongoose";

const rescedulSchema = new mongoose.Schema({

    userId : {
        type : String,
        required : true,
        unique : true
    },

    examinerId : {
        type : String,
        required : true,
        unique : true
    },

    module_code : {
        type : String,
        required : true,
        unique : true
    },

    current_date : {
        type : String,
        required : true,
        
    },

    req_date : {
        type : String,
        required : true,
        
    },

    current_time : {
        type : String,
        required : true,
        
    },

    req_time : {
        type : String,
        required : true,
        
    },

    current_venue : {
        type : String,
        required : true,
        
    },

    req_venue : {
        type : String,
        required : true,
        
    }
}, {timestamps : true});

const Rechedule = mongoose.model('rechedule', rescedulSchema);
export default Rechedule;