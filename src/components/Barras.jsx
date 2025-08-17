import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import BarraSuperior from "./BarraSuperior";
import BarraLateral from "./BarraLateral";
import { Button, Container, Offcanvas } from "react-bootstrap";
import "./Barras.css";

const Barras = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const home = {
    title: "Inicio",
    url: "",
  };

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleShow = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  let vlogout = "/";

  const Salir = () => {
    dispatch(logout());
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/`;
    navigate(vlogout);
  };

  if (!userInfo) {
    Salir();
  }

  switch (userInfo.userType) {
    case "X":
    case "A":
    case "B":
    case "C":
      home.url = "home";
      break;
    default:
      home.url = "home";
      break;
  }

  return (
    <>
      <BarraSuperior toggleDrawer={toggleDrawer} home={home} Salir={Salir} />

      <Offcanvas style={{ width: "260px" }} show={open} onHide={handleShow}>
        <Offcanvas.Header closeButton={false}>
          <Button
            variant="link"
            onClick={handleShow}
            style={{ marginLeft: "auto" }}
          >
            <i className="bi bi-arrow-left"></i>
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <BarraLateral
            home={home}
            userInfo={userInfo}
            handleShow={handleShow}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <Container className="marginNavTop">
        <Outlet />
      </Container>
    </>
  );
};

export default Barras;
