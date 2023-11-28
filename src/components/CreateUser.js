import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Composant principal pour créer un nouvel utilisateur
export default function CreateUser() {
    // Hook pour la navigation entre les pages
    const navigate = useNavigate();
    // State pour stocker les données du formulaire
    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        mobile: '',
        entreprise_id: '',
    });

    // State pour stocker la liste des entreprises
    const [entreprises, setEntreprises] = useState([]);

    // State pour gérer les erreurs de validation du formulaire
    const [errors, setErrors] = useState({
        email: '',
        mobile: '',
    });

    // Effet qui se déclenche au chargement du composant
    useEffect(() => {
        // Récupérer la liste des entreprises lors du chargement du composant
        fetchEntreprises();
    }, []);

    // Fonction pour récupérer la liste des entreprises depuis l'API
    const fetchEntreprises = () => {
        console.log("Avant la récupération des entreprises");
        axios.get('http://localhost:80/api/enterprises')
            .then(function (response) {
                console.log("Après la récupération des entreprises", response.data);
                // Mettre à jour le state des entreprises avec les données de la réponse
                setEntreprises(response.data);
            })
            .catch(function (error) {
                console.error('Erreur lors de la récupération des entreprises :', error);
            });
    };

    // Fonction pour valider le format de l'adresse e-mail
    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction pour valider le format du numéro de mobile
    const isMobileValid = (mobile) => {
        const mobileRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        return mobileRegex.test(mobile);
    };

    // Fonction pour valider l'ensemble du formulaire
    const isFormValid = () => {
        // Vérifier la validité de l'adresse e-mail
        const emailError = isEmailValid(inputs.email) ? '' : 'Veuillez entrer une adresse e-mail valide.';
        // Vérifier la validité du numéro de mobile
        const mobileError = isMobileValid(inputs.mobile) ? '' : 'Veuillez entrer un numéro de mobile valide.';

        // Mettre à jour le state des erreurs
        setErrors({
            email: emailError,
            mobile: mobileError,
        });

        // Retourner true si tous les champs sont valides, sinon false
        return (
            inputs.name.trim() !== '' &&
            emailError === '' &&
            mobileError === '' &&
            inputs.entreprise_id.trim() !== ''
        );
    };

    // Fonction pour gérer le changement de valeur des champs du formulaire
    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(`Changement de ${name} : ${value}`);
        // Mettre à jour le state des inputs en utilisant la valeur précédente
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();

        // Valider le formulaire avant de soumettre
        if (!isFormValid()) {
            console.error('Veuillez remplir tous les champs du formulaire correctement.');
            return;
        }

        // Logique pour créer un nouvel utilisateur
        const newUser = {
            name: inputs.name,
            email: inputs.email,
            mobile: inputs.mobile,
            entreprise_id: inputs.entreprise_id,
        };

        console.log("Envoi de la requête POST pour créer un nouvel utilisateur :", newUser);

        // Envoyer la requête pour créer un nouvel utilisateur
        axios.post('http://localhost:80/api/createUser', newUser)
            .then(response => {
                navigate('/'); // Rediriger après la création réussie
            })
            .catch(error => {
                console.error('Erreur lors de la création de l\'utilisateur :', error);
            });
    };

    // Rendu du composant
    return (
        <div>
            <h1>Create User</h1>
            {/* Formulaire pour créer un nouvel utilisateur */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                        required
                    />
                    {/* Afficher le message d'erreur si l'adresse e-mail n'est pas valide */}
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="mobile">Mobile:</label>
                    <input
                        type="text"
                        name="mobile"
                        value={inputs.mobile}
                        onChange={handleChange}
                        required
                    />
                    {/* Afficher le message d'erreur si le numéro de mobile n'est pas valide */}
                    {errors.mobile && <p style={{ color: 'red' }}>{errors.mobile}</p>}
                </div>
                <div>
                    <label htmlFor="entreprise_id">Entreprise:</label>
                    {/* Menu déroulant pour sélectionner une entreprise */}
                    <select
                        name="entreprise_id"
                        value={inputs.entreprise_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select an existing enterprise</option>
                        {/* Mapper la liste des entreprises pour les afficher dans le menu déroulant */}
                        {entreprises?.map((entreprise) => (
                            <option key={entreprise.id} value={entreprise.id}>
                                {entreprise.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Bouton pour soumettre le formulaire */}
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
