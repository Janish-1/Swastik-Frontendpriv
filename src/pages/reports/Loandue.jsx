import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("Api URL:", API_BASE_URL);

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const downloadPDF = () => {
  const input = document.getElementById("table-to-download");

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("loandue.pdf");
  });
};

const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Loan Due Report</Text>
        <Table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Member No.</th>
              <th>Member</th>
              <th>Total Due</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.loanId}</td>
                <td>{row.memberNo}</td>
                <td>{row.member}</td>
                <td>{row.totalDue}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </View>
    </Page>
  </Document>
);

export default function Loandue() {
  const componentRef = useRef();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/loandue`);
      setData(response.data);
    } catch (error) {
      // console.error("Error fetching loan report data:", error);
      // Handle error (display an error message, etc.)
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = data.filter((item) =>
      item.loanId.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(data); // Set filteredData initially with all data
  }, [data]);

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.loanId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleExportToPDF = () => {
    const blob = new Blob([<MyDocument data={filteredData} />], {
      type: "application/pdf",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "LoanDueReport.pdf";
    link.click();
  };

  return (
    <div>
      <Reports />
      <div style={{ padding: "20px" }}>
        <Container>
          <h2 className="mt-4">Loan Due Report</h2>
          <Row className="mt-4">
            <Col>
              <Form>
                <Row className="mb-2">
                  <Col md={6}>
                    <Form.Group controlId="searchBar">
                      {/* Bind input value to searchTerm state and add onChange event */}
                      <Form.Control
                        type="text"
                        placeholder="Search by Loan ID..."
                        onChange={handleSearchChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="d-flex justify-content-between">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleSearch} // Update to call handleSearch
                    >
                      Search
                    </Button>
                    <Col md={9}>
                      <Button
                        className="justify-start mt-2"
                        variant="danger"
                        type="button"
                        onClick={downloadPDF}
                      >
                        Export to PDF
                      </Button>
                    </Col>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          {/* Display filteredData instead of the original data */}
          <div className="mt-4" ref={componentRef}>
            <Table responsive striped bordered hover id="table-to-download">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Member No.</th>
                  <th>Member</th>
                  <th>Total Due</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.loanId}</td>
                    <td>{item.memberNo}</td>
                    <td>{item.memberName}</td>
                    <td>{item.totalDue}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </div>
  );
}
