import React, { useState } from "react";
import { Collapse, ListGroup, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Barras.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useFindMenuQuery } from "../services/menu.service";
import { useSelector } from 'react-redux'; 

function limpiarTexto(subItem) {
  let textoCrudo = "";

  if (subItem?._) {
    textoCrudo = subItem._;
  } else if (subItem?.$?.TEXT) {
    textoCrudo = subItem.$.TEXT;
  }

  const limpio = textoCrudo
    .replace(/<[^>]*>/g, "")              // elimina etiquetas HTML
    .replace(/\"/g, "")                   // elimina comillas
    .replace(/img=[^>\s]+/g, "")          // elimina img=fa...
    .replace(/fa-[\w-]+>?/g, "")          // elimina fa-inbox>, fa-archive>
    .replace(/bi-[\w-]+>?/g, "")          // elimina bi-folder>, etc.
    .trim();

  return limpio;
}

const BarraLateral = ({ home, userInfo, handleShow }) => {
  const [openModules, setOpenModules] = useState({});
  const { data: menu, isLoading, isError } = useFindMenuQuery(userInfo?.user);
  console.log("usuario:", userInfo?.user);
  console.log(menu);

  const toggleModule = (id) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  

  return (
    <Nav defaultActiveKey="/home" className="flex-column sidebar">
      <ListGroup variant="flush">
        {/* Inicio */}
        <Nav.Link
          as={Link}
          to={home.url}
          onClick={() => handleShow()}
          className="list-group-item list-group-item-action sidebar-link"
        >
          <i className="bi bi-house-door" /> {home.title}
        </Nav.Link>

        {/* Módulos dinámicos */}
{["A", "X"].includes(userInfo.userType) && (
  <>
    {isError && <div className="px-3 text-danger">Error al cargar el menú.</div>}

    {(menu?.menu?.item || [])?.map((modulo, idx) => (
      <Nav.Item key={modulo.$.ID || idx}>
        <Nav.Link
          onClick={() => toggleModule(modulo.$.ID)}
          className="list-group-item list-group-item-action sidebar-link d-flex align-items-center justify-content-between"
        >
          <div>
            <i className={`bi ${modulo.$.IMG || "bi-folder"} me-2`} />
            {limpiarTexto(modulo)}
          </div>
          <i className={`bi bi-chevron-down ${openModules[modulo.$.ID] ? "rotate" : ""}`} />
        </Nav.Link>

        <Collapse in={openModules[modulo.$.ID]}>
          <ListGroup>
            <div className="d-flex flex-column gap-1">
              {(Array.isArray(modulo.item) ? modulo.item : [modulo.item])?.map((subItem, subIdx) => (
                <Nav.Link
                  key={subItem.$?.ID || subIdx}
                  as={Link}
                  to={"archivo/obraspublicas"}
                  onClick={() => handleShow()}
                  className="list-group-item list-group-item-action sidebar-sublink ms-3 me-3 my-1 p-1 fs-7"
                  style={{ transition: "transform 0.3s ease-in-out", fontSize: "14px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <span className="me-2" style={{ width: "0.8em", display: "inline-block" }}>
  {subItem.$?.IMG && <i className={`bi ${subItem.$.IMG}`} />}
</span>

                  {limpiarTexto(subItem)}
                </Nav.Link>
              ))}
            </div>
          </ListGroup>
        </Collapse>
      </Nav.Item>
    ))}
  </>
)}

      </ListGroup>
    </Nav>
  );
};

export default BarraLateral;
