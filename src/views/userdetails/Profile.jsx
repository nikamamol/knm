import  { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import UserProfile from "../../assets/man.webp";
import axios from 'axios';
import baseUrl from '../../constant/ConstantApi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../../redux/reducer/registeruser/UserDetails';
// import { fetchUserDetails } from '../redux/reducer/registeruser/UserDetails';

function Profile() {
  // const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
      dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${baseUrl}user/getuserProfile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const previewImage = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const output = document.getElementById('uploadedAvatar');
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const resetPage = () => {
    // Implement your reset logic here
  };

  return (
    <div>
      <Container fluid className="mt-5">
        <Row>
          <Col lg={3}></Col>
          <Col lg={8}>
            <div className="row">
              <div className="col-xxl">
                <div className='bgColor rounded-3 shadow'>
                  <h4 className='fw-bold py-3 ms-3 text_color'>User Profile</h4>
                </div>
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="align-items-start align-items-sm-center">
                        <img
                          src={user ? user.profilePicture || UserProfile : UserProfile}
                          alt="user-avatar"
                          className="d-block rounded-pill ms-3"
                          height="150"
                          width="150"
                          id="uploadedAvatar"
                        />
                        <div className='text-center mt-2'>
                          <label htmlFor="upload" className="btn btn-outline-primary me-2 mb-2" tabIndex="0">
                            <span className="d-none d-sm-block">Change Profile Picture</span>
                            <i className="bx bx-upload d-block d-sm-none"></i>
                            <input
                              type="file"
                              id="upload"
                              className="account-file-input"
                              name="profile_photo"
                              hidden
                              accept="image/*"
                              onChange={previewImage}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-0" />
                  <div className="card-body">
                    <input type="hidden" id="id" name="id" value={user ? user._id : ""} />
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="fullname">Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullname"
                          name="fullname"
                          value={user ? user.username : ""}
                          placeholder="John Doe"
                          aria-label="John Doe"
                          aria-describedby="basic-icon-default-fullname2"
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="basic-icon-default-phone">Phone No <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          onInput={(e) => {
                            if (e.target.value.length > e.target.maxLength) e.target.value = e.target.value.slice(0, e.target.maxLength);
                          }}
                          maxLength="12"
                          name="mobile"
                          required
                          id="mobile"
                          className="form-control phone-mask"
                          placeholder="658 799 8941"
                          aria-label="658 799 8941"
                          aria-describedby="basic-icon-default-phone2"
                          value={user ? user.mobile : ""}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="basic-icon-default-email">Email <span className="text-danger">*</span></label>
                        <input
                          type="email"
                          required
                          name="email"
                          id="email"
                          className="form-control"
                          placeholder="john.doe@domain.com"
                          aria-label="john.doe"
                          aria-describedby="basic-icon-default-email2"
                          value={user ? user.email : ""}
                        />
                        
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="basic-icon-default-role">Role <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          required
                          name="role"
                          id="role"
                          className="form-control"
                          placeholder="Admin"
                          style={{ textTransform: "capitalize" }}
                          // aria-label="john.doe"
                          aria-describedby="basic-icon-default-role2"
                          value={user ? user.role : ""}
                        />
                        
                      </div>
                      {/* Additional fields go here */}
                      <div className="row text-center">
                        <div>
                          <button type="submit" name="button_2" value="button_2" className="btn btn-danger me-2">Save</button>
                          <button type="button" id="reset" onClick={resetPage} className="btn btn-outline-secondary">Clear</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
