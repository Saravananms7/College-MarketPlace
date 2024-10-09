import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: 'Rohit', // Pre-filled data for testing
        email: '22cs789@mgits.ac.in',
        phone: '1234567890',
        role: 'Student',
        department: 'CSE',
        year: '2nd year',
    });
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
    const [isEditing, setIsEditing] = useState(false);
    const [profileUpdated, setProfileUpdated] = useState(false);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setProfileUpdated(true);
        setIsEditing(false); // Exit edit mode after profile update
        setTimeout(() => {
            setProfileUpdated(false); // Reset the success message after a few seconds
        }, 3000);
    };

    return (
        <div className="profile-section">
            <h2>Profile Section</h2>
            <div className="profile-header">
                <img src={profileImage} alt="Profile" className="profile-image" />
                {isEditing && (
                    <label className="upload-label">
                        Upload Photo
                        <input type="file" accept="image/*" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                    </label>
                )}
                <FaEdit 
                    className="edit-icon" 
                    onClick={() => setIsEditing(!isEditing)} 
                    title="Edit Profile" 
                />
            </div>
            {isEditing ? (
                <form onSubmit={handleProfileSubmit}>
                    <div>
                        <label>Name:</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={profileData.name} 
                            onChange={handleProfileChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={profileData.email} 
                            onChange={handleProfileChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            value={profileData.phone} 
                            onChange={handleProfileChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Role:</label>
                        <select 
                            name="role" 
                            value={profileData.role} 
                            onChange={handleProfileChange} 
                            required
                        >
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                        </select>
                    </div>
                    {profileData.role === 'Student' && (
                        <div>
                            <label>Year:</label>
                            <select 
                                name="year" 
                                value={profileData.year} 
                                onChange={handleProfileChange} 
                                required
                            >
                                <option value="">Select your year</option>
                                <option value="1st year">1st year</option>
                                <option value="2nd year">2nd year</option>
                                <option value="3rd year">3rd year</option>
                                <option value="4th year">4th year</option>
                            </select>
                        </div>
                    )}
                    <div>
                        <label>Department:</label>
                        <select 
                            name="department" 
                            value={profileData.department} 
                            onChange={handleProfileChange} 
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="CSE">CSE</option>
                            <option value="CSE-AI">CSE-AI</option>
                            <option value="CSE-CY">CSE-CY</option>
                            <option value="AIDS">AIDS</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="ME">ME</option>
                            <option value="CE">CE</option>
                            <option value="MCA">MCA</option>
                        </select>
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            ) : (
                <div className="profile-details">
                    <p><strong>Name:</strong> {profileData.name}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Phone:</strong> {profileData.phone}</p>
                    <p><strong>Role:</strong> {profileData.role}</p>
                    {profileData.role === 'Student' && <p><strong>Year:</strong> {profileData.year}</p>}
                    <p><strong>Department:</strong> {profileData.department}</p>
                </div>
            )}
            {profileUpdated && <p className="success-message">Profile updated successfully!</p>}
        </div>
    );
};

export default Profile;
