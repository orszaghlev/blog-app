import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import * as ROUTES from '../constants/Routes';

export default function ProtectedRouteAdmin({ admin, user, children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (user?.uid === process.env.REACT_APP_FIREBASE_ADMIN_UID) {
                    return React.cloneElement(children, { admin });
                }
                if (!admin && user) {
                    return (
                        <Redirect
                            to={{
                                pathname: ROUTES.HOME,
                                state: { from: location }
                            }}
                        />
                    );
                }
                if (!admin && !user) {
                    return (
                        <Redirect
                            to={{
                                pathname: ROUTES.LOGIN,
                                state: { from: location }
                            }}
                        />
                    );
                }

                return null;
            }}
        />
    );
}

ProtectedRouteAdmin.propTypes = {
    admin: PropTypes.object,
    user: PropTypes.object,
    children: PropTypes.object.isRequired
};