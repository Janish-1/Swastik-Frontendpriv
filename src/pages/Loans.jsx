// Loans.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { parseISO } from "date-fns";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Objectionloan from "./Objectionloan";

const Loans = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    loanId: "",
    loanProduct: "",
    borrower: "",
    memberNo: "",
    releaseDate: new Date(), // Default date
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
      const response = await axios.get(`http://localhost:3001/loans/${id}`);
      const loandata = response.data.data; // Assuming response.data contains the loan data

      // Destructure loan data
      const {
        _id,
        loanId,
        account,
        loanProduct,
        borrower,
        memberNo,
        releaseDate,
        appliedAmount,
        status,
        endDate,
        durationMonths,
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
        borrower,
        memberNo,
        releaseDate: formattedReleaseDate,
        appliedAmount,
        status,
        endDate,
        durationMonths,
        // ... Add other fields as necessary based on your form structure
      });

      setShowEditModal(true); // Open the edit modal
    } catch (error) {
      // Handle error or display an error message to the user
      console.error("Error fetching loan data:", error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/deleteloan/${id}`
      );
      // console.log(response);
      // alert('Delete Success');
      fetchData(); // Refetch data after deletion
    } catch (error) {
      // console.log('Failed Delete');
      // alert('Delete Failed');
    }
  };

  const fetchDetails = async (inputValue, type) => {
    try {
      let response;
      if (type === "member") {
        response = await axios.get(
          `http://localhost:3001/detailsByMemberId/${inputValue}`
        );
        const accountDetails = response.data;
        const { accountNumber, borrowerName } = accountDetails;
        setFormData({
          ...formData,
          account: accountNumber,
          borrower: borrowerName,
          // Update other form fields as needed
        });
      } else if (type === "account") {
        response = await axios.get(
          `http://localhost:3001/detailsByAccountNumber/${inputValue}`
        );
        const memberDetails = response.data;
        const { memberNumber, borrowerName } = memberDetails;
        setFormData({
          ...formData,
          memberNo: memberNumber,
          borrower: borrowerName,
          // Update other form fields as needed
        });
      }
      // Handle the retrieved details accordingly
    } catch (error) {
      // Handle error or display an error message
      console.error("Error fetching details:", error);
    }
  };

  const handleMemberOrAccountSelect = (value, type) => {
    // Call fetchDetails function with the selected value and type
    fetchDetails(value, type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        loanId,
        account,
        loanProduct,
        borrower,
        memberNo,
        releaseDate,
        appliedAmount,
        status,
        endDate,
        durationMonths,
      } = formData;

      await axios.post("http://localhost:3001/createloan", {
        loanId,
        loanProduct,
        borrower,
        memberNo,
        releaseDate,
        appliedAmount,
        status,
        account, // Include accountId in the POST request
        endDate,
        durationMonths,
      });
      handleCloseModal();
      setFormData({
        loanId: "",
        account: "",
        loanProduct: "",
        borrower: "",
        memberNo: "",
        releaseDate: new Date(),
        appliedAmount: "",
        status: "",
        endDate: new Date(),
        durationMonths: 0,
      });
      fetchData(); // Refetch data after submission
    } catch (error) {
      // Handle errors appropriately, such as displaying an error message
      // console.error('Error:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/updateloan/${formData.id}`,
        formData
      );
      setFormData({
        loanId: "",
        account: "",
        loanProduct: "",
        borrower: "",
        memberNo: "",
        releaseDate: new Date(),
        appliedAmount: "",
        status: "",
        endDate: new Date(),
        durationMonths: "",
      });
      // alert('Data Updated Successfully');
      handleCloseEditModal();
      fetchData(); // Refetch data after update
    } catch (error) {
      // alert('Failed to update loan. Please check the data fields.');
      // console.error('Error:', error);
      // handleCloseEditModal();
    }
  };
  const handleApprove = async () => {
    try {
      if (selectedLoanForApproval) {
        await axios.put(
          `http://localhost:3001/approveLoan/${selectedLoanForApproval._id}`
        );
        fetchData();
      }
    } catch (error) {
      console.error("Failed to approve loan.");
    } finally {
      setSelectedLoanForApproval(null);
    }
  };

  const handleApproveLoan = async (loanId) => {
    // Implement approve loan logic
  };

  const handleCancelLoan = async (loanId) => {
    // Implement cancel loan logic
  };

  const handleObjection = (loanId) => {
    setSelectedLoanId(loanId);
    setShowObjectionModal(true);
  };

  const handleObjectionSubmit = (reason) => {
    // Implement logic to handle objection submission
    console.log(
      `Objection submitted for loan ${selectedLoanId} with reason: ${reason}`
    );
    // Reset state or perform other actions as needed
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
      const loansResponse = await axios.get("http://localhost:3001/loans");
      const fetchedLoans = loansResponse.data.data;
      setLoansData(fetchedLoans);

      const membersResponse = await axios.get(
        "http://localhost:3001/loanmembers"
      );
      const memberNumbers = membersResponse.data.data;
      setmemberNumbers(memberNumbers);

      const response = await axios.get("http://localhost:3001/accountids");
      setAccountIds(response.data.data);
      // console.log(response);

      const memberresponse = await axios.get(
        "http://localhost:3001/readmembersname"
      );
      const names = memberresponse.data.data.map((member) => member.name);
      setMemberNames(names);

      const uniqueloanresponse = await axios.get(
        "http://localhost:3001/randomgenLoanId"
      );
      setuniqueloanid(uniqueloanresponse.data.uniqueid);
    } catch (error) {
      // console.error('Error fetching data:', error);
      // Handle error or display an error message
    }
  };

  useEffect(() => {
    // Fetch data initially on component mount
    fetchData();
  }, []);

  useEffect(() => {
    // Filter loans based on search term in 'memberNo' and 'borrowerNumber' columns
    const filteredLoans = loansData.filter((loan) => {
      const memberNo = loan.memberNo.toString().toLowerCase(); // Convert to lowercase string
      const borrowerNumber = loan.borrower.toString().toLowerCase(); // Convert to lowercase string
      const searchTermLower = searchTerm.toLowerCase(); // Convert search term to lowercase

      // Check if 'memberNo' or 'borrowerNumber' includes the search term
      return (
        memberNo.includes(searchTermLower) ||
        borrowerNumber.includes(searchTermLower)
      );
    });

    setFilteredLoans(filteredLoans);
  }, [searchTerm, loansData]);

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
                type="text"
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
                onChange={handleInputChange}
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
                name="borrower"
                value={formData.borrower}
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
                onChange={handleInputChange}
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
            <Form.Group controlId="formdurationMonths">
              <Form.Label>Duration in Months</Form.Label>
              <Form.Control
                type="number"
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
                name="borrower"
                value={formData.borrower}
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
            <Form.Group controlId="formdurationMonths">
              <Form.Label>Duration in Months</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter duration"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
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
        className="mt-4 rounded-lg overflow-hidden"
      >
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Account ID</th>
            <th>Loan Product</th>
            <th>Borrower</th>
            <th>Member No</th>
            <th>Release Date</th>
            <th>Loan Amount</th>
            <th>Status</th>
            <th>End Date</th>
            <th>Duration in Months</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredLoans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.loanId}</td>
              <td>{loan.account}</td>
              <td>{loan.loanProduct}</td>
              <td>{loan.borrower}</td>
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
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="loanActionsDropdown">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ zIndex: 9999 }}>
                    <Dropdown.Item
                      onClick={() => handleOpenEditModal(loan._id)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(loan._id)}>
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleApproveLoan(loan._id)}>
                      Approve
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleCancelLoan(loan._id)}>
                      Cancel
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleObjection(loan._id)}>
                      Objection
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
    </div>
  );
};

export default Loans;
