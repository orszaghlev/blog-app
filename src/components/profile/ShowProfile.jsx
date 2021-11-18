import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/Routes';

export default function ShowProfile({ user, isTabletOrMobile }) {
    const history = useHistory();
    const date = new Date(parseInt(user?.dateCreated));

    return (
        <>
            <div>
                <h2>Profil</h2>
            </div>
            <hr className="mx-auto" style={{ width: isTabletOrMobile ? 250 : 700 }} />
            <h5>Felhasználó adatai</h5>
            <p>Felhasználónév: {user?.username}</p>
            <p>Teljes név: {user?.fullName}</p>
            <p>E-mail cím: {user?.emailAddress}</p>
            <p>Regisztráció dátuma: {date?.toLocaleDateString() + " " + date?.toLocaleTimeString()}</p>
            <Grid>
                <Button data-testid="profile-edit" color="secondary" onClick={() => {
                    history.push(ROUTES.PROFILE_EDIT);
                }}>
                    Adatok szerkesztése
                </Button>
            </Grid>
        </>
    )
}

ShowProfile.propTypes = {
    user: PropTypes.object,
    isTabletOrMobile: PropTypes.bool.isRequired
};