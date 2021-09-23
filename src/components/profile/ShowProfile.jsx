import PropTypes from 'prop-types';
import { Grid } from "@material-ui/core";

export default function ShowProfile({ user }) {
    const date = new Date(parseInt(user?.dateCreated));

    return (
        <>
            <div>
                <h2>Profil</h2>
            </div>
            <hr />
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                <h5>Felhasználó adatai</h5>
                <p>Felhasználónév: {user?.username}</p>
                <p>Teljes név: {user?.fullName}</p>
                <p>E-mail cím: {user?.emailAddress}</p>
                <p>Profil létrehozásának dátuma: {date.toLocaleDateString() + " " + date.toLocaleTimeString()}</p>
            </Grid>
        </>
    )
}

ShowProfile.propTypes = {
    user: PropTypes.object.isRequired
};