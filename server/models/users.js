const mongoose=require('mongoose');


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    district: { type: String, required: true },
    taluk: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    weight: { type: Number, required: true },
    lastDonation: Date,
    availability: { type: String, required: true },
    nextAvailableDate: Date
}, { timestamps: true});

const UserModel = mongoose.model("miniproject",UserSchema)
module.exports=UserModel;