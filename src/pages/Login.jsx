import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// // console.log("Api URL:", API_BASE_URL);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/all-login`, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Internal Server Error");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card
        style={{ width: "600px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Row>
          {/* Left Section */}
          <Col md={6} style={{ padding: "0", overflow: "hidden" }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#c2004d",
                fontWeight: "bold",
                fontSize: "2rem",
                borderTopLeftRadius: "10px", // Round the top left corner
                borderBottomLeftRadius: "10px", // Round the bottom left corner
              }}
            >
            <img src={`${process.env.PUBLIC_URL}/banner_Logo.png`} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%" }} />
            </div>
          </Col>

          {/* Right Section */}
          <Col md={6}>
            <Card.Body>
              <h2 className="text-center mb-4"></h2>
              <Form onSubmit={handleLogin}>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" block>
                  Login
                </Button>
              </Form>
              {message && <p>{message}</p>}
              {/* <div>
                <Link to="/register">Register</Link>
              </div>
              <div>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div> */}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;
