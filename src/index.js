import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import FirebaseContext from './contexts/Firebase';
import { firebase, FieldValue } from './lib/Firebase';

ReactDOM.render(
    <FirebaseContext.Provider value={{ firebase, FieldValue }}>
        <App />
    </FirebaseContext.Provider>,
    document.getElementById('root')
);