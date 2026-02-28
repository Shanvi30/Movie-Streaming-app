import React, { useState, useRef } from 'react'
import './Settings.css'
import Navbar from '../../components/Navbar/Navbar'
import { auth } from '../../firebase'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../firebase'

const Settings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  // Profile
  const [displayName, setDisplayName] = useState(
    localStorage.getItem('netflix_display_name') || auth.currentUser?.displayName || ''
  )
  const [avatar, setAvatar] = useState(localStorage.getItem('netflix_avatar') || '')
  const fileRef = useRef()

  // Password
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const isGoogleUser = auth.currentUser?.providerData?.some((p) => p.providerId === 'google.com')

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large! Max 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      setAvatar(base64)
      localStorage.setItem('netflix_avatar', base64)
      toast.success('Profile photo updated!')
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = () => {
    localStorage.setItem('netflix_display_name', displayName)
    toast.success('Profile saved!')
  }

  const changePassword = async () => {
    if (!newPwd || !confirmPwd) { toast.error('Fill all fields'); return }
    if (newPwd !== confirmPwd) { toast.error('Passwords do not match'); return }
    if (newPwd.length < 6) { toast.error('Password min 6 characters'); return }

    try {
      const user = auth.currentUser
      const credential = EmailAuthProvider.credential(user.email, currentPwd)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPwd)
      toast.success('Password updated!')
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className='settings-page'>
      <Navbar />
      <div className='settings-content'>
        <h1 className='settings-title'>⚙️ Settings</h1>

        <div className='settings-layout'>
          {/* Sidebar */}
          <div className='settings-sidebar'>
            <button
              className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >👤 Profile</button>
            <button
              className={`settings-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >🔒 Account</button>
            <button
              className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >🔔 Notifications</button>
            <button
              className='settings-nav-btn signout'
              onClick={() => { logout(); navigate('/login') }}
            >🚪 Sign Out</button>
          </div>

          {/* Content */}
          <div className='settings-body'>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className='settings-tab'>
                <h2>Profile Settings</h2>

                <div className='avatar-section'>
                  <img
                    src={avatar || 'https://via.placeholder.com/90?text=?'}
                    alt='avatar'
                    className='avatar-preview'
                  />
                  <div>
                    <button
                      className='change-photo-btn'
                      onClick={() => fileRef.current.click()}
                    >Change Photo</button>
                    <p className='avatar-hint'>Max 2MB, JPG or PNG</p>
                    <input
                      ref={fileRef}
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>

                <div className='form-group'>
                  <label>Display Name</label>
                  <input
                    type='text'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder='Your display name'
                  />
                </div>

                <div className='form-group'>
                  <label>Email</label>
                  <input
                    type='email'
                    value={auth.currentUser?.email || ''}
                    disabled
                  />
                </div>

                <button className='save-btn' onClick={saveProfile}>Save Changes</button>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className='settings-tab'>
                <h2>Account Settings</h2>

                {isGoogleUser ? (
                  <div className='google-info'>
                    <p>🟢 Signed in with Google</p>
                    <p>Password change is not available for Google accounts.</p>
                  </div>
                ) : (
                  <>
                    <h3>Change Password</h3>
                    <div className='form-group'>
                      <label>Current Password</label>
                      <input
                        type='password'
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        placeholder='Current password'
                      />
                    </div>
                    <div className='form-group'>
                      <label>New Password</label>
                      <input
                        type='password'
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        placeholder='New password (min 6 chars)'
                      />
                    </div>
                    <div className='form-group'>
                      <label>Confirm New Password</label>
                      <input
                        type='password'
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        placeholder='Confirm new password'
                      />
                    </div>
                    <button className='save-btn' onClick={changePassword}>Update Password</button>
                  </>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className='settings-tab'>
                <h2>Notification Preferences</h2>
                {[
                  'New releases in My List',
                  'Trending movies alerts',
                  'New episodes available',
                  'Recommendations for you',
                ].map((label) => (
                  <div key={label} className='notif-row'>
                    <span>{label}</span>
                    <label className='toggle'>
                      <input type='checkbox' defaultChecked />
                      <span className='slider'></span>
                    </label>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings