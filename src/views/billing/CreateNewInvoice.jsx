import React, { useMemo, useState } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import Logo from "../../assets/Logo.png"
import Unauthorised from "../../assets/401Unauthorised.png"



const Invoice = () => {
    const [invoiceData, setInvoiceData] = useState({
        logo: '',
        date: 'April 20, 2024',
        invoiceNumber: '3452324',
        clientName: 'Test Pvt Ltd.',
        clientAddress: 'xyz, text, United States',
        items: [
            {
                qty: 3,
                description: 'Lorem, ipsum.',
                price: 10,
                total: 30,
            },
        ],
        subTotal: 100,
        tax: 10,
        grandTotal: 110,
        bankName: 'Bank of India',
        accountNumber: '1234567890',
        terms: 'Payment is due within 30 days from the invoice date. Late payments may incur additional fees',
    });

    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const updateField = (field, value) => {
        setInvoiceData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const updateItem = (index, field, value) => {
        const updatedItems = invoiceData.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setInvoiceData((prevState) => ({
            ...prevState,
            items: updatedItems,
        }));
    };

    const addItem = () => {
        setInvoiceData((prevState) => ({
            ...prevState,
            items: [
                ...prevState.items,
                {
                    qty: 0,
                    description: '',
                    details: '',
                    price: 0,
                    total: "",
                },
            ],
        }));
    };

    const calculateTotal = useMemo(() => {
        const subTotal = invoiceData.items.reduce(
            (acc, item) => acc + item.qty * item.price,
            0
        );
        const tax = (subTotal * 10) / 100; // Assuming 10% tax rate
        return {
            subTotal,
            tax,
            grandTotal: subTotal + tax,
        };
    }, [invoiceData.items]);

    const generatePDF = () => {
        // Update totals for each item and overall values before generating the PDF and sending to server
        const updatedItems = invoiceData.items.map(item => ({
            ...item,
            total: item.qty * item.price,
        }));

        const updatedInvoiceData = {
            ...invoiceData,
            items: updatedItems,
            subTotal: calculateTotal.subTotal,
            tax: calculateTotal.tax,
            grandTotal: calculateTotal.grandTotal,
        };

        setInvoiceData(updatedInvoiceData);

        const invoiceElement = document.querySelector('.invoice');
        html2canvas(invoiceElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, heightLeft, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('invoice.pdf');
            setIsGeneratingPDF(false);

            // Send updated invoice data to the backend
            axios.post('http://localhost:4000/user/createInvoice', updatedInvoiceData)
                .then((response) => {
                    console.log('Invoice data sent to server:', response.data);
                })
                .catch((error) => {
                    console.error('Error sending invoice data:', error);
                });
        });
    };


    const handleGeneratePDFClick = () => {
        setIsGeneratingPDF(true);
        setTimeout(() => {
            generatePDF();
        }, 0);
    };

    const removeItem = (index) => {
        const updatedItems = invoiceData.items.filter((_, i) => i !== index);
        setInvoiceData((prevState) => ({
            ...prevState,
            items: updatedItems,
        }));
    };

    return (
        <section>
            <div className="invoice">
                <div className="top_line"></div>
                <div className="header">
                    <div className="i_row">
                        <div className="i_logo">
                            <img src={Logo} alt="Company Logo" width={80} height={50} />
                            <div>Koinet Media Ites Pvt Ltd.</div>
                        </div>
                        <div className="i_title">
                            <h2>INVOICE</h2>
                            <input
                                type="date"
                                className="border-0 p-2 in_background"
                                value={invoiceData.date}
                                onChange={(e) => updateField('date', e.target.value)}
                            />
                        </div>

                    </div>
                    <div className="i_row">
                        <div className="i_number">
                            <p className="p_title">INVOICE NO:  <input
                                type="number"
                                className="border-0 p-2 in_background"
                                value={invoiceData.invoiceNumber}
                                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                            /></p>
                        </div>
                        <div className="i_address ">
                            <p>TO</p>
                            <p className="">
                                <input
                                    type="text"
                                    className="border-0 p-2 in_background"
                                    value={invoiceData.clientName}
                                    onChange={(e) => updateField('clientName', e.target.value)}
                                />
                                <br />
                                <textarea
                                    className="border-0 p-2 in_background "
                                    value={invoiceData.clientAddress}
                                    onChange={(e) => updateField('clientAddress', e.target.value)}
                                />
                            </p>
                        </div>

                    </div>
                </div>

                <div className="body">
                    <div className="i_table">
                        <div className="i_table_head">
                            <div className="i_row">
                                <div className="i_col w_15">
                                    <p className="p_title">QTY</p>
                                </div>
                                <div className="i_col w_55">
                                    <p className="p_title">DESCRIPTION</p>
                                </div>
                                <div className="i_col w_15">
                                    <p className="p_title">PRICE</p>
                                </div>
                                <div className="i_col w_15">
                                    <p className="p_title">TOTAL</p>
                                </div>
                            </div>
                        </div>

                        <div className="i_table_body">
                            {invoiceData.items.map((item, index) => (
                                <div className="i_row" key={index}>
                                    <div className="i_col w_15">
                                        <input
                                            type="number"
                                            className="border-0 p-2 in_background"
                                            value={item.qty}
                                            onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="i_col w_55">
                                        <textarea
                                            type="text"
                                            className="border-0 p-2 in_background"
                                            value={item.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            style={{
                                                width: '300px',
                                                height: '40px',  // Set height as per your preference
                                                overflowX: 'hidden',  // Prevent horizontal scrolling
                                                overflowY: 'auto',  // Allow vertical scrolling if needed
                                                wordWrap: 'break-word',  // Ensure text wraps within the textarea
                                            }}
                                        />
                                    </div>
                                    <div className="i_col w_15">
                                        <input
                                            type="number"
                                            className="border-0 p-2 in_background"
                                            value={item.price}
                                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                                            style={{ width: '70px' }}
                                        />
                                    </div>
                                    <div className="i_col w_15 mt-2 ">
                                        <p>{item.qty * item.price}</p>
                                    </div>

                                    {!isGeneratingPDF && (
                                        <Tooltip title="Delete Item">
                                            <IconButton onClick={() => removeItem(index)}>
                                                <DeleteIcon sx={{ color: 'black' }} /> {/* You can also use custom colors like '#000' */}
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </div>
                            ))}

                            {!isGeneratingPDF && (
                                <div>
                                    <button onClick={addItem} className="mt-3 btn btn-sm btn-outline-primary">
                                        Add Item <AddIcon />
                                    </button>
                                </div>
                            )}
                        </div>

                        <hr />
                        <div className="i_table_foot mt-2">
                            <div className="i_row">
                                <div className="i_col w_20"></div>
                                <div className="i_col w_55"></div>
                                <div className="i_col w_20">
                                    <p>Sub Total</p>
                                    <p>Tax 10%</p>
                                </div>
                                <div className="i_col w_20">
                                    <p>${calculateTotal.subTotal.toFixed(2)}</p>
                                    <p>${calculateTotal.tax.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="text-end " >
                                <hr />
                                <span className=" p-3 fw-bold ">Grand Total:</span>
                                <span className=" p-3 fw-bold "> ${calculateTotal.grandTotal.toFixed(2)}</span>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <div className="i_row_footer d-flex justify-content-between align-items-start">
                        <div className="i_col ">
                            <p className="p_title">Payment Method</p>

                        </div>
                        <br />
                        <div className="ms-2">
                            <p className="p_title">Bank Name</p>
                            <input
                                type="text"
                                className="border-0 p-2 in_background"
                                value={invoiceData.bankName}
                                onChange={(e) => updateField('bankName', e.target.value)}
                            />
                        </div>

                        <div className="">
                            <p className="p_title">Account Number</p>
                            <input
                                type="text"
                                className="border-0 p-2 in_background"
                                value={invoiceData.accountNumber}
                                onChange={(e) => updateField('accountNumber', e.target.value)}
                            />
                        </div>
                        <div className="ms-2 w-25">
                            <p className="p_title">Terms and Conditions</p>
                            <p

                            >{invoiceData.terms}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-center">
                {!isGeneratingPDF ? (
                    <button className="btn btn-outline-primary" onClick={handleGeneratePDFClick}>
                        Generate PDF
                    </button>
                ) : (
                    <button className="btn btn-outline-primary" disabled>
                        Generating PDF...
                    </button>
                )}
            </div>
        </section>
    );
};



function CreateNewInvoice() {
    const userRole = localStorage.getItem('role');

    return (
        <div>
            <Container fluid className="my-5">
                <Row>
                    <Col lg={3}></Col>
                    <Col lg={8}>
                        <div className="bgColor rounded-3 shadow">
                            <h4 className="fw-bold py-3 ms-3 text_color">Create Invoice</h4>
                        </div>
                        <div>
                            {(userRole === 'admin' || userRole === 'oxmanager') ? (
                                <Invoice />
                            ) : (

                                <div className='text-center mt-2 '>
                                    <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
                                    <p className='text-danger'>You do not have permission to view this content.</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default CreateNewInvoice;
