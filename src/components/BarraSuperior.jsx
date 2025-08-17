import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../img/logo1.png";

const BarraSuperior = ({ home, toggleDrawer, Salir }) => {
  return (
    <Navbar
      expand="lg"
      className="fixed-top"
      style={{
        backgroundColor: "#d1ebf7",
      }}
    >
      <Container fluid>
        <Nav.Link as={Link} to={home.url}>
          <Nav className="ml-auto">
            <img src={Logo} height={"40px"} alt="Scriptum Lite" />
          </Nav>
        </Nav.Link>
        <Nav className="me-auto">
          <Button
            variant="info"
            onClick={toggleDrawer}
            className="toggle-button"
          >
            <i className="icon-bigger bi bi-list" />
          </Button>
        </Nav>

        <Button
          variant="info"
          onClick={() => Salir()}
          style={{ color: "Black" }}
        >
          <i className="bi bi-box-arrow-right" />
          Salir
        </Button>
      </Container>
    </Navbar>
  );
};

export default BarraSuperior;
