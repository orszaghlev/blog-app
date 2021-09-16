import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import { HelmetProvider } from "react-helmet-async";
import FirebaseContext from './contexts/Firebase';
import { firebase, FieldValue } from './lib/Firebase';

ReactDOM.render(
    <FirebaseContext.Provider value={{ firebase, FieldValue }}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </FirebaseContext.Provider>,
  document.getElementById('root')
);
