import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "../components/dashboard";
import LogIn from "../components/LogIn";
import UserAccounts from "../components/UserAccounts";
import AdminDashboard from "./Dashboard";
import Seller from "../components/seller";
import ReportDashboard from "../components/reportDashboard";
export default function Pages(){
return(
    <Router>
        <Routes>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/accounts" element={<UserAccounts />}></Route>
            <Route path="/AdminDashboard" element={<AdminDashboard />}></Route>
            <Route path="/" element={<LogIn />}></Route>
            <Route path="/seller" element={<Seller />}></Route>
            <Route path="/reports" element={<ReportDashboard />}></Route>
        </Routes>
    </Router>
)
}