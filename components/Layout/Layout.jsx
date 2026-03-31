import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && <Toaster position="bottom-right" />}
      <Navbar />
      <main className="app-container">
        {children}
      </main>
    </>
  );
};

export default Layout;
