import { Grid } from "@material-ui/core";

export default function ShowFavoritePosts({ user }) {
    return (
        <Grid container
            direction="column"
            justify="center"
            alignItems="center">
            <h5>{user?.favoritePosts.length === 0 ? "Jelenleg nincsenek kedvenc bejegyzései!" : "Kedvenc bejegyzések: " + user?.favoritePosts}</h5>
        </Grid>
    )
}