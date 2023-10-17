import React, {useEffect, useState} from 'react';
import * as events from "events";
import axios  from "axios";
import {useNavigate, useParams} from "react-router-dom";

export default function ListUser() {

    const navigate= useNavigate();

    const [inputs, setInputs] = useState([])

    const {id} = useParams();

    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        axios.get(`http://localhost:80/api/user/${id}`)
            .then(function (response) {
            console.log(response.data);
            setInputs(response.data)
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const  value= event.target.value;
        setInputs(values => ({...values,[name]: value}));
    }
    const handleSubmit= (event) => {
        event.preventDefault();

        axios.post('http://localhost:80/api/', inputs).then (function (response) {
            console.log(response.data);
            navigate('/');
            // console.log(response.status);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
            // console.log(inputs)
        });
    }

    return (<div>
        <h1>Edit Users</h1>
        <form onSubmit={handleSubmit}>
            <table cellSpacing="10">
                <tbody>
                <tr>
                    <th>
                        <label htmlFor="name">Name:</label>
                    </th>
                    <td>
                        <input type="text" name="name" onChange={handleChange}/>
                    </td>
                </tr>

                <tr>
                    <th>
                        <label htmlFor="email">Email:</label>
                    </th>
                    <td>
                        <input type="text" name="email" onChange={handleChange}/>
                    </td>
                </tr>

                <tr>
                    <th>
                        <label htmlFor="mobile">Mobile:</label>
                    </th>
                    <td>
                        <input type="text" name="mobile" onChange={handleChange}/>
                    </td>
                </tr>

                <tr>
                    <td colSpan="2" align="right">
                        <button>Save</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>);
}
