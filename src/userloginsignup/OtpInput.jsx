import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { setOtp, verifyOtp } from '../redux/reducer/registeruser/OtpVerify'; // Adjust the path as necessary
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyOtpInput = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const otp = useSelector(state => state.otp.otp);
    const error = useSelector(state => state.otp.error);
    const loading = useSelector(state => state.otp.loading);

    const handleChange = (code) => {
        dispatch(setOtp(code));
    };

    const handleSubmit = () => {
        dispatch(verifyOtp(otp))
            .unwrap()
            .then(() => {
                navigate("/dashboard");
            })
            .catch(() => {
                toast.error("Incorrect OTP. Please try again.");
            });
    };

    // Handle Enter Key Press
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="container">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="row">
                <div className="col-lg-12 d-flex justify-content-center align-items-center vh-100 p-5">
                    <div className="MyInput p-5">
                        <h5>Please Enter Your OTP...</h5>
                        {error && <p className="text-danger">{error}</p>}
                        <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            separator={<span style={{ width: "8px" }}></span>}
                            isInputNum={true}
                            shouldAutoFocus={true}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    onKeyDown={handleKeyDown}  // Added Enter key support
                                    style={{
                                        border: "1px solid transparent",
                                        borderRadius: "8px",
                                        width: "54px",
                                        height: "54px",
                                        fontSize: "12px",
                                        color: "#000",
                                        fontWeight: "400",
                                        caretColor: "blue",
                                        marginRight: "10px"
                                    }}
                                />
                            )}
                        />
                        <div className="text-center mt-3">
                            <Button
                                className="btn btn-danger btn-lg"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOtpInput;
