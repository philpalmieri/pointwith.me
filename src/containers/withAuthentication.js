import React, {Component, useEffect, useState} from 'react';
import Delay from 'react-delay';
import store from 'store';

import { auth } from '../firebase';
import {useLocation, useNavigate} from 'react-router-dom';

export default WrappedComponent => {
  const WithAuthentication = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [providerData, setProviderData] = useState([]);

    useEffect(() => {
      auth.auth.onAuthStateChanged(user => {
        if (user) {
          setProviderData(user.providerData);
        } else {
          store.set('entryPoint', location.pathname);
          navigate('/');
        }
      });
    }, [])

    console.log('providerData', providerData);
    if (providerData.length > 0) {
      return (
          <WrappedComponent
              {...props}
              providerData={providerData}
          />
      )
    } else {
      return (
        <Delay wait={250}>
          <p>Loading...</p>
        </Delay>
      );
    }
  }

  return WithAuthentication;
};
