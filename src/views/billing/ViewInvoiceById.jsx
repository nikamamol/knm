import React, { useEffect } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoiceById } from '../../redux/reducer/billing/GetInvoiceFromId'; // Adjust the path as necessary
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Logo from "../../assets/Logo.png";

const Invoice = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data: invoiceData, loading } = useSelector((state) => state.invoice);

    useEffect(() => {
        dispatch(fetchInvoiceById(id));
    }, [dispatch, id]);

    const downloadInvoicePDF = () => {
        const invoiceElement = document.getElementById('invoice');
        html2canvas(invoiceElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const imgWidth = 595.28;
            const pageHeight = 841.89;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!invoiceData) {
        return <div>No invoice data found.</div>;
    }

    return (
        <>
            <div className='text-end'>
                <Button className="mt-4" onClick={downloadInvoicePDF}>
                    <span className='me-2'>Download</span> <CloudDownloadIcon />
                </Button>
            </div>

            <section>
                <div className="invoice" id="invoice">
                    <div className="top_line"></div>
                    <div className="header">
                        <div className="i_row">
                            <div className="i_logo">
                                <img src={Logo} alt="Company Logo" width={80} height={50} />
                                <div>Koinet Media Ites Pvt Ltd.</div>
                            </div>
                            <div className="i_title">
                                <h2>INVOICE</h2>
                                <p>{invoiceData.date}</p>
                            </div>
                        </div>
                        <div className="i_row">
                            <div className="i_number">
                                <p className="p_title">INVOICE NO: {invoiceData.invoiceNumber}</p>
                            </div>
                            <div className="i_address">
                                <p>TO</p>
                                <p>
                                    {invoiceData.clientName}
                                    <br />
                                    <textarea
                                        className="border-0 p-2 in_background"
                                        value={invoiceData.clientAddress}
                                        readOnly
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
                                            <p>{item.qty}</p>
                                        </div>
                                        <div className="i_col w_55">
                                            <p>{item.description}</p>
                                        </div>
                                        <div className="i_col w_15">
                                            <p>${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="i_col w_15">
                                            <p>${item.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
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
                                        <p>${invoiceData.subTotal.toFixed(2)}</p>
                                        <p>${invoiceData.tax.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="text-end" style={{ width: "700px" }}>
                                    <hr />
                                    <span className="p-3 fw-bold">Grand Total:</span>
                                    <span className="p-3 fw-bold">${invoiceData.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="i_row_footer d-flex justify-content-between align-items-start">
                            <div className="i_col">
                                <p className="p_title">Payment Method</p>
                            </div>

                            <div className="ms-2">
                                <p className="p_title">Bank Name</p>
                                <p>{invoiceData.bankName}</p>
                            </div>

                            <div className="ms-2">
                                <p className="p_title">Account Number</p>
                                <p>{invoiceData.accountNumber}</p>
                            </div>

                            <div className="ms-2 w-25">
                                <p className="p_title">Terms and Conditions</p>
                                <p>{invoiceData.terms}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

function ViewInvoiceById() {
    return (
        <div>
            <Container fluid className="my-5">
                <Row>
                    <Col lg={2}></Col>
                    <Col lg={10}>
                        <div className="bgColor rounded-3 shadow">
                            <h4 className="fw-bold py-3 ms-3 text_color">View Invoice</h4>
                        </div>
                        <div>
                            <Invoice />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ViewInvoiceById;
