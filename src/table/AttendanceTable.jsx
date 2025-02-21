import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import axios from 'axios';
import baseUrl from '../constant/ConstantApi';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Unauthorised from "../assets/401Unauthorised.png"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../redux/reducer/registeruser/UserDetails';


const AttendanceTable = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  // Fetch user details on component mount
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);
  // State to hold the login data
  const [loginData, setLoginData] = useState([]);
  // State to hold the filtered data
  const [filteredData, setFilteredData] = useState([]);
  // State to manage filters
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    userId: ''
  });


  const handleLogout = async () => {
    const userId = user?._id; // Get the user ID from the user object

    if (!userId) {
      alert('User ID is not available.'); // Handle case where user ID is not found
      return;
    }

    try {
      // Make the logout API request
      await axios.post(`${baseUrl}user/logout`, { userId });

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('timer');

      // Optionally, reset user state in Redux store if you have a slice for it
      // dispatch(logoutUser()); // Uncomment this if you have a logout action

      // Navigate to login page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    }
  };
  // Fetch data from the login API on component mount
  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await axios.get(`${baseUrl}user/getdailylogins`);
        const flattenedLoginData = []; // Array to hold flattened data
        let serialNumber = 1; // Initialize the serial number

        // Flatten the login data
        response.data.users.forEach((user) => {
          const loginTimes = user.loginTimes;
          const logoutTimes = user.logoutTimes;

          if (loginTimes.length > 0) {
            // Iterate through each login time
            for (let i = 0; i < loginTimes.length; i++) {
              const loginTime = new Date(loginTimes[i].timestamp);
              const logoutTime = i < logoutTimes.length ? new Date(logoutTimes[i]?.timestamp) : null; // Added optional chaining

              const inTime = loginTime.toLocaleTimeString();

              // Check if logoutTime is defined
              let totalWorkHours = 'N/A';
              let totalWorkHoursNum = 0;

              if (logoutTime && logoutTime > loginTime) {
                const hoursDiff = logoutTime - loginTime; // Difference in milliseconds
                const totalSeconds = Math.floor(hoursDiff / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                totalWorkHoursNum = hours + minutes / 60;
                totalWorkHours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
              }

              // Determine status based on total work hours
              let status = 'Absent ❌';
              let statusColor = '#FFCCCB';
              if (totalWorkHoursNum >= 10) {
                status = 'Good Job 👍';
                statusColor = '#77CDFF';
              } else if (totalWorkHoursNum >= 9) {
                status = 'Full-day';
                statusColor = '#FFFFE0';
              } else if (totalWorkHoursNum >= 5) {
                status = 'Half-day';
                statusColor = '#FFD700';
              }

              // Add flattened data for this login entry
              flattenedLoginData.push({
                serialNumber,
                username: user.username,
                date: loginTime.toLocaleDateString(),
                inTime,
                logoutDate: logoutTime ? logoutTime.toLocaleDateString() : 'N/A', // Added logout date
                outTime: logoutTime ? logoutTime.toLocaleTimeString() : 'N/A',
                totalWorkHours,
                status,
                statusColor,
                comments: '', // Placeholder for comments
                loginTime // Store the original login time for sorting
              });

              serialNumber++;
            }
          } else {
            // If no login data, push an inactive entry
            flattenedLoginData.push({
              serialNumber,
              username: user.username,
              date: 'N/A',
              inTime: 'N/A',
              logoutDate: 'N/A', // Set logout date to 'N/A'
              outTime: 'N/A',
              totalWorkHours: 'N/A',
              status: 'Inactive',
              statusColor: '#D3D3D3',
              comments: 'No login data available',
            });
            serialNumber++;
          }
        });

        // Sort data by date in descending order (most recent first)
        const sortedData = flattenedLoginData.sort((a, b) => {
          return new Date(b.loginTime) - new Date(a.loginTime);
        });

        setLoginData(sortedData); // Update state with sorted data
        setFilteredData(sortedData); // Initially, filtered data is the same as fetched data
      } catch (error) {
        // console.error('Error fetching login data', error);
        toast.error("Error fetching login data")
      }
    };

    


    fetchLoginData(); // Call the function to fetch login data
  }, []);
  const userType = localStorage.getItem("role");

  // Handle comment change for each row
  const handleCommentChange = (index, newComment) => {
    const updatedData = [...loginData];
    updatedData[index].comments = newComment;
    setLoginData(updatedData);
  };

  // Handle saving comments (example logic)
  const handleSaveComments = async (index) => {
    const updatedComment = loginData[index].comments;
    console.log(`Saving comment for ${loginData[index].username}: ${updatedComment}`);
  };

  // Define columns for the MaterialReactTable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'S.No',
        size: 50,
      },
      {
        accessorKey: 'username',
        header: 'Full Name',
        size: 200,
      },
      {
        accessorKey: 'date',
        header: 'Log-in Date',
        size: 150,
      },
      {
        accessorKey: 'inTime',
        header: 'In Time',
        size: 150,
      },
      {
        accessorKey: 'logoutDate', // Changed to logoutDate
        header: 'Log-out Date', // Updated header for logout date
        size: 150,
      },
      {
        accessorKey: 'outTime',
        header: 'Out Time',
        size: 150,
      },
      {
        accessorKey: 'totalWorkHours',
        header: 'Total Hrs',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => (
          <div style={{
            backgroundColor: cell.row.original.statusColor,
            textAlign: 'center',
            padding: '2px',
            borderRadius: '10px'
          }}>
            {cell.getValue()}
          </div>
        ),
      },
      // Uncomment if comments functionality is needed
      // {
      //   accessorKey: 'comments',
      //   header: 'Comments',
      //   size: 200,
      //   Cell: ({ cell, row }) => {
      //     const index = row.index;
      //     return (
      //       <div className='d-flex gap-1'>
      //         <textarea
      //           type="text"
      //           value={cell.getValue()}
      //           onChange={(e) => handleCommentChange(index, e.target.value)}
      //           style={{ width: '100%', height: "25px", border: "0.5px solid #243642" }}
      //         />
      //         <CheckCircleIcon style={{ cursor: 'pointer' }} onClick={() => handleSaveComments(index)} />
      //       </div>
      //     );
      //   },
      // },
    ],
    [loginData], // Add loginData to the dependencies to keep it updated
  );

  // Create the table using MaterialReactTable hook
  const table = useMaterialReactTable({
    columns,
    data: filteredData, // Use filtered data for table rendering
  });

  return (
    <>
      {userType === "admin" || userType === "hr" || userType === "oxmanager" ? <MaterialReactTable table={table} /> : <>
        <div className='text-center mt-2 '>
          <img src={Unauthorised} alt="unauthorised" width={400} height={300} />
          <p className='text-danger'>You do not have permission to view this content.</p>
        </div>
      </>

      }

    </>
  );
};

export default AttendanceTable;
