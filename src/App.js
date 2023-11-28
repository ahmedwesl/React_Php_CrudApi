import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ListUser from "./components/ListUser";
import CreateUser from "./components/CreateUser";
import EditUser from "./components/EditUser";

function App() {
    return (
        <div className="App">
            <h5>React CRUD operations using Php Api and Mysql</h5>
            <BrowserRouter>
                <nav>
                    <ul>
                        <li>
                            <Link to="user/create">Create User</Link>
                        </li>
                        <li>
                            <Link to="/">List Users </Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route index element={<ListUser />} />
                    <Route path="user/create" element={<CreateUser />} />
                    <Route path="user/edit/:id" element={<EditUser />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
