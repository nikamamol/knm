import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fetchTemplateById } from '../../redux/reducer/createteplate/ViewTemplateById';

function ViewLandingPageDescription() {
    const { id } = useParams(); // Get the template ID from the URL parameters
    const dispatch = useDispatch();
    const template = useSelector((state) => state.templateId.template);
    const templateStatus = useSelector((state) => state.templateId.status);
    const error = useSelector((state) => state.template.error);


    useEffect(() => {
        if (templateStatus === 'idle') {
            dispatch(fetchTemplateById(id));
        }
    }, [id, templateStatus,template, dispatch]);

    const downloadPDF = () => {
        const input = document.getElementById('template-content');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${template.template_title}.pdf`);
        }).catch((error) => {
            console.error('Error generating PDF:', error);
        });
    };

    return (
        <div>
            <Container fluid className='my-5'>
                <Row>
                    <Col lg={3}></Col>
                    <Col lg={8}>
                        <div className='bgColor rounded-3 shadow'>
                            <h4 className='fw-bold py-3 ms-3 text_color'>View Landing Page</h4>
                        </div>
                        {templateStatus === 'loading' && <p>Loading...</p>}
                        {templateStatus === 'failed' && <p>Error: {error}</p>}
                        {templateStatus === 'succeeded' && template && (
                            <div className='container-xxl flex-grow-1 container-p-y'>
                                <div className='card border-0 rounded-4 shadow'>
                                    <div className='card-body' id='template-content'>
                                        <div className='text-center my-5'>
                                            <h4 className='fw-bold'>Title: {template.template_title}</h4>
                                        </div>
                                        {/* <img src={`http://localhost:4000/uploads/${template.logo}`} alt="Logo" style={{ width: '100px', height: 'auto' }} />
                                        <img src={`http://localhost:4000/uploads/${template.banner}`} alt="Banner" style={{ width: '100%', height: 'auto' }} />
                                        <p>Form Type: {template.form_type}</p>
                                        <p>Form Link: <a href={template.form_link} target="_blank" rel="noopener noreferrer">{template.form_link}</a></p>
                                        <p>Receive Communication: {template.receive_comminication}</p>
                                        <p>Document: {template.document}</p> */}
                                        <div dangerouslySetInnerHTML={{ __html: template.html_content }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='btn_dw'>
                            <button className='Down_pdf_Temp' onClick={downloadPDF}>Download Template</button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ViewLandingPageDescription;
