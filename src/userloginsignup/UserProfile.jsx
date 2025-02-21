// src/components/UserProfile.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../redux/reducer/registeruser/UserDetails';


const UserProfile = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUserDetails());
    }, [dispatch]);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading user details...</p>
            ) : user ? (
                <div>
                    {/* <h1>User Profile</h1> */}
                    <p>Email: {user.email}</p>
                    <p>Name: {user.username}</p>
                </div>
            ) : (
                <p>No user details available.</p>
            )}
        </div>
    );
};

export default UserProfile;
