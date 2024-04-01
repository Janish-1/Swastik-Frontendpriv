import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import {
  Modal,
  Button,
  Form,
  Table,
  Nav,
  Tab,
  Row,
  Col,
  CloseButton,
} from "react-bootstrap";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import AccountOverview from "./view/AccountOverview";
import Details from "./view/Details";
import Loans from "./view/Loans";
import Transactions from "./view/Transactions";
import Print from "./view/Print";
import SignatureCanvas from "react-signature-canvas";

const API_BASE_URL = process.env.REACT_APP_API_URL;
// // console.log("Api URL:", API_BASE_URL);

const Members = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    memberNo: "",
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
    signature: null,
  });
  const [updateData, setUpdateData] = useState({
    id: "",
    memberNo: "",
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
    signature: null,
  });

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    memberNo: "",
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


  const [membersData, setMembersData] = useState([]);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [uniquememberid, setuniquememberid] = useState("");
  const [branchNames, setBranchNames] = useState([]);
  const [uniqueaccountid, setuniqueaccountid] = useState(0);
  const handleCloseModal = () => setShowModal(false);
  const [walletId, setWalletId] = useState(0);
  const [numberOfShares, setNumberOfShares] = useState(0);
  const [amount, setAmount] = useState(0);
  const [userType, setusertype] = useState("");
  const handleModalClose = () => setShowModal(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMemberData, setViewMemberData] = useState(0);
  const [branchnamedata, setbranchnamedata] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenViewModal = (id) => {
    fetchData();
    const selectedMember = membersData.find((member) => member._id === id);
    setViewMemberData(selectedMember);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewMemberData(true);
  };

  const handleModalShow = () => {
    // Call fetchData function here
    fetchData();

    // Set the state to show the modal
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "whatsAppNo" || name === "nomineeMobileNo") {
      // Ensure that only numeric characters are allowed
      const numericValue = value.replace(/\D/g, "");

      // Limit the value to 10 characters
      const limitedValue = numericValue.slice(0, 10);

      // Update the state
      setFormData((prevData) => ({
        ...prevData,
        [name]: limitedValue,
      }));
    } else if (name === "photo" || name === "idProof") {
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
    if (name === "whatsAppNo" || name === "nomineeMobileNo") {
      // Ensure that only numeric characters are allowed
      const numericValue = value.replace(/\D/g, "");

      // Limit the value to 10 characters
      const limitedValue = numericValue.slice(0, 10);

      // Update the state
      setUpdateData((prevData) => ({
        ...prevData,
        [name]: limitedValue,
      }));
    } else if (name === "memberNo") {
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

  const handleOpenAccountModal = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getMember/${id}`);
      const memberData = response.data; // Assuming response.data contains the member data
      fetchData();

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
      // // console.error("Error fetching member data:", error);
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
      signature: null,
    }));
  };

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    // // console.log(id);
    try {
      const response = await axios.get(`${API_BASE_URL}/getmember/${id}`);
      const memberData = response.data; // Assuming response.data contains the member data

      // console.log(memberData);

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
        dateOfBirth: memberData.dateOfBirth
          ? moment(memberData.dateOfBirth).format("YYYY-MM-DD")
          : "",
        currentAddress: memberData.currentAddress,
        permanentAddress: memberData.permanentAddress,
        whatsAppNo: memberData.whatsAppNo,
        idProof: memberData.idProof,
        nomineeName: memberData.nomineeName,
        relationship: memberData.relationship,
        nomineeMobileNo: memberData.nomineeMobileNo,
        nomineeDateOfBirth: memberData.nomineeDateOfBirth
          ? moment(memberData.nomineeDateOfBirth).format("YYYY-MM-DD")
          : "",
        walletId: memberData.walletId,
        numberofShares: memberData.numberOfShares,
      });

      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      // Handle error or display an error message to the user
      // console.error("Error fetching member data:", error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMemberIndex(null);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const tokenParts = token.split(".");
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payload = JSON.parse(decodedPayload);
        const userRole = payload.role; // Assuming 'role' contains the user's role
        const branch = payload.branch;
        setusertype(userRole);
        setbranchnamedata(branch);
      }

      if (userType === "manager" || userType === "agent") {
        const userBranchName = branchnamedata; // Assuming 'branchName' contains the branch name
        console.log(userBranchName);
        if (userBranchName) {
          // Set the branch name to branchNames array
          formData.append("branchName", userBranchName);
        }
      }

      if (userType === "admin") {
        const branchNamesResponse = await axios.get(
          `${API_BASE_URL}/branches/names`
        );
        setBranchNames(branchNamesResponse.data.data);
      }

      const membersResponse = await axios.get(`${API_BASE_URL}/readmembers`);
      const { data } = membersResponse.data;

      if (Array.isArray(data)) {
        setMembersData(data);
      } else if (typeof data === "object" && data !== null) {
        const dataArray = [data];
        setMembersData(dataArray);
      } else {
        // Handle the case when data is neither an array nor an object
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
      // Handle the error in a meaningful way (e.g., logging or displaying an error message)
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function renderDropdownForUserType(memberId) {
    switch (userType) {
      case "admin":
        return (
          <Dropdown drop="end">
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleOpenEditModal(memberId)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(memberId)}>
                Delete
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenViewModal(memberId)}>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenAccountModal(memberId)}>
                Create Account
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      case "manager":
        return (
          <Dropdown drop="end">
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleOpenEditModal(memberId)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(memberId)}>
                Delete
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenViewModal(memberId)}>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenAccountModal(memberId)}>
                Create Account
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      case "agent":
        return (
          <Dropdown drop="end">
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleOpenViewModal(memberId)}>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenAccountModal(memberId)}>
                Create Account
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      default:
        return null; // If userType doesn't match any case, don't render the Dropdown
    }
  }

  const signatureRef = useRef();

  const handleClear = () => {
    signatureRef.current.clear();
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation checks
      const missingFields = [];
      if (!accountFormData.memberNo) missingFields.push("Member Number");
      if (!accountFormData.memberName) missingFields.push("Member Name");
      if (!accountFormData.email) missingFields.push("Email");
      if (!accountFormData.branchName) missingFields.push("Branch Name");
      if (!accountFormData.photo) missingFields.push("Photo");
      if (!accountFormData.accountNumber) missingFields.push("Account Number");
      if (!accountFormData.accountType) missingFields.push("Account Type");
      if (!accountFormData.fatherName) missingFields.push("Father's Name");
      if (!accountFormData.gender) missingFields.push("Gender");
      if (!accountFormData.maritalStatus) missingFields.push("Marital Status");
      if (!accountFormData.dateOfBirth) missingFields.push("Date of Birth");
      if (!accountFormData.currentAddress) missingFields.push("Current Address");
      if (!accountFormData.permanentAddress) missingFields.push("Permanent Address");
      if (!accountFormData.whatsAppNo) missingFields.push("WhatsApp Number");
      if (!accountFormData.idProof) missingFields.push("ID Proof");
      if (!accountFormData.nomineeName) missingFields.push("Nominee Name");
      if (!accountFormData.relationship) missingFields.push("Relationship with Nominee");
      if (!accountFormData.nomineeMobileNo) missingFields.push("Nominee Mobile Number");
      if (!accountFormData.nomineeDateOfBirth) missingFields.push("Nominee Date of Birth");

      if (missingFields.length > 0) {
        const missingFieldsMessage = "Please fill in the following fields: " + missingFields.join(", ");
        window.alert(missingFieldsMessage);
        return;
      }

      const formDataWithCurrentBalance = {
        ...accountFormData,
        currentBalance: accountFormData.openingBalance, // Assigning openingBalance to currentBalance
      };

      const response = await axios.post(
        `${API_BASE_URL}/accounts-exp`,
        formDataWithCurrentBalance
      );
      // Handle the response or perform any necessary actions upon successful submission
      // // console.log("Account submitted successfully:", response.data);
      window.alert("Successfully Created Account");
      handleCloseAccountModal();
    } catch (error) {
      // Handle errors if the request fails
      console.error("Error submitting account:", error);

      window.alert("Account Creating Failed. Try Again");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImages = new FormData();
    formDataWithImages.append("images", formData.photo);
    formDataWithImages.append("images", formData.idProof);

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
      imageUrl1: responseUpload.data.urls[0],
      imageUrl2: responseUpload.data.urls[1],
    };

    // Validation checks
    const missingFields = [];
    if (!uniquememberid) missingFields.push("Member Number");
    if (!formData.fullName) missingFields.push("Full Name");
    if (!formData.email) missingFields.push("Email");
    if (!formData.fatherName) missingFields.push("Father's Name");
    if (!formData.gender) missingFields.push("Gender");
    if (!formData.maritalStatus) missingFields.push("Marital Status");
    if (!formData.dateOfBirth) missingFields.push("Date of Birth");
    if (!formData.currentAddress) missingFields.push("Current Address");
    if (!formData.permanentAddress) missingFields.push("Permanent Address");
    if (!formData.whatsAppNo) missingFields.push("WhatsApp Number");
    if (!formData.nomineeName) missingFields.push("Nominee Name");
    if (!formData.relationship) missingFields.push("Relationship with Nominee");
    if (!formData.nomineeMobileNo) missingFields.push("Nominee Mobile Number");
    if (!formData.nomineeDateOfBirth) missingFields.push("Nominee Date of Birth");
    if (!walletId) missingFields.push("Wallet ID");
    if (!formData.numberOfShares) missingFields.push("Number of Shares");
    if (!formData.signature) missingFields.push("Signature");

    if (missingFields.length > 0) {
      const missingFieldsMessage = "Please fill in the following fields: " + missingFields.join(", ");
      window.alert(missingFieldsMessage);
      return;
    }

    // Date of birth validation
    const formattedDateOfBirth = moment(formData.dateOfBirth, "YYYY-MM-DD", true);
    if (!formattedDateOfBirth.isValid()) {
      window.alert("Please enter a valid date of birth.");
      return;
    }

    // Nominee date of birth validation
    const formattedNomineeDateOfBirth = moment(
      formData.nomineeDateOfBirth,
      "YYYY-MM-DD",
      true
    );

    if (!formattedNomineeDateOfBirth.isValid()) {
      window.alert("Please enter a valid nominee date of birth.");
      return;
    }

    // Create member
    try {
      const requestData = {
        ...formData,
        photo: imageUrls.imageUrl1,
        idProof: imageUrls.imageUrl2,
        walletId: walletId,
        dateOfBirth: formattedDateOfBirth.format("YYYY-MM-DD"),
        nomineeDateOfBirth: formattedNomineeDateOfBirth.format("YYYY-MM-DD"),
        memberNo: uniquememberid,
      };

      if (userType === "admin") {
        await axios.post(`${API_BASE_URL}/createmember`, requestData);
      } else {
        requestData.branchName = branchnamedata;
        await axios.post(`${API_BASE_URL}/createmember`, requestData);
      }

      // Show success alert for create
      window.alert("Member successfully created");

      setFormData({
        memberNo: "",
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
        signature: null,
      });

      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to create member. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let photoUrl = "";
      let idProofUrl = "";

      // Check if photo file is present
      if (formData.photo) {
        const photoFormData = new FormData();
        photoFormData.append("imageone", formData.photo);
        const responsePhoto = await axios.post(
          `${API_BASE_URL}/uploadimage`,
          photoFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        photoUrl = responsePhoto.data.url;
      }

      // Check if idProof file is present
      if (formData.idProof) {
        const idProofFormData = new FormData();
        idProofFormData.append("imageone", formData.idProof);

        const responseIdProof = await axios.post(
          `${API_BASE_URL}/uploadimage`,
          idProofFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        idProofUrl = responseIdProof.data.url;
      }

      // Validate and format the date of birth
      const formattedDateOfBirth = moment(updateData.dateOfBirth, "YYYY-MM-DD", true);
      const formattednomineedateofbirth = moment(updateData.nomineeDateOfBirth, "YYYY-MM-DD", true);

      // Validation checks
      const missingFields = [];
      if (!updateData.memberNo) missingFields.push("Member Number");
      if (!updateData.fullName) missingFields.push("Full Name");
      if (!updateData.email) missingFields.push("Email");
      if (!updateData.branchName) missingFields.push("Branch Name");
      if (!updateData.photo) missingFields.push("Photo");
      if (!updateData.fatherName) missingFields.push("Father's Name");
      if (!updateData.gender) missingFields.push("Gender");
      if (!updateData.maritalStatus) missingFields.push("Marital Status");
      if (!updateData.dateOfBirth) missingFields.push("Date of Birth");
      if (!updateData.currentAddress) missingFields.push("Current Address");
      if (!updateData.permanentAddress) missingFields.push("Permanent Address");
      if (!updateData.whatsAppNo) missingFields.push("WhatsApp Number");
      if (!updateData.idProof) missingFields.push("ID Proof");
      if (!updateData.nomineeName) missingFields.push("Nominee Name");
      if (!updateData.relationship) missingFields.push("Relationship with Nominee");
      if (!updateData.nomineeMobileNo) missingFields.push("Nominee Mobile Number");
      if (!updateData.nomineeDateOfBirth) missingFields.push("Nominee Date of Birth");
      if (!updateData.walletId) missingFields.push("Wallet ID");

      if (missingFields.length > 0) {
        const missingFieldsMessage = "Please fill in the following fields: " + missingFields.join(", ");
        window.alert(missingFieldsMessage);
        return;
      }

      // Date of birth validation
      if (!formattedDateOfBirth.isValid()) {
        window.alert("Please enter a valid date of birth.");
        return;
      }

      // Nominee date of birth validation
      if (!formattednomineedateofbirth.isValid()) {
        window.alert("Please enter a valid nominee date of birth.");
        return;
      }

      // Prepare the updated member data with image URLs
      const updatedData = {
        ...updateData,
        photo: photoUrl,
        idProof: idProofUrl,
        dateOfBirth: formattedDateOfBirth.format("YYYY-MM-DD"),
        nomineeDateOfBirth: formattednomineedateofbirth.format("YYYY-MM-DD"),
      };

      // Send the updated member data to the backend for updating
      const responseUpdate = await axios.put(
        `${API_BASE_URL}/updatemember/${updateData.id}`,
        updatedData
      );
      // Show success alert for update
      window.alert("Member successfully updated");

      handleCloseEditModal();
      fetchData();
    } catch (error) {
      // Handle error
      console.error("Error:", error);

      // Show error alert for update
      window.alert("Failed to update member. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Ask for confirmation
      const confirmed = window.confirm(
        "Are you sure you want to delete this member?"
      );

      if (confirmed) {
        const response = await axios.post(`${API_BASE_URL}/deletemember/${id}`);

        // Show success alert for delete
        window.alert("Member successfully deleted");

        fetchData();
      } else {
        // User canceled the deletion
        window.alert("Deletion canceled");
      }
    } catch (error) {
      // Handle error
      console.error("Failed to delete member:", error);

      // Show error alert for delete
      window.alert("Failed to delete member. Please try again.");
    }
  };

  const handleSave = async () => {
    const signatureCanvas = signatureRef.current; // Assuming signatureRef is a reference to a canvas element

    try {
      // Set loading to true to indicate the upload process has started
      setLoading(true);

      // Get the base64 representation of the canvas content
      const imageData = signatureCanvas.toDataURL("image/png");

      const response = await axios.post(
        `${API_BASE_URL}/uploadsignature`,
        { imageData }, // Sending the base64 data in the 'imageData' field
        {
          headers: {
            "Content-Type": "application/json", // Use 'application/json' for JSON data
          },
        }
      );

      const signatureImageUrl = response.data.url;

      // Assuming you have a field named `signatureUrl` in your state object
      // Update the state with the signature image URL
      setFormData({
        ...formData,
        signature: signatureImageUrl,
      });

      // Perform any additional actions here if needed

      // Clear loading state once the process is complete
      setLoading(false);
    } catch (error) {
      // Handle error if the image upload fails
      console.error("Error uploading signature:", error);

      // Clear loading state in case of error
      setLoading(false);
    }
  };

  return (
    <div className="body-div">
      <Button onClick={handleModalShow}>Add New Membership</Button>

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Membership Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formMemberNo">
                  <Form.Label>Membership</Form.Label>
                  <Form.Control
                    type="text"
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
                  {userType === "admin" ? (
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
                  ) : (
                    <Form.Control
                      type="text"
                      name="branchName"
                      value={branchnamedata} // Use the variable set for the manager's branch
                      onChange={handleInputChange}
                      readOnly // Make the input read-only for managers
                    />
                  )}
                </Form.Group>
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
              {/* <Form.Group as={Row} controlId="formAgent">
                <Form.Label column md={3}>
                  Agent:
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    as="select"
                    name="agent"
                    value={formData.agent}
                    onChange={handleInputChange}
                  >
                    <option value="">Select an agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.name}>
                        {agent.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group> */}
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
                    type="integer"
                    placeholder="Enter WhatsApp number"
                    name="whatsAppNo"
                    value={formData.whatsAppNo}
                    onChange={handleInputChange}
                    minLength={10}
                    maxLength={10}
                  />
                  {formData.whatsAppNo && formData.whatsAppNo.length !== 10 && (
                    <Form.Text className="text-danger">
                      Phone number must be 10 digits.
                    </Form.Text>
                  )}
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
                    type="integer"
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
                    type="integer"
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
                    maxLength={10}
                    minLength={10}
                  />
                  {formData.nomineeMobileNo &&
                    formData.nomineeMobileNo.length !== 10 && (
                      <Form.Text className="text-danger">
                        Phone number must be 10 digits.
                      </Form.Text>
                    )}
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
            <Form.Label>Signature: </Form.Label>
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "signature-canvas",
              }}
            />
            {loading && <p>Loading...</p>}
            <div>
              <Button onClick={handleClear}>Clear</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
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
                    type="text"
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
                  {userType === "admin" ? (
                    <Form.Control
                      type="text"
                      name="branchName"
                      value={updateData.branchName}
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
                  ) : (
                    <Form.Control
                      type="text"
                      name="branchName"
                      value={branchnamedata} // Use the variable set for the manager's branch
                      onChange={handleInputChange}
                      readOnly // Make the input read-only for managers
                    />
                  )}
                </Form.Group>
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
                    type="integer"
                    placeholder="Enter WhatsApp number"
                    name="whatsAppNo"
                    value={updateData.whatsAppNo}
                    onChange={handleUpdateChange}
                    maxLength={10}
                    minLength={10}
                  />
                  {updateData.whatsAppNo &&
                    updateData.whatsAppNo.length !== 10 && (
                      <Form.Text className="text-danger">
                        Phone number must be 10 digits.
                      </Form.Text>
                    )}
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
                    maxLength={10}
                    minLength={10}
                  />
                  {updateData.nomineeMobileNo &&
                    updateData.nomineeMobileNo.length !== 10 && (
                      <Form.Text className="text-danger">
                        Phone number must be 10 digits.
                      </Form.Text>
                    )}
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
            <Form.Label>Signature: </Form.Label>
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "signature-canvas",
              }}
            />
            <div>
              <Button onClick={handleClear}>Clear</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
            <br />
            <Button variant="primary" type="submit">
              Update
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
              <Nav.Item>
                <Nav.Link eventKey="Print">Print</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="details">
                <Details id={viewMemberData._id} memberData={viewMemberData} />
              </Tab.Pane>
              <Tab.Pane eventKey="overview">
                <AccountOverview
                  id={viewMemberData._id}
                  memberData={viewMemberData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="transactions">
                <Transactions
                  id={viewMemberData._id}
                  memberData={viewMemberData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="loans">
                <Loans id={viewMemberData._id} memberData={viewMemberData} />
              </Tab.Pane>
              <Tab.Pane eventKey="Print">
                <Print id={viewMemberData._id} memberData={viewMemberData} />
              </Tab.Pane>
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
                <option value="FD">FD</option>
                <option value="DD">DD</option>
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
      <div className="overflow-x-auto">
        <Table
          responsive
          striped
          bordered
          hover
          className="min-w-full mt-4 rounded-lg table-auto" // Removed overflow-hidden
        >
          <thead>
            <tr>
              <th>Profile Pic</th>
              <th>Name</th>
              <th>branchName</th>
              <th>Email</th>
              <th>Nominee</th>
              <th>WhatsApp</th>
              {/* <th>Account Type</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="relative z-10 min-h-[12rem]">
            {" "}
            {/* Adjusted z-index */}
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
                {/* <td>{member.accountType}</td> */}
                <td className="relative">
                  <div className="position-relative">
                    {renderDropdownForUserType(member._id)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
export default Members;
