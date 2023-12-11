import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Col, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    branch: "",
    countryCode: "",
    mobile: "",
    password: "",
    gender: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",
    creditSource: "",
  });

  const countryCodes = [
    { code: "+1", name: "United States" },
    { code: "+44", name: "United Kingdom" },
    { code: "+91", name: "India" },
    { code: "+61", name: "Australia" },
    { code: "+33", name: "France" },
    { code: "+49", name: "Germany" },
    { code: "+81", name: "Japan" },
    { code: "+86", name: "China" },
    { code: "+7", name: "Russia" },
    { code: "+82", name: "South Korea" },
    { code: "+34", name: "Spain" },
    { code: "+39", name: "Italy" },
    { code: "+52", name: "Mexico" },
    { code: "+31", name: "Netherlands" },
    { code: "+64", name: "New Zealand" },
    { code: "+54", name: "Argentina" },
    { code: "+55", name: "Brazil" },
    { code: "+57", name: "Colombia" },
    { code: "+20", name: "Egypt" },
    { code: "+372", name: "Estonia" },
    { code: "+358", name: "Finland" },
    { code: "+30", name: "Greece" },
    { code: "+852", name: "Hong Kong" },
    { code: "+353", name: "Ireland" },
    { code: "+972", name: "Israel" },
    { code: "+60", name: "Malaysia" },
    { code: "+47", name: "Norway" },
    { code: "+51", name: "Peru" },
    { code: "+63", name: "Philippines" },
    { code: "+48", name: "Poland" },
    { code: "+65", name: "Singapore" },
    { code: "+46", name: "Sweden" },
    { code: "+41", name: "Switzerland" },
    { code: "+66", name: "Thailand" },
    { code: "+90", name: "Turkey" },
    { code: "+380", name: "Ukraine" },
    { code: "+598", name: "Uruguay" },
    { code: "+58", name: "Venezuela" },
    { code: "+84", name: "Vietnam" },
  ];

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/create",
        formData
      );
      // console.log("Data sent to the backend:", response.data);
      setFormData({
        firstName: "",
        lastName: "",
        businessName: "",
        email: "",
        branch: "",
        countryCode: "",
        mobile: "",
        password: "",
        gender: "",
        city: "",
        state: "",
        zipCode: "",
        address: "",
        creditSource: "",
      });
      navigate("/Dashboard"); // Redirect upon successful form submission
    } catch (error) {
      // console.error("Error sending data: ", error);
    }
  };

  return (
    <Row className="justify-content-center ">
      <Col xs={12} md={8} lg={6}>
        <Card className="p-4 mt-4">
          <h1 className="signup-heading">Sign Up</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Label>First Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Last Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Label>Business Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Gender:</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Branch:</Form.Label>
                  <Form.Select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Branch</option>
                    <option value="branch1">Branch 1</option>
                    <option value="branch2">Branch 2</option>
                    {/* Add more options as needed */}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Label>Country Code:</Form.Label>
                  <Form.Select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Country Code</option>
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} - {country.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Label>Mobile Number:</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col md={4}>
                  <Form.Label>City:</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>State:</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Zip Code:</Form.Label>
                  <Form.Control
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address:</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Credit Source:</Form.Label>
              <Form.Control
                type="text"
                name="creditSource"
                value={formData.creditSource}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Submit
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Register;
