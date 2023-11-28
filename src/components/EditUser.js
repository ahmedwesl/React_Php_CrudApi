import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        mobile: '',
        selectedEnterprises: '', // Initially an empty string
    });

    const [enterprises, setEnterprises] = useState([]);

    useEffect(() => {
        // Récupérer les détails de l'utilisateur
        axios.get(`http://localhost:80/api/users/${id}`).then(function (response) {
            console.log(response.data);
            setUser(response.data); // Fix: Change setInputs to setUser
        });

        // Récupérer la liste des entreprises
        axios.get('http://localhost:80/api/enterprises').then(function (response) {
            setEnterprises(response.data);
        });
    }, [id]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleEnterpriseChange = (event) => {
        // La sélection d'entreprise est une liste, donc nous devons gérer les ajouts et suppressions
        const { value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            selectedEnterprises: String(value), // Convert value to string
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.put(`http://localhost:80/api/users/${id}`, user).then(function (response) {
            console.log(response.data);
            navigate('/');
        });
    };

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" name="email" value={user.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="mobile">Mobile:</label>
                    <input type="text" name="mobile" value={user.mobile} onChange={handleChange} required />
                </div>
                <div>
                    <label>Enterprises:</label>
                    <select
                        name="selectedEnterprises"
                        value={user.selectedEnterprises}
                        onChange={handleEnterpriseChange}
                        required
                    >
                        <option value="">Select an existing enterprise</option>
                        {enterprises.map((enterprise) => (
                            <option key={enterprise.id} value={enterprise.id}>
                                {enterprise.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
