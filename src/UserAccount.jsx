
import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserAccount = () => {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img 
          src={user.photoURL} 
          alt="Profile" 
          style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
        />
        <span style={{ fontSize: '0.9rem' }}>{user.displayName}</span>
        <button 
          onClick={logout}
          style={{
            background: '#e53e3e',
            border: 'none',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={loginWithGoogle}
      style={{
        background: '#3182ce',
        border: 'none',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      Sign In with Google
    </button>
  );
};

export default UserAccount;
