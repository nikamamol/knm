import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Card, Spinner, Alert } from "react-bootstrap";
import DOMPurify from "dompurify";

const API_URL = "https://clientapi.benchmarkemail.com/Emails/";
const AUTH_TOKEN = "CC8B8DDD-3AB1-4DEA-9852-94376A6C1A63"; // Replace with your actual token

function ViewAsset() {
  const { id } = useParams();
  const [emailDetail, setEmailDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmailById(id);
  }, [id]);

  const fetchEmailById = async (emailId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}${emailId}`, {
        method: "GET",
        headers: {
          AuthToken: AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.Response?.Data) {
        setEmailDetail(data.Response.Data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render loading, error or data
  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  if (!emailDetail) return null; // Or show a "No Data" message if you prefer

  const { 
    ID, Name, Subject, CreatedDate, ModifiedDate, Timezone, Timestamp,
    AddressCity, AddressState, AddressZip, InternationalAddress, Badge,
    GoogleAnalyticsCampagin, CampaignID, EmailType, TemplateId, TemplateUsername,
    LayoutId, PermissionPosition, HeaderMessage, PermissionReminder,
    PreDemarcFromEmail, ToEmail, UnsubscribeText, Description, TemplateCode, Templatetext 
  } = emailDetail;

  const renderContent = (content, label) => (
    content ? (
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
    ) : (
      <p className="text-muted">{label}</p>
    )
  );

  return (
    <Container fluid className="my-5">
      <Row>
        <Col lg={3}></Col>
        <Col lg={8}>
          <Card className="p-4 shadow-lg">
            <h4 className="fw-bold py-3  border-bottom">View Asset</h4>

            <Row className="mt-3">
              <Col md={6}>
                <h5 className="text-secondary">General Information</h5>
                <hr />
                {[
                  { label: "ID", value: ID },
                  { label: "Name", value: Name },
                  // { label: "Status", value: Status },
                  { label: "Subject", value: Subject },
                  { label: "Created Date", value: CreatedDate },
                  { label: "Modified Date", value: ModifiedDate },
                  { label: "Timezone", value: Timezone },
                  { label: "Timestamp", value: Timestamp }
                ].map(({ label, value }) => (
                  <p key={label}><strong>{label}:</strong> {value}</p>
                ))}

                <h5 className="mt-4 text-secondary">Address Details</h5>
                <hr />
                {[
                  { label: "City", value: AddressCity },
                  { label: "State", value: AddressState },
                  { label: "Zip", value: AddressZip },
                  { label: "International Address", value: InternationalAddress }
                ].map(({ label, value }) => (
                  <p key={label}><strong>{label}:</strong> {value}</p>
                ))}

                <h5 className="mt-4 text-secondary">Additional Info</h5>
                <hr />
                <p><strong>Badge:</strong> {Badge}</p>
                <p><strong>Google Analytics Campaign:</strong> {GoogleAnalyticsCampagin}</p>
                <Card className="p-3 bg-light mt-2">
                  <h6>Unsubscribe Text</h6>
                  {renderContent(UnsubscribeText, "No unsubscribe text available")}
                </Card>
              </Col>

              <Col>
                <h5 className="text-secondary">Campaign Details</h5> 
                <hr />
                {[
                  { label: "Campaign ID", value: CampaignID },
                  { label: "Email Type", value: EmailType },
                  { label: "Template ID", value: TemplateId },
                  { label: "Template Username", value: TemplateUsername },
                  { label: "Layout ID", value: LayoutId }
                ].map(({ label, value }) => (
                  <p key={label}><strong>{label}:</strong> {value}</p>
                ))}
                
                <h5 className="mt-4 text-secondary">Layout & Permission</h5>
                <hr />
                <p>
                  <strong>Permission Position:</strong>
                  {renderContent(PermissionPosition, "No permission position available")}
                </p>

                <Card className="p-3 bg-light">
                  <h6>Header Message</h6>
                  {renderContent(HeaderMessage, "No header message available")}
                </Card>

                <div className="mt-2">
                  {[
                    { label: "Permission Reminder", value: PermissionReminder },
                    { label: "PreDemarc From Email", value: PreDemarcFromEmail },
                    { label: "To Email", value: ToEmail }
                  ].map(({ label, value }) => (
                    <p key={label}><strong>{label}:</strong> {value}</p>
                  ))}
                </div>

                <h5 className="mt-4">Description</h5>
                <Card className="p-3 bg-light">
                  <p>{Description}</p>
                </Card>
              </Col>

              <Col className="mt-4">
              <hr />
                <h5 className="text-secondary">Template Content</h5>
                <Card className="p-3 bg-light">
                  {TemplateCode ? (
                    <div dangerouslySetInnerHTML={{ __html: TemplateCode }} />
                  ) : (
                    <p className="text-muted">No template content available.</p>
                  )}
                </Card>
                {/* <h5 className="mt-4 text-secondary">Template Text</h5>
                <Card className="p-3 bg-light">
                  <p>{Templatetext}</p>
                </Card> */}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewAsset;
