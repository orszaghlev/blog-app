import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import * as ROUTES from '../constants/Routes';

export default function ProtectedRouteAdmin({ admin, children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (admin) {
                    return React.cloneElement(children, { admin });
                }
                if (!admin) {
                    return (
                        <Redirect
                            to={{
                                pathname: ROUTES.HOME,
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
    admin: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
};