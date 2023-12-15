import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Nav,
  Tab,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AccountOverview from "./view/AccountOverview";
import Details from "./view/Details";
import Loans from "./view/Loans";
import Transactions from "./view/Transactions";

const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const Members = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    memberNo: 0,
    fullName: "",
    email: "",
    branchName: "",
    photo: null,
    fatherName: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    currentAddress: "",
    permanentAddress: "",
    whatsAppNo: "",
    idProof: null,
    nomineeName: "",
    relationship: "",
    nomineeMobileNo: "",
    nomineeDateOfBirth: "",
    walletId: 0,
    numberOfShares: 0,
  });
  const [updateData, setUpdateData] = useState({
    id: "",
    memberNo: 0,
    fullName: "",
    email: "",
    branchName: "",
    photo: null,
    fatherName: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    currentAddress: "",
    permanentAddress: "",
    whatsAppNo: "",
    idProof: null,
    nomineeName: "",
    relationship: "",
    nomineeMobileNo: "",
    nomineeDateOfBirth: "",
    walletId: 0,
    numberOfShares: 0,
  });

  const [membersData, setMembersData] = useState([]);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [uniquememberid, setuniquememberid] = useState(0);
  const [branchNames, setBranchNames] = useState([]);
  const [uniqueaccountid, setuniqueaccountid] = useState(0);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [walletId, setWalletId] = useState(0);
  const [numberOfShares, setNumberOfShares] = useState(0);
  const [amount, setAmount] = useState(0);
  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMemberData, setViewMemberData] = useState(0);

  const handleOpenViewModal = (id) => {
    console.log(id);
    const selectedMember = membersData.find((member) => member._id === id);
    setViewMemberData(selectedMember);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewMemberData(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "photo" || name === "idProof") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setAccountFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  
      if (name === "walletId") {
        setWalletId(value);
      }
    }
  };
    
  const handleSharesChange = (e) => {
    const shares = e.target.value;
    setNumberOfShares(shares);
    setAmount(shares * 160); // Assuming each share costs 160
    formData.numberOfShares = shares;
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;

    // Convert the member number to a number type before setting the state
    if (name === "memberNo") {
      setUpdateData({
        ...updateData,
        [name]: parseInt(value, 10), // Parse the input value to an integer
      });
    } else {
      setUpdateData({
        ...updateData,
        [name]: value,
      });
    }
  };
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    memberNo: 0,
    memberName: "",
    email: "",
    branchName: "",
    photo: null,
    accountNumber: "",
    accountType: "",
    openingBalance: 0,
    currentBalance: 0,
    fatherName: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    currentAddress: "",
    permanentAddress: "",
    whatsAppNo: "",
    idProof: null,
    nomineeName: "",
    relationship: "",
    nomineeMobileNo: "",
    nomineeDateOfBirth: "",
  });

  const handleOpenAccountModal = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getMember/${id}`);
      const memberData = response.data; // Assuming response.data contains the member data
      fetchData();
      // Verify the value retrieved for openingBalance from memberData
      // console.log("Opening Balance Retrieved:", memberData);
      setAccountFormData({
        memberNo: memberData.memberNo,
        memberName: memberData.fullName,
        email: memberData.email,
        branchName: memberData.branchName,
        accountNumber: uniqueaccountid, // Use the generated unique account number here
        accountType: "", // Initialize with an empty string or default value
        openingBalance: 0, // Initialize with an empty string or default value
        photo: memberData.photo,
        fatherName: memberData.fatherName,
        gender: memberData.gender,
        maritalStatus: memberData.maritalStatus,
        dateOfBirth: memberData.dateOfBirth,
        currentAddress: memberData.currentAddress,
        permanentAddress: memberData.permanentAddress,
        whatsAppNo: memberData.whatsAppNo,
        idProof: memberData.idProof,
        nomineeName: memberData.nomineeName,
        relationship: memberData.relationship,
        nomineeMobileNo: memberData.nomineeMobileNo,
        nomineeDateOfBirth: memberData.nomineeDateOfBirth,
      });

      setShowAccountModal(true);
    } catch (error) {
      // console.error("Error fetching member data:", error);
      // Handle the error condition, show an error message, or perform other actions
    }
  };

  const handleCloseAccountModal = () => {
    setShowAccountModal(false);
    // Additional logic to reset account form data
    setAccountFormData((prevAccountFormData) => ({
      ...prevAccountFormData,
      memberNo: 0,
      fullName: "",
      email: "",
      branchName: "",
      photo: null,
      accountNo: "",
      accountType: "",
      openingBalance: 0,
      currentBalance: 0,
      fatherName: "",
      gender: "",
      maritalStatus: "",
      dateOfBirth: "",
      currentAddress: "",
      permanentAddress: "",
      whatsAppNo: "",
      idProof: null,
      nomineeName: "",
      relationship: "",
      nomineeMobileNo: "",
      nomineeDateOfBirth: "",
    }));
  };

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithCurrentBalance = {
        ...accountFormData,
        currentBalance: accountFormData.openingBalance, // Assigning openingBalance to currentBalance
      };

      const response = await axios.post(
        `${API_BASE_URL}/accounts-exp`,
        formDataWithCurrentBalance
      );
      // Handle the response or perform any necessary actions upon successful submission
      // console.log("Account submitted successfully:", response.data);
      handleCloseAccountModal();
    } catch (error) {
      // Handle errors if the request fails
      // console.error("Error submitting account:", error);
    }
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: imageFile,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleOpenEditModal = async (id) => {
    // console.log(id);
    try {
      const response = await axios.get(`${API_BASE_URL}/getmember/${id}`);
      const memberData = response.data; // Assuming response.data contains the member data

      console.log(memberData);

      setUpdateData({
        id: memberData._id,
        memberNo: memberData.memberNo,
        fullName: memberData.fullName,
        email: memberData.email,
        branchName: memberData.branchName,
        photo: memberData.photo,
        fatherName: memberData.fatherName,
        gender: memberData.gender,
        maritalStatus: memberData.maritalStatus,
        dateOfBirth: memberData.dateOfBirth,
        currentAddress: memberData.currentAddress,
        permanentAddress: memberData.permanentAddress,
        whatsAppNo: memberData.whatsAppNo,
        idProof: memberData.idProof,
        nomineeName: memberData.nomineeName,
        relationship: memberData.relationship,
        nomineeMobileNo: memberData.nomineeMobileNo,
        nomineeDateOfBirth: memberData.nomineeDateOfBirth,
      });

      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      // Handle error or display an error message to the user
      console.error("Error fetching member data:", error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMemberIndex(null);
  };

  const fetchData = async () => {
    try {
      const branchNamesResponse = await axios.get(
        `${API_BASE_URL}/branches/names`
      );
      setBranchNames(branchNamesResponse.data.data);

      const membersResponse = await axios.get(`${API_BASE_URL}/readmembers`);
      const { data } = membersResponse.data;

      if (Array.isArray(data)) {
        setMembersData(data);
      } else if (typeof data === "object") {
        const dataArray = [data];
        setMembersData(dataArray);
      } else {
        // console.error('Invalid format for members data:', data);
      }
      const uniquememberresponse = await axios.get(
        `${API_BASE_URL}/randomgenMemberId`
      );
      setuniquememberid(uniquememberresponse.data.uniqueid);
      const uniqueaccountresponse = await axios.get(
        `${API_BASE_URL}/randomgenAccountId`
      );
      setuniqueaccountid(uniqueaccountresponse.data.uniqueid);
      const uniquewalletresponse = await axios.get(
        `${API_BASE_URL}/randomgenWalletId`
      );
      setWalletId(uniquewalletresponse.data.uniqueWalletId);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(walletId);
      const formDataWithImages = new FormData();
      formDataWithImages.append("images", formData.photo);
      formDataWithImages.append("images", formData.idProof);
      console.log(formDataWithImages);

      const responseUpload = await axios.post(
        `${API_BASE_URL}/uploadmultiple`,
        formDataWithImages,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrls = {
        imageUrl1: responseUpload.data.urls[0], // Adjust index based on your response structure
        imageUrl2: responseUpload.data.urls[1], // Adjust index based on your response structure
      };
      await axios.post(`${API_BASE_URL}/createmember`, {
        ...formData,
        memberNo: parseInt(formData.memberNo, 10),
        photo: imageUrls.imageUrl1,
        idProof: imageUrls.imageUrl2,
        walletId: walletId,
        memberNo: uniquememberid,
      });

      setFormData({
        memberNo: 0,
        fullName: "",
        email: "",
        branchName: "",
        photo: null,
        fatherName: "",
        gender: "",
        maritalStatus: "",
        dateOfBirth: "",
        currentAddress: "",
        permanentAddress: "",
        whatsAppNo: "",
        idProof: null,
        nomineeName: "",
        relationship: "",
        nomineeMobileNo: "",
        nomineeDateOfBirth: "",
        walletId: 0,
        numberofShares: 0,
      });

      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataWithImages = new FormData();
      formDataWithImages.append("images", formData.photo);
      formDataWithImages.append("images", formData.idProof);
      console.log(formDataWithImages);

      const responseUpload = await axios.post(
        `${API_BASE_URL}/uploadmultiple`,
        formDataWithImages,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrls = {
        imageUrl1: responseUpload.data.urls[0], // Adjust index based on your response structure
        imageUrl2: responseUpload.data.urls[1], // Adjust index based on your response structure
      };

      await axios.put(`${API_BASE_URL}/updatemember/${updateData.id}`, {
        ...updateData,
        photo: imageUrls.imageUrl1,
        idProof: imageUrls.imageUrl2,
      });

      handleCloseEditModal();
      fetchData();
    } catch (error) {
      // Handle error
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = axios.post(`${API_BASE_URL}/deletemember/${id}`);
      // console.log(response);
      // alert('Delete Success');
      fetchData();
    } catch (error) {
      // console.log('Failed Delete');
      // alert('Delete Failed');
    }
  };

  return (
    <div className="body-div">
      <Button onClick={handleModalShow}>Add New Member</Button>

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Member Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formMemberNo">
                  <Form.Label>Member Number</Form.Label>
                  <Form.Control
                    type="number"
                    name="memberNo"
                    value={uniquememberid}
                    placeholder=""
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formFatherName">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Personal Information */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formBranch">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    as="select"
                  >
                    <option value="">Select Branch</option>
                    {branchNames.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>{" "}
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPhoto">
                  <Form.Label>Photo (Browse file)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Full Name and Father Name */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formfullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    placeholder="Enter full name"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formFatherName">
                  <Form.Label>Father Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    placeholder="Enter father's name"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Gender and Marital Status */}
            <Row className="mb-3">
              <Form.Group as={Row} controlId="formGender">
                <Col md={9}>
                  <div className="d-flex md:space-x-10">
                    <Form.Check
                      type="radio"
                      label="Male"
                      name="gender"
                      id="genderMale"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="gender"
                      id="genderFemale"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Others"
                      name="gender"
                      id="genderOthers"
                      value="Others"
                      checked={formData.gender === "Others"}
                      onChange={handleInputChange}
                    />
                  </div>
                </Col>
              </Form.Group>
            </Row>

            {/* Marital Status and Date of Birth */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formMaritalStatus">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                  >
                    <option>Select Marital Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Current Address and Permanent Address */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Current Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formPermanentAddress">
                  <Form.Label>Permanent Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* WhatsApp Number and ID Proof */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formWhatsappNo">
                  <Form.Label>WhatsApp No.</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter WhatsApp number"
                    name="whatsAppNo"
                    value={formData.whatsAppNo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formIdProof">
                  <Form.Label>
                    ID Proof (Aadhar, Passport, Electricity Bill)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="idProof"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="formWalletId">
                  <Form.Label>Wallet ID</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    name="walletId"
                    value={walletId}
                    onChange={handleInputChange}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="formNumberOfShares">
                  <Form.Label>No. of Shares</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter number of shares"
                    name="numberOfShares"
                    value={numberOfShares}
                    onChange={handleSharesChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={amount}
                    readOnly // This field is read-only
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* HR Section */}
            <hr />

            {/* Nominee Details */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeName">
                  <Form.Label>Nominee Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter nominee name"
                    name="nomineeName"
                    value={formData.nomineeName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formRelationship">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeMobile">
                  <Form.Label>Nominee Mobile No.</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter nominee mobile number"
                    name="nomineeMobileNo"
                    value={formData.nomineeMobileNo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formNomineeDOB">
                  <Form.Label>Nominee Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="nomineeDateOfBirth"
                    value={formData.nomineeDateOfBirth}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
          <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formMemberNo">
                  <Form.Label>Member Number</Form.Label>
                  <Form.Control
                    type="number"
                    name="memberNo"
                    value={updateData.memberNo}
                    placeholder=""
                    onChange={handleUpdateChange}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formFatherName">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={updateData.email}
                    placeholder="Enter email"
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Personal Information */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formBranch">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control
                    type="text"
                    name="branchName"
                    value={updateData.branchName}
                    onChange={handleUpdateChange}
                    as="select"
                  >
                    <option value="">Select Branch</option>
                    {branchNames.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>{" "}
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPhoto">
                  <Form.Label>Photo (Browse file)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Full Name and Father Name */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formfullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={updateData.fullName}
                    placeholder="Enter full name"
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formFatherName">
                  <Form.Label>Father Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fatherName"
                    value={updateData.fatherName}
                    placeholder="Enter father's name"
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Gender and Marital Status */}
            <Row className="mb-3">
              <Form.Group as={Row} controlId="formGender">
                <Col md={9}>
                  <div className="d-flex md:space-x-10">
                    <Form.Check
                      type="radio"
                      label="Male"
                      name="gender"
                      id="genderMale"
                      value="Male"
                      checked={updateData.gender === "Male"}
                      onChange={handleUpdateChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="gender"
                      id="genderFemale"
                      value="Female"
                      checked={updateData.gender === "Female"}
                      onChange={handleUpdateChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Others"
                      name="gender"
                      id="genderOthers"
                      value="Others"
                      checked={updateData.gender === "Others"}
                      onChange={handleUpdateChange}
                    />
                  </div>
                </Col>
              </Form.Group>
            </Row>

            {/* Marital Status and Date of Birth */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formMaritalStatus">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="maritalStatus"
                    value={updateData.maritalStatus}
                    onChange={handleUpdateChange}
                  >
                    <option>Select Marital Status</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={updateData.dateOfBirth}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Current Address and Permanent Address */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Current Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="currentAddress"
                    value={updateData.currentAddress}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formPermanentAddress">
                  <Form.Label>Permanent Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="permanentAddress"
                    value={updateData.permanentAddress}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* WhatsApp Number and ID Proof */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formWhatsappNo">
                  <Form.Label>WhatsApp No.</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter WhatsApp number"
                    name="whatsAppNo"
                    value={updateData.whatsAppNo}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formIdProof">
                  <Form.Label>
                    ID Proof (Aadhar, Passport, Electricity Bill)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="idProof"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* HR Section */}
            <hr />

            {/* Nominee Details */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeName">
                  <Form.Label>Nominee Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter nominee name"
                    name="nomineeName"
                    value={updateData.nomineeName}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formRelationship">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter relationship"
                    name="relationship"
                    value={updateData.relationship}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNomineeMobile">
                  <Form.Label>Nominee Mobile No.</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter nominee mobile number"
                    name="nomineeMobileNo"
                    value={updateData.nomineeMobileNo}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formNomineeDOB">
                  <Form.Label>Nominee Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="nomineeDateOfBirth"
                    value={updateData.nomineeDateOfBirth}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Button variant="primary" type="submit">
              Edit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showViewModal}
        onHide={handleCloseViewModal}
        size="lg"
        centered
        dialogClassName="w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2"
      >
        <Modal.Header closeButton className="bg-cyan-800 text-white">
          <Modal.Title className="text-xl font-semibold">
            View Member Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Tab.Container defaultActiveKey="details">
            <Nav variant="tabs" className="mb-6">
              <Nav.Item>
                <Nav.Link eventKey="details">Member Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="overview">Account Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="transactions">Transactions</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="loans">Loans</Nav.Link>
              </Nav.Item>
              {/* Add more Nav.Item components as needed */}
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="details">
              <Details id={viewMemberData._id} memberData={viewMemberData} />
              </Tab.Pane>
              <Tab.Pane eventKey="overview">
                <AccountOverview id={viewMemberData._id} memberData={viewMemberData}/>
              </Tab.Pane>
              <Tab.Pane eventKey="transactions">
                <Transactions id={viewMemberData._id} memberData={viewMemberData}/>
              </Tab.Pane>
              <Tab.Pane eventKey="loans">
                <Loans id={viewMemberData._id} memberData={viewMemberData}/>
              </Tab.Pane>
              {/* Add more Tab.Pane components as needed */}
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>

      <Modal show={showAccountModal} onHide={handleCloseAccountModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAccountSubmit}>
            {/* Account No Dropdown */}
            <Form.Group controlId="formAccountNo">
              <Form.Label>Account No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                name="accountNo"
                value={uniqueaccountid}
                onChange={handleAccountInputChange}
              />
            </Form.Group>

            {/* Account Type Dropdown */}
            <Form.Group controlId="formAccountType">
              <Form.Label>Account Type</Form.Label>
              <Form.Select
                name="accountType"
                value={accountFormData.accountType}
                onChange={handleAccountInputChange}
              >
                <option value="">Select an account type</option>
                <option value="Savings">Savings</option>
                <option value="Loan">Loan</option>
              </Form.Select>
            </Form.Group>

            {/* Opening Balance Fields */}
            <Form.Group controlId="formOpeningBalance">
              <Form.Label>Opening Balance</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter opening balance"
                name="openingBalance"
                value={accountFormData.openingBalance}
                onChange={handleAccountInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Account
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table
        responsive
        striped
        bordered
        hover
        className="mt-4 rounded-lg overflow-hidden "
      >
        <thead>
          <tr>
            <th>Profile Pic</th>
            <th>Name</th>
            <th>branchName</th>
            <th>Email</th>
            <th>Nominee</th>
            <th>WhatsApp</th>
            <th>ID Proof</th>
            {/* <th>Account Type</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {membersData.map((member) => (
            <tr key={member._id}>
              <td>
                {" "}
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt="Profile"
                    width="40"
                    height="40"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{member.fullName}</td>
              <td>{member.branchName}</td>
              <td>{member.email}</td>
              <td>{member.nomineeName}</td>
              <td>{member.whatsAppNo}</td>
              <td>
                {" "}
                {member.image ? (
                  <img
                    src={member.idProof}
                    alt="Profile"
                    width="40"
                    height="40"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              {/* <td>{member.accountType}</td> */}
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="info" id="dropdown-basic">
                    Actions
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleOpenEditModal(member._id)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(member._id)}>
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleOpenViewModal(member._id)}
                    >
                      View
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleOpenAccountModal(member._id)}
                    >
                      Create Account
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default Members;
