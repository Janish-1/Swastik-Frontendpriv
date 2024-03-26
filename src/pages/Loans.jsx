// Loans.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, FormControl, Tab, Nav } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { parseISO } from "date-fns";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Objectionloan from "./Objectionloan";
import LoanCalci from "./LoanCalci";
import jsPDF from 'jspdf';

const FRONT_BASE_URL = process.env.REACT_APP_FRONT_URL;
const API_BASE_URL = process.env.REACT_APP_API_URL;

const Loans = () => {
  const [showModal, setShowModal] = useState(false);
  const [printdata, setprintdata] = useState({});
  const [formData, setFormData] = useState({
    loanId: "",
    loanProduct: "",
    memberName: "",
    memberNo: "",
    releaseDate: new Date(), // Default date
    pan: null,
    aadhar: null,
    appliedAmount: "",
    status: "Pending",
    endDate: new Date(),
    durationMonths: 0,
  });
  const [loansData, setLoansData] = useState([]);
  const [selectedLoanIndex, setSelectedLoanIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [memberNumbers, setmemberNumbers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [accountIds, setAccountIds] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [uniqueloanid, setuniqueloanid] = useState(0);
  const [selectedLoanForApproval, setSelectedLoanForApproval] = useState(null);
  const [showObjectionModal, setShowObjectionModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [userType, setusertype] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMemberData, setViewMemberData] = useState(0);

  const handleOpenViewModal = (id) => {
    // console.log(id);
    fetchData();
    const selectedMember = loansData.find((loan) => loan._id === id);
    setViewMemberData(selectedMember);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewMemberData(true);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoanIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      status: e.target.value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      releaseDate: date,
    }));
  };

  const handleOpenEditModal = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/loans/${id}`);
      const loandata = response.data.data; // Assuming response.data contains the loan data

      // Destructure loan data
      const {
        _id,
        loanId,
        account,
        loanProduct,
        memberName,
        memberNo,
        pan,
        aadhar,
        releaseDate,
        appliedAmount,
        status,
        endDate,
        durationMonths,
        objections,
      } = loandata;

      // Adjust the format of the releaseDate
      const formattedReleaseDate = releaseDate
        ? parseISO(releaseDate)
        : new Date();

      // Set the form data for editing
      setFormData({
        id: _id,
        loanId,
        account,
        loanProduct,
        memberName,
        memberNo,
        pan: null,
        aadhar: null,
        releaseDate: formattedReleaseDate,
        appliedAmount,
        status,
        endDate,
        durationMonths,
        objections,
        // ... Add other fields as necessary based on your form structure
      });

      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      // Handle error or display an error message to the user
      // // console.error("Error fetching loan data:", error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleDelete = async (id) => {
    try {
      // Ask for confirmation
      const confirmed = window.confirm("Are you sure you want to delete this loan?");

      if (confirmed) {
        const response = await axios.delete(`${API_BASE_URL}/deleteloan/${id}`);

        // Check the HTTP status code for success (assumes a 2xx status code indicates success)
        if (response.status >= 200 && response.status < 300) {
          // Show success alert for delete
          window.alert("Loan successfully deleted");
          fetchData(); // Refetch data after deletion
        } else {
          // Show failed alert for delete due to non-success status code
          window.alert("Failed to delete loan. Please try again.");
        }
      } else {
        // User canceled the deletion
        window.alert("Deletion canceled");
      }
    } catch (error) {
      // Handle error
      console.error("Failed to delete loan:", error);

      // Show error alert for delete
      window.alert("Failed to delete loan. Please try again.");
    }
  };

  const fetchDetails = async (inputValue, type) => {
    try {
      let response;
      if (type === "member") {
        response = await axios.get(
          `${API_BASE_URL}/detailsByMemberId/${inputValue}`
        );
        const memberDetails = response.data;
        const { accountNumber, memberName } = memberDetails;
        setFormData((prevFormData) => ({
          ...prevFormData,
          account: accountNumber,
          memberName: memberName,
        }));
      } else if (type === "account") {
        response = await axios.get(
          `${API_BASE_URL}/detailsByAccountNumber/${inputValue}`
        );
        const accountDetails = response.data;
        const { memberNo, memberName } = accountDetails;
        setFormData((prevFormData) => ({
          ...prevFormData,
          memberNo: memberNo,
          memberName: memberName,
        }));
      }
    } catch (error) {
      // Handle error or display an error message
      // // console.error("Error fetching details:", error);
    }
  };

  const handleMemberOrAccountSelect = (value, type) => {
    // Call fetchDetails function with the selected value and type
    fetchDetails(value, type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImages = new FormData();
    formDataWithImages.append("images", formData.pan);
    formDataWithImages.append("images", formData.aadhar);

    try {
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

      const {
        loanId,
        account,
        loanProduct,
        memberName,
        memberNo,
        pan,
        aadhar,
        releaseDate,
        appliedAmount,
        status,
        endDate,
        durationMonths,
        objections,
      } = formData;

      await axios.post(`${API_BASE_URL}/createloan`, {
        loanId: uniqueloanid,
        loanProduct,
        memberName,
        memberNo,
        releaseDate,
        appliedAmount,
        pan: imageUrls.imageUrl1,
        aadhar: imageUrls.imageUrl2,
        status,
        account, // Include accountId in the POST request
        endDate,
        durationMonths,
        objections,
      });

      handleCloseModal();
      setFormData({
        loanId: "",
        account: "",
        loanProduct: "",
        memberName: "",
        memberNo: "",
        pan: null,
        aadhar: null,
        releaseDate: new Date(),
        appliedAmount: "",
        status: "",
        endDate: new Date(),
        durationMonths: 0,
      });

      // Show success alert for create
      window.alert("Loan successfully created");

      fetchData(); // Refetch data after submission
    } catch (error) {
      // Handle errors appropriately, such as displaying an error message
      console.error('Error:', error);
      // Show error alert for create
      window.alert("Failed to create loan. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataWithImages = new FormData();
    formDataWithImages.append("images", formData.pan);
    formDataWithImages.append("images", formData.aadhar);

    try {
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

      const response = await axios.put(
        `${API_BASE_URL}/updateloan/${formData.id}`,
        {
          ...formData,
          pan: imageUrls.imageUrl1,
          aadhar: imageUrls.imageUrl2,
        }
      );

      setFormData({
        loanId: "",
        account: "",
        loanProduct: "",
        memberName: "",
        memberNo: "",
        pan: null,
        aadhar: null,
        releaseDate: new Date(),
        appliedAmount: "",
        status: "",
        endDate: new Date(),
        durationMonths: "",
      });

      // Show success alert for update
      window.alert("Loan successfully updated");

      handleCloseEditModal();
      fetchData(); // Refetch data after update
    } catch (error) {
      // Show error alert for update
      window.alert("Failed to update loan. Please check the data fields.");
      console.error('Error:', error);
      // handleCloseEditModal();
    }
  };

  const handleApproveLoan = async (loanId) => {
    // Implement approve loan logic
    const response = await axios.put(`${API_BASE_URL}/approveLoan/${loanId}`);
    // // console.log(response);
    fetchData();
  };

  const handleCancelLoan = async (loanId) => {
    const response = await axios.put(`${API_BASE_URL}/cancelLoan/${loanId}`);
    // // console.log(response);
    fetchData();
  };

  const handleObjection = (loanId) => {
    setSelectedLoanId(loanId);
    setShowObjectionModal(true);
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleObjectionSubmit = async (reason) => {
    const response = await axios.put(
      `${API_BASE_URL}/objection/${selectedLoanId}`,
      { reason }
    );
    fetchData();
    setShowObjectionModal(false);
    setSelectedLoanId(null);
  };

  const handleCloseObjectionModal = () => {
    setShowObjectionModal(false);
    setSelectedLoanId(null);
  };
  // Function to fetch data
  const fetchData = async () => {
    try {
      const loansResponse = await axios.get(`${API_BASE_URL}/loans`);
      const fetchedLoans = loansResponse.data.data;
      setLoansData(fetchedLoans);

      const membersResponse = await axios.get(`${API_BASE_URL}/loanmembers`);
      const memberNumbers = membersResponse.data.data;
      setmemberNumbers(memberNumbers);

      try {
        const response = await axios.get(`${API_BASE_URL}/approvedaccountids`);
        setAccountIds(response.data.data);
        // // console.log(response);
      } catch (error) {
        // Error Catching
      }
      const memberresponse = await axios.get(`${API_BASE_URL}/readmembersname`);
      const names = memberresponse.data.data.map((member) => member.name);
      // console.log(memberresponse);
      setMemberNames(names);

      const uniqueloanresponse = await axios.get(
        `${API_BASE_URL}/randomgenLoanId`
      );
      setuniqueloanid(uniqueloanresponse.data.uniqueid);

      const token = localStorage.getItem("token");
      if (token) {
        const tokenParts = token.split(".");
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payload = JSON.parse(decodedPayload);
        const userRole = payload.role; // Assuming 'role' contains the user's rol
        setusertype(userRole);
        // console.log(userType);
      }
    } catch (error) {
      // // console.error('Error fetching data:', error);
      // Handle error or display an error message
    }
  };

  useEffect(() => {
    // Fetch data initially on component mount
    fetchData();
  }, []);
  const LoanDetailsTab = ({ data }) => {
    return (
      <div>
        <h4>Loan ID: {data.loanId}</h4>
        <p>Loan Product: {data.loanProduct}</p>
        <p>Member Name: {data.memberName}</p>
        <p>Member Number: {data.memberNo}</p>
        <p>Account: {data.account}</p>
        <p>Status: {data.status}</p>
        <p>Applied Amount: {data.appliedAmount}</p>
        <p>Duration in Months: {data.durationMonths}</p>
        <p>Release Date: {new Date(data.releaseDate).toLocaleDateString()}</p>
        <p>End Date: {new Date(data.endDate).toLocaleDateString()}</p>
        <div>
          <p>PAN Image:</p>
          <img src={data.pan} alt="PAN Image" width={"300px"} height={"300px"} />
        </div>
        <div>
          <p>Aadhar Image:</p>
          <img src={data.aadhar} alt="Aadhar Image" width={"300px"} height={"300px"} />
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Filter loans based on search term in 'memberNo' and 'borrowerNumber' columns
    const filteredLoans = loansData.filter((loan) => {
      const memberNo = loan.memberNo.toString().toLowerCase(); // Convert to lowercase string
      const borrowerNumber = loan.memberName.toString().toLowerCase(); // Convert to lowercase string
      const searchTermLower = searchTerm.toLowerCase(); // Convert search term to lowercase

      // Check if 'memberNo' or 'borrowerNumber' includes the search term
      return (
        memberNo.includes(searchTermLower) ||
        borrowerNumber.includes(searchTermLower)
      );
    });

    setFilteredLoans(filteredLoans);
  }, [searchTerm, loansData]);

  const generateBankDocumentPDF = async () => {
    const doc = new jsPDF();

    // Add Border around the whole document
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 280);

    // Add Bank Name and Bank ID in the header
    if (`${FRONT_BASE_URL}/logo.png`) {
        doc.addImage(`${FRONT_BASE_URL}/logo.png`, 'JPEG', 10, 10, 50, 50);
    }

    doc.setFontSize(16);
    doc.text("Swastik", 70, 20); // Adjusted position for Bank Name to avoid overlap
    doc.setFontSize(12);
    doc.text("Unhel Branch", 70, 30); // Adjusted position for Bank ID to avoid overlap
    doc.line(5, 60, 205, 60); // Line to separate header from content

    // Personal Information Section
    doc.text("Loan Information", 15, 68);
    doc.line(5, 70, 205, 70); // Line to separate sections
    doc.text(`Name: ${printdata["memberName"] || 'Undefined'}`, 15, 78);
    doc.text(`Member Number: ${printdata["memberNo"] || 'Undefined'}`, 65, 78);
    doc.text(`Applied Amount: ${printdata["appliedAmount"] || 'Undefined'}`, 125, 78);
    doc.text(`Account Number: ${printdata["account"] || 'Undefined'}`, 15, 88);
    doc.text(`Release Date: ${new Date(printdata["releaseDate"]).toLocaleString() || 'Undefined'}`, 85, 88);
    doc.text(`End Date: ${new Date(printdata["endDate"]).toLocaleString() || 'Undefined'}`, 65, 98);
    doc.text(`Duration in Months: ${printdata["durationMonths"] || 'Undefined'}`, 15, 98);

    // PAN and Aadhar Attached Section
    doc.line(5, 108, 205, 108); // Line to separate sections
    doc.text("Id Proof and Photo Attached", 15, 113);
    doc.line(5, 118, 205, 118); // Line to separate sections

    // Assuming the PDF link is stored in memberDetails["PDF Link"]
    const pdfLink = printdata["aadhar"];

    // Download Aadhar PDF
    await downloadPDF(pdfLink, 'aadhar.pdf');

    // Assuming the PDF link is stored in memberDetails["PDF Link"]
    const pdfLink1 = printdata["pan"];

    // Download PAN PDF
    await downloadPDF(pdfLink1, 'pan.pdf');

    // Save the generated PDF
    doc.save('bank_document.pdf');
};

const downloadPDF = async (pdfLink, fileName) => {
    // Create a hidden link element
    const downloadLink = document.createElement('a');

    downloadLink.style.display = 'none';
    downloadLink.href = pdfLink;
    downloadLink.download = fileName; // Set the default download filename

    // Append the link to the body and trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Wait for the download to complete
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust delay as needed

    // Clean up: remove the link from the DOM
    document.body.removeChild(downloadLink);
};

const handleprint = async (loanId) => {
    const loansResponse = await axios.get(`${API_BASE_URL}/loans/${loanId}`);
    const fetchedLoans = loansResponse.data.data;
    setprintdata(fetchedLoans);
    await generateBankDocumentPDF();

    console.log("Print Clicked");
}

  function showdropdownfortype(loanId) {
    switch (userType) {
      case "admin":
        return (
          <Dropdown drop="end">
            <Dropdown.Toggle variant="primary" id="loanActionsDropdown">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ zIndex: 9999 }}>
              <Dropdown.Item onClick={() => handleOpenViewModal(loanId)}>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenEditModal(loanId)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(loanId)}>
                Delete
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleApproveLoan(loanId)}>
                Approve
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCancelLoan(loanId)}>
                Cancel
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleObjection(loanId)}>
                Objection
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      case "manager":
        return (
          <Dropdown drop="end">
            <Dropdown.Toggle variant="primary" id="loanActionsDropdown">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ zIndex: 9999 }}>
              <Dropdown.Item onClick={() => handleOpenViewModal(loanId)}>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenEditModal(loanId)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(loanId)}>
                Delete
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleApproveLoan(loanId)}>
                Approve
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCancelLoan(loanId)}>
                Cancel
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleObjection(loanId)}>
                Objection
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      case "agent":
        return (
          <Dropdown drop="end">
            <Dropdown.Toggle variant="primary" id="loanActionsDropdown">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ zIndex: 9999 }}>
              <Dropdown.Item onClick={() => handleOpenViewModal(loanId)}>
                View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenEditModal(loanId)}>
                Edit
              </Dropdown.Item>
              {/* <Dropdown.Item onClick={() => handleDelete(loanId)}>
            Delete
          </Dropdown.Item> */}
              <Dropdown.Item onClick={() => handleApproveLoan(loanId)}>
                Approve
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleCancelLoan(loanId)}>
                Cancel
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleObjection(loanId)}>
                Objection
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      default:
        return null;
    }
  }

  return (
    <div className="body-div">
      <div className="d-flex mb-2">
        <Button
          className="mr-2"
          onClick={() => {
            setFormData({});
            handleOpenModal();
          }}
        >
          Add Loan
        </Button>
        <FormControl
          className="custom-search-bar"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLoanId">
              <Form.Label>Loan ID</Form.Label>
              <Form.Control
                type="integer"
                placeholder="Enter loan ID"
                name="loanId"
                value={uniqueloanid}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAccountId">
              <Form.Label>Account ID</Form.Label>
              <Form.Control
                as="select"
                name="account"
                value={formData.account}
                onChange={(e) => {
                  handleInputChange(e);
                  fetchDetails(e.target.value, "account");
                }}
              >
                <option value="">Select Account ID</option>
                {accountIds.map((accountId) => (
                  <option key={accountId} value={accountId}>
                    {accountId}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLoanProduct">
              <Form.Label>Loan Product</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter loan product"
                name="loanProduct"
                value={formData.loanProduct}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBorrower">
              <Form.Label>Borrower</Form.Label>
              <Form.Control
                as="select"
                name="memberName"
                value={formData.memberName}
                onChange={handleInputChange}
              >
                <option value="">Select Borrower Name</option>
                {memberNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formMemberNo">
              <Form.Label>Member No</Form.Label>
              <Form.Control
                as="select"
                name="memberNo"
                value={formData.memberNo}
                onChange={(e) => {
                  handleInputChange(e);
                  fetchDetails(e.target.value, "member");
                }}
              >
                <option value="">Select Member No</option>
                {memberNumbers.map((memberNo) => (
                  <option key={memberNo} value={memberNo}>
                    {memberNo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPAN">
              <Form.Label>Pan (Browse file)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="pan"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="formAadhar">
              <Form.Label>Aadhar (Browse file)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="aadhar"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="formReleaseDate">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                name="releaseDate"
                // value={formData.releaseDate.toISOString().split("T")[0]} // Format the date as YYYY-MM-DD
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAppliedAmount">
              <Form.Label>Applied Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter applied amount"
                name="appliedAmount"
                value={formData.appliedAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Approved"
                  value="Approved"
                  checked={formData.status === "Approved"}
                  onChange={handleStatusChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Pending"
                  value="Pending"
                  checked={formData.status === "Pending"}
                  onChange={handleStatusChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Cancelled"
                  value="Cancelled"
                  checked={formData.status === "Cancelled"}
                  onChange={handleStatusChange}
                />
              </div>
            </Form.Group>
            <Form.Group controlId="formendDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                // value={formData.releaseDate.toISOString().split("T")[0]} // Format the date as YYYY-MM-DD
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formdurationMonths" className="mb-3">
              <Form.Label>Duration in Months</Form.Label>
              <Form.Control
                type="integer"
                placeholder="Enter duration"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="Unique Table ID">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formLoanId">
              <Form.Label>Loan ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter loan ID"
                name="loanId"
                value={formData.loanId}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAccountId">
              <Form.Label>Account ID</Form.Label>
              <Form.Control
                as="select"
                name="accountId"
                value={formData.accountId}
                onChange={handleMemberOrAccountSelect}
              >
                <option value="">Select Account ID</option>
                {accountIds.map((accountId) => (
                  <option key={accountId} value={accountId}>
                    {accountId}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLoanProduct">
              <Form.Label>Loan Product</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter loan product"
                name="loanProduct"
                value={formData.loanProduct}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBorrower">
              <Form.Label>Borrower</Form.Label>
              <Form.Control
                as="select"
                name="memberName"
                value={formData.memberName}
                onChange={handleInputChange}
              >
                <option value="">Select Borrower Name</option>
                {memberNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formMemberNo">
              <Form.Label>Member No</Form.Label>
              <Form.Control
                as="select"
                name="memberNo"
                value={formData.memberNo}
                onChange={handleMemberOrAccountSelect}
              >
                <option value="">Select Member No</option>
                {memberNumbers.map((memberNo) => (
                  <option key={memberNo} value={memberNo}>
                    {memberNo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formReleaseDate">
              <Form.Label>Release Date</Form.Label>
              <br />
              <DatePicker
                selected={formData.releaseDate}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>
            <Form.Group controlId="formPAN">
              <Form.Label>Pan (Browse file)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="pan"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="formAadhar">
              <Form.Label>Aadhar (Browse file)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="aadhar"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="formAppliedAmount">
              <Form.Label>Applied Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter applied amount"
                name="appliedAmount"
                value={formData.appliedAmount}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Approved"
                  value="Approved"
                  checked={formData.status === "Approved"}
                  onChange={handleStatusChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Pending"
                  value="Pending"
                  checked={formData.status === "Pending"}
                  onChange={handleStatusChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Cancelled"
                  value="Cancelled"
                  checked={formData.status === "Cancelled"}
                  onChange={handleStatusChange}
                />
              </div>
            </Form.Group>
            <Form.Group controlId="formendDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                // value={formData.releaseDate.toISOString().split("T")[0]} // Format the date as YYYY-MM-DD
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formdurationMonths" className="mb-3">
              <Form.Label>Duration in Months</Form.Label>
              <Form.Control
                type="integer"
                placeholder="Enter duration"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3">
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
            View Loan Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Tab.Container id="loan-details-tabs" defaultActiveKey="details">
            <Nav variant="tabs" className="mb-6">
              <Nav.Item>
                <Nav.Link eventKey="details">Details</Nav.Link>
              </Nav.Item>
              {/* Add more Nav.Item components as needed */}
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="details">
                <LoanDetailsTab data={viewMemberData} />
              </Tab.Pane>
              {/* Add more Tab.Pane components as needed */}
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>

      {selectedLoanForApproval && (
        <Button variant="success" onClick={handleApprove}>
          Approve Loan
        </Button>
      )}

      <Table
        responsive
        striped
        bordered
        hover
        className="min-w-full mt-4 rounded-lg table-auto" // Removed overflow-hidden
      >
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Account ID</th>
            <th>Loan Product</th>
            <th>Member Name</th>
            <th>Member No</th>
            <th>Release Date</th>
            <th>Loan Amount</th>
            <th>Status</th>
            <th>End Date</th>
            <th>Duration in Months</th>
            <th>Objections</th>
            <th>Action</th>
            <th>Print</th>
          </tr>
        </thead>

        <tbody className="relative z-10 min-h-[12rem]">
          {filteredLoans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.loanId}</td>
              <td>{loan.account}</td>
              <td>{loan.loanProduct}</td>
              <td>{loan.memberName}</td>
              <td>{loan.memberNo}</td>
              <td>{new Date(loan.releaseDate).toLocaleDateString()}</td>
              <td>{loan.appliedAmount}</td>
              <td>{loan.status}</td>
              <td>
                {loan.endDate
                  ? new Date(loan.endDate).toLocaleDateString()
                  : "-"}
              </td>
              <td>{loan.durationMonths || "-"}</td>
              <td>{loan.objections}</td>
              <td>{showdropdownfortype(loan._id)}</td>
              <td>
                <Button onClick={() => handleprint(loan._id)} > Print </Button>
              </td>
            </tr>
          ))}
          {/* Objection Modal */}
          <Objectionloan
            show={showObjectionModal}
            handleClose={handleCloseObjectionModal}
            handleObjectionSubmit={handleObjectionSubmit}
          />
        </tbody>
      </Table>
      <LoanCalci />
    </div>
  );
};

export default Loans;
