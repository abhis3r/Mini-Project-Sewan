import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DonorProfile = () => {
  const [donationRequests, setDonationRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorId = localStorage.getItem('donorId'); // Fetch donor ID from localStorage
        if (!donorId) {
          console.error('Donor ID is missing');
          return;
        }

        const [requestsRes, historyRes] = await Promise.all([
          axios.get(`http://localhost:3001/donor-requests/${donorId}`), // Fixed: Wrapped in backticks
          axios.get(`http://localhost:3001/donations/${donorId}`) // Fixed: Wrapped in backticks
        ]);
        setDonationRequests(requestsRes.data);
        setDonationHistory(historyRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        alert('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequestResponse = async (requestId, response) => {
    try {
      await axios.put(`http://localhost:3001/donor-requests/${requestId}`, { // Fixed: Wrapped in backticks
        status: response
      });
      setDonationRequests(donationRequests.map(req =>
        req._id === requestId ? { ...req, status: response } : req
      ));
      alert(`Request ${response} successfully!`); // Fixed: Proper string interpolation
    } catch (err) {
      console.error('Error updating request:', err);
      alert('Failed to update request');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Donor Profile</h2>

      {/* Donation Requests */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>Donation Requests</h3>
        </div>
        <div className="card-body">
          {donationRequests.length === 0 ? (
            <div>No donation requests available.</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Blood Center</th>
                  <th>Blood Group</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donationRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.requestId}</td>
                    <td>{request.bloodCenterId?.centerName || 'N/A'}</td> {/* Optional chaining */}
                    <td>{request.bloodGroup}</td>
                    <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        request.status === 'pending' ? 'bg-warning' :
                        request.status === 'accepted' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleRequestResponse(request._id, 'accepted')}
                            className="btn btn-success btn-sm me-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestResponse(request._id, 'declined')}
                            className="btn btn-danger btn-sm"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Donation History */}
      <div className="card">
        <div className="card-header">
          <h3>Donation History</h3>
        </div>
        <div className="card-body">
          {donationHistory.length === 0 ? (
            <div>No donation history available.</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Donation ID</th>
                  <th>Blood Center</th>
                  <th>Date</th>
                  <th>Blood Group</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.donationId}</td>
                    <td>{donation.bloodCenterId?.centerName || 'N/A'}</td> {/* Optional chaining */}
                    <td>{new Date(donation.donationDate).toLocaleDateString()}</td>
                    <td>{donation.bloodGroup}</td>
                    <td>
                      {donation.certificateUrl ? (
                        <a
                          href={donation.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-muted">Not available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;