import React, { useState, useEffect, useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { FaLinkedin } from 'react-icons/fa'; // Import LinkedIn icon
import Hourglass from "../assets/Hourglass.gif";
import { Button, Alert, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const BenchmarkAsset = () => {
  const [emailData, setEmailData] = useState([]);
  const [emailDetail, setEmailDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailId, setEmailId] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://clientapi.benchmarkemail.com/Emails/";
  const AUTH_TOKEN = "CC8B8DDD-3AB1-4DEA-9852-94376A6C1A63"; // Replace with your actual token

  useEffect(() => {
    fetchEmailData();
  }, []);

  const fetchEmailData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "AuthToken": AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.Response && data.Response.Data) {
        setEmailData(data.Response.Data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch email details by ID and redirect to email template URL


  const columns = useMemo(
    () => [
      {
        accessorKey: "serial", // Serial number column
        header: "Sr.No.", // Column header
        Cell: ({ row }) => row.index + 1, // Display row index + 1 for serial number
        size: 50,
      },
      {
        accessorKey: "Name", // Email campaign name
        header: "Email Campaign",
        size: 150,
      },
      {
        accessorKey: "Subject", // Email subject
        header: "Subject",
        size: 200,
      },
      {
        accessorKey: "StatusText", // Email status
        header: "Status",
        size: 150,
      },
      {
        accessorKey: "CreatedDate", // Email created date
        header: "Created Date",
        size: 150,
      },
      {
        accessorKey: "FromName", // From name
        header: "From",
        size: 200,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div>
            <RemoveRedEyeIcon
              onClick={() => {
                navigate(`/benchmark/viewbenchmarkAsset/${row.original.ID}`);
              }}
              style={{ cursor: "pointer", color: "dark", marginRight: "15px" }}
            />
          </div>
        ),
        size: 100,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: emailData,
  });

  if (loading) return <div className="text-center mt-5"><img src={Hourglass} alt="" height={40} width={40} /></div>;

  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <div>
      <Card className="p-3">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <h5>Email Templates : </h5>
            <Link to={"https://app.benchmarkemail.com/emails/dashboard?from=login"} target="_blank" className="btn btn-warning mb-2">Add New +</Link>
          </div>
          <MaterialReactTable table={table} />
        </Card.Body>

        {emailDetail && (
          <Card.Body>
            <h5>Email Details:</h5>
            <p><strong>Name:</strong> {emailDetail.Name}</p>
            <p><strong>Subject:</strong> {emailDetail.Subject}</p>
            <p><strong>Status:</strong> {emailDetail.StatusText}</p>
            <p><strong>Created Date:</strong> {emailDetail.CreatedDate}</p>
            <p><strong>From:</strong> {emailDetail.FromName} ({emailDetail.FromEmail})</p>
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default BenchmarkAsset;
