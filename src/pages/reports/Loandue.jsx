import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Reports from "../Reports";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

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
      const response = await axios.get("http://localhost:3001/loandue");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching loan report data:", error);
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleExportToPDF = () => {
    const blob = new Blob([<MyDocument data={filteredData} />], {
      type: "application/pdf",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "LoanDueReport.pdf";
    link.click();
  };

  const handleSearch = () => {
    // Perform search logic here if needed
    // setSearchValue(/* get the search input value */);
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
                      type="submit"
                      onClick={handlePrint}
                    >
                      Print
                    </Button>
                    <Button variant="danger" onClick={handleExportToPDF}>
                      Export to PDF
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          {/* Display filteredData instead of the original data */}
          <div className="mt-4" ref={componentRef}>
            <Table striped bordered hover>
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
                    <td>{item.borrower}</td>
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
