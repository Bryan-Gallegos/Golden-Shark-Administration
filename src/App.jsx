import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import UserList from "./components/UserRoles/UserList/UserList";
import ViewUser from "./components/UserRoles/ViewUser/ViewUser";
import AddRole from "./components/UserRoles/AddRole/AddRole";
import RemoveRole from "./components/UserRoles/RemoveRole/RemoveRole";
import Login from "./components/Login/Login";
import Layout from "./components/Layout/Layout";
import ListRole from "./components/Roles/ListRole/ListRole";
import ViewRole from "./components/Roles/ViewRole/ViewRole";
/*    No se pone porque no se pueden editar roles
import EditRole from "./components/Roles/EditRole/EditRole"; */
import RemoveRol from "./components/Roles/RemoveRole/RemoveRole";
import CreateRole from "./components/Roles/CreateRole/CreateRole";
import Users from "./components/Users/Users";
import UsersView from "./components/Users/ViewUser/ViewUser";
import UsersEdit from "./components/Users/EditUser/EditUser";
import UsersCreate from "./components/Users/CreateUser/CreateUser";
import UsersDelete from "./components/Users/DeleteUser/DeleteUser";

function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem("loggedIn");
    return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>

            <Routes>
                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Layout con menú lateral */}
                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    {/* PÁGINA PRINCIPAL */}
                                    <Route path="/" element={<Home />} />
                                    {/* USUARIOS Y ROLES */}
                                    <Route path="/userRoles" element={<UserList />} />
                                    <Route path="/userRoles/view/id/:id" element={<ViewUser />} />
                                    <Route path="/userRoles/add_role/id/:id" element={<AddRole />} />
                                    <Route path="/userRoles/remove_role/id/:id" element={<RemoveRole />} />
                                    {/* ROLES */}
                                    <Route path ="/roles" element={<ListRole />} />
                                    <Route path ="/roles/view/:key" element ={<ViewRole />} />
                                    <Route path="/roles/remove/:key" element={<RemoveRol />}/>
                                    <Route path="/roles/create" element={<CreateRole />}/>
                                    {/* USUARIOS */}
                                    <Route path ="/users" element={<Users />}/>
                                    <Route path="/users/view/id/:id" element={<UsersView />}/>
                                    <Route path="/users/edit/id/:id" element={<UsersEdit />}/>
                                    <Route path="/users/create" element={< UsersCreate/>}/>
                                    <Route path="/users/delete/id/:id" element={<UsersDelete />}/>
                                </Routes>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
