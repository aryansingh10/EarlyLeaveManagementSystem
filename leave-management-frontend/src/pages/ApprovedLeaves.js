import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

function ApprovedLeaves() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovedLeaves = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/leave/approved-leaves', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLeaves(response.data);
                setLoading(false);
                console.log('Approved leaves:', response.data);
            } catch (error) {
                console.error('Error fetching approved leaves');
            }
        };
        fetchApprovedLeaves();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-6">Approved Leaves</h1>
            {loading ? (
                <div className="text-center text-lg">Loading approved leaves...</div>
            ) : leaves.length === 0 ? (
                <div className="text-center text-lg">No approved leaves found.</div>
            ) : (
                <ul className="space-y-4">
                    {leaves.map((leave) => (
                        <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{leave.reason}</h2>
                                    <p className="text-gray-600">
                                        Student: <span className="font-semibold">{leave.studentId?.name}</span> 
                                        <span className="text-gray-500"> ({leave.studentId?.enrollmentNumber})</span>
                                    </p>
                                    <p className="text-gray-600">
                                        From: {new Date(leave.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} 
                                        To: {new Date(leave.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-green-500 font-bold">{leave.finalStatus}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ApprovedLeaves;