import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Unauthorized from "../components/Unauthorized";

const ProtectedRoute = () => 
  useSelector((state) => state.auth.userInfo) ? <Outlet /> : <Unauthorized />;

export default ProtectedRoute;
