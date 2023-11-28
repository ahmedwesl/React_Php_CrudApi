import React, { useState, useEffect } from 'react';
import axios    from 'axios';
import { Link } from 'react-router-dom';

// Composant principal pour afficher la liste des utilisateurs
export default function ListUser() {
    // State pour stocker la liste des utilisateurs
    const [users, setUsers]             = useState([]);
    // State pour stocker la liste des entreprises
    const [enterprises, setEnterprises] = useState([]);

    // Effet qui se déclenche au chargement du composant
    useEffect(() => {
        // Récupérer la liste des entreprises au chargement du composant
        fetchEnterprises();
        // Récupérer la liste des utilisateurs
        getUsers();
    }, []);

    // Fonction pour récupérer la liste des entreprises depuis l'API
    const fetchEnterprises = async () => {
        try {
            // Effectuer une requête pour récupérer la liste des entreprises
            const response = await axios.get('http://localhost:80/api/enterprises');
            // Mettre à jour le state des entreprises avec les données de la réponse
            setEnterprises(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des entreprises :', error);
        }
    };

    // Fonction pour récupérer la liste des utilisateurs depuis l'API
    const getUsers = async () => {
        try {
            // Effectuer une requête pour récupérer la liste des utilisateurs
            const response = await axios.get('http://localhost:80/api/usersList');

            // Mapper les utilisateurs avec les noms d'entreprise correspondants
            const usersWithEnterprise = response.data.map((user) => {
                // Ajouter le champ 'entreprise' directement à l'utilisateur
                user.entreprise = '';

                // Vérifier si entreprise_id est défini
                if (user.entreprise_id !== undefined) {
                    // Trouver l'entreprise correspondante dans la liste des entreprises
                    const enterprise = enterprises.find(ent => ent.id === user.entreprise_id);
                    if (enterprise) {
                        user.entreprise = enterprise.name;
                    }
                }

                return user;
            });

            // Mettre à jour le state des utilisateurs avec les noms d'entreprise
            setUsers(usersWithEnterprise);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
        }
    };

    // Fonction pour supprimer un utilisateur
    const deleteUser = async (id) => {
        try {
            // Effectuer une requête pour supprimer l'utilisateur
            await axios.delete(`http://localhost:80/api/users/${id}`);
            // Mettre à jour la liste des utilisateurs après la suppression
            getUsers();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
    }

    // Rendu du composant
    return (
        <div>
            <h1>List Users</h1>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Entreprise</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/* Mapper la liste des utilisateurs pour les afficher dans le tableau */}
                {users.map((user, key) =>
                    <tr key={key}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.entreprise_name}</td>
                        <td>
                            {/* Lien pour éditer l'utilisateur */}
                            <Link to={`user/edit/${user.id}`} style={{ marginRight: "10px" }}>Edit</Link>
                            {/* Bouton pour supprimer l'utilisateur */}
                            <button onClick={() => deleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
