/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import './Homepage.css';
import withAuth from '../withAuth';

const Homepage = () => {

  return (
    <>
    </>
  );
};

const AuthenticatedHomepage = withAuth(Homepage);
export default AuthenticatedHomepage;