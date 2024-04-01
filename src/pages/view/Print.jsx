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
        doc.text("REGP. Office 1st Floor,Purani Sabji Mandi Unhel, Dist.Ujjain(M.P)",70,40);
        doc.text("Pincode 456221",70,50);
        doc.line(5, 60, 205, 60); // Line to separate header from content

        // Personal Information Section
        doc.text("Personal Information", 15, 68);
        doc.line(5, 70, 205, 70); // Line to separate sections
        doc.text(`Name: ${memberDetails["Name"]}`, 15, 78);
        doc.text(`Father Name: ${memberDetails["Father Name"]}`, 65, 78);
        doc.text(`Gender: ${memberDetails["Gender"]}`, 105, 78);
        doc.text(`Martial Status: ${memberDetails["Martial Status"]}`, 140, 78);
        doc.text(`Date of Birth: ${memberDetails["Date of Birth"]}`, 15, 88);
        // Splitting and displaying Current Address
        const currentAddress = memberDetails["Current Address"];
        const currentAddressParts = splitAddressIntoParts(currentAddress);

        doc.text("Current Address:", 15, 98); // First line for current address

        printAddressParts(currentAddressParts, 108); // Print current address parts starting at Y-coordinate 108

        // Splitting and displaying Permanent Address
        const permanentAddress = memberDetails["Permanent Address"];
        const permanentAddressParts = splitAddressIntoParts(permanentAddress);

        doc.text("Permanent Address:", 15, 128); // First line for permanent address

        printAddressParts(permanentAddressParts, 138); // Print permanent address parts starting at Y-coordinate 138

        // Function to split address into parts
        function splitAddressIntoParts(address) {
            const words = address.split(' ');
            const parts = [];
            let currentPart = '';

            words.forEach(word => {
                if ((currentPart + ' ' + word).length <= 160) {
                    currentPart += (currentPart ? ' ' : '') + word;
                } else {
                    parts.push(currentPart);
                    currentPart = word;
                }
            });

            if (currentPart) {
                parts.push(currentPart);
            }

            return parts;
        }

        // Function to print address parts
        function printAddressParts(addressParts, startY) {
            let currentY = startY;

            addressParts.forEach(part => {
                doc.text(part, 15, currentY);
                currentY += 10; // Increment Y-coordinate for the next part
            });
        }
        doc.text(`WhatsApp Number: ${memberDetails["WhatsApp Number"]}`, 85, 88);

        // Nominee Information Section
        doc.line(5, 150, 205, 150); // Line to separate sections
        doc.text("Nominee Information", 15, 155);
        doc.line(5, 160, 205, 160); // Line to separate sections
        doc.text(`Name: ${memberDetails["Nominee Name"]}`, 15, 170);
        doc.text(`Relation: ${memberDetails["Nominee Relation"]}`, 65, 170);
        doc.text(`Date Of Birth: ${memberDetails["Nominee Date Of Birth"]}`, 105, 170);

        // Signature and Document Attached Section
        doc.line(5, 180, 205, 180); // Line to separate sections
        doc.text("Signature and Document Attached", 15, 185);
        doc.line(5, 190, 205, 190); // Line to separate sections
        doc.addImage(memberDetails["Signature"], "JPEG", 15, 222);
        doc.line(15, 265, 75, 265);

        doc.save('bank_document.pdf');

        // Assuming the PDF link is stored in memberDetails["PDF Link"]
        const pdfLink = memberDetails["ID Proof"];
        downloadPDF(pdfLink);
    };

    const downloadPDF = async (pdfLink) => {
        // Create a temporary anchor element
        const tempAnchor = document.createElement('a');
        tempAnchor.href = pdfLink;
        tempAnchor.target = '_blank';
      
        // Dispatch a click event on the anchor element
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        tempAnchor.dispatchEvent(event);
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
