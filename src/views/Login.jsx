import { useEffect } from "react";
import { Container, Card, Form, Button, InputGroup } from "react-bootstrap";
import { userLogin } from "../actions/authActions";
import Logo from "../img/logo.png";
import Logo2 from "../img/Imagen1.png";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Error from "../components/Error";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import SpinnerLogin from "../components/SpinnerLogin";


const Login = () => {
  const backgroundStyle = {
    backgroundImage: `url(${Logo2})`,
  };
  const { loading, userInfo, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  //redirige usuarios autenticados a la página de inicio
  useEffect(() => {
    if (userInfo && userInfo.userType === "A") {
      navigate("/home");
    } else if (userInfo && userInfo.userType === "X") {
      navigate("/home");
    } else if (userInfo && userInfo.userType === "C") {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const submitForm = (data) => {
    dispatch(userLogin(data));
  };

  return (
    <main>
      <div style={backgroundStyle} className="fondo">
        <Container>
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <Card className="mb-3">
                    <Card.Body>
                      <div className="pt-4 pb-2">
                        <div className="d-flex justify-content-center py-4">
                          <div className="logo d-flex align-items-center w-auto">
                            <img
                              src={Logo}
                              height={"150px"}
                              alt="Scriptum Lite"
                            />
                          </div>
                        </div>
                      </div>

                      {error ? <Error message={error} /> : null}
                      <Form
                        className="row g-3 needs-validation"
                        noValidate
                        onSubmit={handleSubmit(submitForm)}
                      >
                        <Form.Group className="mb-2" controlId="user">
                          <Form.Label className="form-label">
                            Usuario
                          </Form.Label>
                          <InputGroup className="mb-2">
                            <InputGroup.Text id="user-addon">
                              <i className="bi bi-person-fill"></i>
                            </InputGroup.Text>

                            <Form.Control
                              placeholder="Usuario"
                              aria-label="Usuario"
                              aria-describedby="user-addon"
                              name="user"
                              {...register("user")}
                              className="form-control"
                              required
                            />
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="password">
                          <Form.Label className="form-label">
                            Contraseña
                          </Form.Label>
                          <InputGroup className="mb-2">
                            <InputGroup.Text id="user-addon">
                              <i className="bi bi-lock-fill"></i>
                            </InputGroup.Text>
                            <Form.Control
                              type="password"
                              name="password"
                              aria-label="Contraseña"
                              placeholder="Contraseña"
                              {...register("password")}
                              aria-describedby="password-addon"
                              required
                              autoComplete="on"
                            />
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-2">
                          <Button
                            className="w-100"
                            variant="primary"
                            type="submit"
                          >
                            {loading ? <SpinnerLogin /> : "INICIAR SESIÓN"}
                          </Button>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </main>
  );
};

export default Login;
