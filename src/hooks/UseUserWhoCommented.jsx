import { useState, useEffect } from 'react';
import { getUserByUsername } from '../services/Firebase';
import PropTypes from 'prop-types';

export default function useUserWhoCommented(username) {
    const [activeUser, setActiveUser] = useState();

    useEffect(() => {
        async function getUserObjByUsername(username) {
            const [user] = await getUserByUsername(username);
            setActiveUser(user || {});
        }

        if (username) {
            getUserObjByUsername(username);
        }
    }, [username]);

    return { user: activeUser };
}

useUserWhoCommented.propTypes = {
    username: PropTypes.string.isRequired
};