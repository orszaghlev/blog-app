import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/Routes';

export default function ShowProfile({ user }) {
    const history = useHistory();
    const date = new Date(parseInt(user?.dateCreated));

    return (
        <>
            <div>
                <h2 data-testid="profile-title">Profil</h2>
            </div>
            <hr />
            <h5 data-testid="user-data">Felhasználó adatai</h5>
            <p data-testid="user-username">Felhasználónév: {user?.username}</p>
            <p data-testid="user-fullname">Teljes név: {user?.fullName}</p>
            <p data-testid="user-email">E-mail cím: {user?.emailAddress}</p>
            <p data-testid="user-date">Regisztráció dátuma: {date?.toLocaleDateString() + " " + date?.toLocaleTimeString()}</p>
            <Grid>
                <Button data-testid="profile-edit" variant="contained" onClick={() => {
                    history.push(ROUTES.PROFILE_EDIT);
                }}>
                    Adatok szerkesztése
                </Button>
            </Grid>
        </>
    )
}

ShowProfile.propTypes = {
    user: PropTypes.object.isRequired
};