import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const districts = {
    "Thiruvananthapuram": [
      "Chirayinkeezhu", "Nedumangad", "Neyyattinkara", "Thiruvananthapuram"
    ],
    "Kollam": [
      "Karunagapally", "Kollam", "Kunnathur", "Kottarakkara", "Pathanapuram"
    ],
    "Pathanamthitta": [
      "Adoor", "Kozhencherry", "Mallappally", "Ranni", "Thiruvalla"
    ],
    "Alappuzha": [
      "Ambalapuzha", "Chengannur", "Cherthal", "Kaarthikapally", "Kuttanad", "Mavelikkara"
    ],
    "Kottayam": [
      "Changanassery", "Kanjirappally", "Kottayam", "Meenachil", "Vaikom"
    ],
    "Idukki": [
      "Devikulam", "Peerumedu", "Thodupuzha", "Udumpanchola"
    ],
    "Ernakulam": [
      "Aluva", "Kanayannur", "Kochi", "Kothamangalam", "Kunnathunaad", "Moovattupuzha", "Paravur"
    ],
    "Thrissur": [
      "Chavakkad", "Kodungallur", "Mukundapuram", "Thalappilly", "Thrissur"
    ],
    "Palakkad": [
      "Alathoor", "Chittoor", "Mannarkkaad", "Ottappaalam", "Palakkad"
    ],
    "Malappuram": [
      "Eranad", "Thirur", "Nilamboor", "Perinthalmanna", "Ponnani", "Thiroorangadi"
    ],
    "Kozhikode": [
      "Kozhikode", "Koyilandy", "Vadakara"
    ],
    "Wayanad": [
      "Manathavady", "Sulthan Bathery", "Vythiri"
    ],
    "Kannur": [
      "Kannur", "Taliparampu", "Thalasserry"
    ],
    "Kasaragod": [
      "Hosdurg", "Kasargode"
    ]
  };

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        dob: '',
        whatsapp: '',
        email: '',
        password: '',
        district: '',
        taluk: '',
        bloodGroup: '',
        weight: '',
        lastDonation: '',
        availability: '',
        nextAvailableDate: ''
    });
    const [taluks, setTaluks] = useState([]);
    const [error, setError] = useState('');
    const [ageError, setAgeError] = useState('');

    const validatePassword = (password) => {
        const regex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
        return regex.test(password);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setFormData(prev => ({ ...prev, password: newPassword }));
        setError(validatePassword(newPassword) ? '' : 'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 special character, 1 number, and be at least 8 characters long.');
    };

    const handleDistrictChange = (e) => {
        const district = e.target.value;
        setFormData(prev => ({ ...prev, district, taluk: '' }));
        setTaluks(districts[district] || []);
    };

    const validateAge = (dob) => {
        const birthDate = new Date(dob);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const month = new Date().getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
            return age - 1;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const age = validateAge(formData.dob);
        if (age < 18) {
            setAgeError('You must be 18 years or older to register.');
            return;
        }
        setAgeError('');

        try {
            const response = await axios.post('http://localhost:3001/register', formData);
            alert('Registration Successful!');
            // Reset form
            setFormData({
                name: '',
                gender: '',
                dob: '',
                whatsapp: '',
                email: '',
                password: '',
                district: '',
                taluk: '',
                bloodGroup: '',
                weight: '',
                lastDonation: '',
                availability: '',
                nextAvailableDate: ''
            });
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-75">
                <h2>Donor Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label><strong>Full Name</strong></label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Gender</strong></label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Date of Birth</strong></label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="form-control" required />
                            {ageError && <div className="text-danger">{ageError}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>WhatsApp Number</strong></label>
                            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Email</strong></label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Password</strong></label>
                            <input type="password" name="password" value={formData.password} onChange={handlePasswordChange} className="form-control" required />
                            {error && <div className="text-danger">{error}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>District</strong></label>
                            <select name="district" value={formData.district} onChange={handleDistrictChange} className="form-control" required>
                                <option value="">Select District</option>
                                {Object.keys(districts).map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Taluk</strong></label>
                            <select name="taluk" value={formData.taluk} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select Taluk</option>
                                {taluks.map(taluk => (
                                    <option key={taluk} value={taluk}>{taluk}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Blood Group</strong></label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select</option>
                                <option value="AB+ve">AB+ve</option>
                                <option value="AB-ve">AB-ve</option>
                                <option value="A+ve">A+ve</option>
                                <option value="A-ve">A-ve</option>
                                <option value="B+ve">B+ve</option>
                                <option value="B-ve">B-ve</option>
                                <option value="O+ve">O+ve</option>
                                <option value="O-ve">O-ve</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Weight (kg)</strong></label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Last Donation Date</strong></label>
                            <input type="date" name="lastDonation" value={formData.lastDonation} onChange={handleInputChange} className="form-control" />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label><strong>Availability</strong></label>
                            <select name="availability" value={formData.availability} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        {formData.availability === 'No' && (
                            <div className="col-md-6 mb-3">
                                <label><strong>Next Available Date</strong></label>
                                <input type="date" name="nextAvailableDate" value={formData.nextAvailableDate} onChange={handleInputChange} className="form-control" required={formData.availability === 'No'} />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
                <p className="mt-3">Already have an account?</p>
                <Link to='/login' className="btn btn-default border w-100 bg-light text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Signup;