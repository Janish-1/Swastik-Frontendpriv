import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const FRONT_BASE_URL = process.env.REACT_APP_FRONT_URL;

const Print = ({ id }) => {
    const [memberDetails, setMemberDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/getmember/${id}`);
                const data = response.data;

                const newData = {
                    "Profile": data.photo,
                    "Member No": data.memberNo,
                    "Name": data.fullName,
                    "Email": data.email,
                    "Branch": data.branchName,
                    "ID Proof": data.idProof,
                    "Signature": data.signature,
                    "Father Name": data.fatherName,
                    "Gender": data.gender,
                    "Martial Status": data.maritalStatus,
                    "Date of Birth": data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : null,
                    "Current Address": data.currentAddress,
                    "Permanent Address": data.permanentAddress,
                    "WhatsApp Number": data.whatsAppNo,
                    "Nominee Name": data.nomineeName,
                    "Nominee Relation": data.relationship,
                    "Nominee Date Of Birth": data.nomineeDateOfBirth ? new Date(data.nomineeDateOfBirth).toLocaleDateString() : null,
                    "Wallet ID": data.walletId
                };

                setMemberDetails(newData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const generateBankDocumentPDF = () => {
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
        doc.text("Personal Information", 15, 68);
        doc.line(5, 70, 205, 70); // Line to separate sections
        doc.text(`Name: ${memberDetails["Name"]}`, 15, 78);
        doc.text(`Father Name: ${memberDetails["Father Name"]}`, 65, 78);
        doc.text(`Gender: ${memberDetails["Gender"]}`, 105, 78);
        doc.text(`Martial Status: ${memberDetails["Martial Status"]}`, 140, 78);
        doc.text(`Date of Birth: ${memberDetails["Date of Birth"]}`, 15, 88);
        doc.text(`Current Address: ${memberDetails["Current Address"]}`, 15, 98);
        doc.text(`Permanent Address: ${memberDetails["Permanent Address"]}`, 15, 118);
        doc.text(`WhatsApp Number: ${memberDetails["WhatsApp Number"]}`, 85, 88);
    
        // Nominee Information Section
        doc.line(5, 140, 205, 140); // Line to separate sections
        doc.text("Nominee Information", 15, 145);
        doc.line(5, 150, 205, 150); // Line to separate sections
        doc.text(`Name: ${memberDetails["Nominee Name"]}`, 15, 160);
        doc.text(`Relation: ${memberDetails["Nominee Relation"]}`, 65, 160);
        doc.text(`Date Of Birth: ${memberDetails["Nominee Date Of Birth"]}`, 105, 160);
    
        // Signature and Document Attached Section
        doc.line(5, 170, 205, 170); // Line to separate sections
        doc.text("Signature and Document Attached", 15, 175);
        doc.line(5, 180, 205, 180); // Line to separate sections
        doc.addImage(memberDetails["Signature"], "JPEG", 15, 222);
        doc.addImage(memberDetails["ID Proof"], "JPEG", 120, 222);
        doc.line(15 ,265, 75, 265);
    
        doc.save('bank_document.pdf');
    };
                        
    if (loading) {
        return <p>Loading...</p>;
    }

    const imageFields = ['Profile', 'ID Proof', 'Signature'];

    return (
        <div>
            <button onClick={generateBankDocumentPDF}>Download PDF</button>
            <Table bordered striped responsive>
                <tbody>
                    {Object.keys(memberDetails).map((field) => (
                        <tr key={field}>
                            <th>{field}</th>
                            <td>
                                {imageFields.includes(field) && memberDetails[field] ?
                                    <img src={memberDetails[field]} alt={field} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                    :
                                    memberDetails[field]
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Print;
