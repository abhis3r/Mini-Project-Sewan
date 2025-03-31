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

const CentreSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},{collection:"bloodcentre"});

const BloodCentreSchema = new mongoose.Schema({
    centerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    district: { type: String, required: true },
    taluk: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    centerType: { type: String, required: true, enum: ['Government', 'Private', 'Charity'] },
    isApproved: { type: Boolean, default: false },
    bloodStock: [{
      group: { type: String, required: true },
      units: { type: Number, default: 0 }
    }]
  }, { timestamps: true },{collection:"bloodcentreprofile"});

  // Pre-save hook to initialize blood stock
BloodCentreSchema.pre('save', function(next) {
    if (this.isNew) {
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      this.bloodStock = bloodGroups.map(group => ({ group, units: 0 }));
    }
    next();
  });





const CentreModel= mongoose.model("bloodcentre",CentreSchema)
const UserModel = mongoose.model("miniproject",UserSchema)
const BloodCentreModel = mongoose.model("bloodcentreprofile",BloodCentreSchema);


module.exports = { UserModel, CentreModel,BloodCentreModel}; // Export both models as an object

