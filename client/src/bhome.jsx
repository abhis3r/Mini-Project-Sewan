import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloodCenterProfile = () => {
  const [bloodStock, setBloodStock] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centerId = localStorage.getItem('centerId'); // Fetch from localStorage
        if (!centerId) {
          console.error('Center ID is missing');
          return;
        }

        const [stockRes, requestsRes] = await Promise.all([
          axios.get(`http://localhost:3001/blood-center/${centerId}/stock`),
          axios.get(`http://localhost:3001/blood-requests?centerId=${centerId}`)
        ]);
        setBloodStock(stockRes.data);
        setBloodRequests(requestsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        alert('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStock = async (group, units) => {
    try {
      const centerId = localStorage.getItem('centerId');
      if (!centerId) {
        console.error('Center ID is missing');
        return;
      }

      await axios.put(`http://localhost:3001/blood-center/${centerId}/stock`, { group, units });
      setBloodStock(bloodStock.map(item =>
        item.group === group ? { ...item, units } : item
      ));
      alert('Stock updated successfully!');
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await axios.delete(`http://localhost:3001/blood-requests/${requestId}`);
      setBloodRequests(bloodRequests.filter(request => request._id !== requestId));
      alert('Request deleted successfully!');
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Failed to delete request');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Blood Center Profile</h2>

      {/* Blood Stock Management */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>Blood Stock</h3>
        </div>
        <div className="card-body">
          {bloodStock.length === 0 ? (
            <div>No blood stock available.</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Units Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bloodStock.map((item) => (
                  <tr key={item.group}>
                    <td>{item.group}</td>
                    <td>
                      <input
                        type="number"
                        value={item.units}
                        onChange={(e) => {
                          const updatedUnits = parseInt(e.target.value) || 0;
                          setBloodStock(bloodStock.map(i =>
                            i.group === item.group ? { ...i, units: updatedUnits } : i
                          ));
                        }}
                        className="form-control"
                        min="0"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdateStock(item.group, item.units)}
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Blood Requests */}
      <div className="card">
        <div className="card-header">
          <h3>Blood Requests</h3>
        </div>
        <div className="card-body">
          {bloodRequests.length === 0 ? (
            <div>No blood requests available.</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bloodRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.requestId}</td>
                    <td>{request.bloodGroup}</td>
                    <td>{request.units}</td>
                    <td>{request.patientName}</td>
                    <td>{request.date ? new Date(request.date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteRequest(request._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
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

export default BloodCenterProfile;