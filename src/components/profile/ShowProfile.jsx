import PropTypes from 'prop-types';
import { Grid } from "@material-ui/core";

export default function ShowProfile({user}) {
    const date = new Date(parseInt(user?.dateCreated));

    return (
        <>
            <div>
                <h2>Profil</h2>
            </div>
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                <p>Felhasználónév: {user?.username}</p>
                <p>Teljes név: {user?.fullName}</p>
                <p>E-mail cím: {user?.emailAddress}</p>
                <p>Profil létrehozásának dátuma: {date.toLocaleDateString() + " " + date.toLocaleTimeString()}</p>
                <p>{user?.favoritePosts.length === 0 ? "Jelenleg nincsenek kedvenc bejegyzései!" : "Kedvenc bejegyzések: " + user?.favoritePosts}</p>
            </Grid>
        </>
    )
}

ShowProfile.propTypes = {
    user: PropTypes.object.isRequired
};