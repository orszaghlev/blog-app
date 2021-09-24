import PropTypes from 'prop-types';

export default function ShowProfile({ user }) {
    const date = new Date(parseInt(user?.dateCreated));

    return (
        <>
            <div>
                <h2>Profil</h2>
            </div>
            <hr />
            <h5>Felhasználó adatai</h5>
            <p>Felhasználónév: {user?.username}</p>
            <p>Teljes név: {user?.fullName}</p>
            <p>E-mail cím: {user?.emailAddress}</p>
            <p>Regisztráció dátuma: {date.toLocaleDateString() + " " + date.toLocaleTimeString()}</p>
        </>
    )
}

ShowProfile.propTypes = {
    user: PropTypes.object.isRequired
};