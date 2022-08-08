import {useEffect, useState} from "react";
import {
    Avatar, Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse, Grid,
    IconButton, List, ListItem, ListItemAvatar, ListItemText,
    styled,
    Typography
} from "@mui/material";
import {ExpandMore as ExpandMoreIcon} from "@mui/icons-material";
import * as PropTypes from "prop-types";

function Masonry(props) {
    return null;
}

Masonry.propTypes = {
    container: PropTypes.bool,
    spacing: PropTypes.number,
    children: PropTypes.node
};

function App() {
    const [roomStats, setRoomStats] = useState(null);
    const [expanded, setExpanded] = useState({});

    const ExpandMore = styled((props) => {
        const {expand, ...other} = props;
        return <IconButton {...other} />;
    })(({theme, expand}) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    useEffect(() => {
        populateRoomStats();
    }, []);

    const handleExpandClick = (event) => {
        const key = event.target.closest(".roomCard").attributes["data-key"].nodeValue;
        const newExpanded = {...expanded};

        if (newExpanded[key] === undefined) {
            newExpanded[key] = true;
        } else {
            newExpanded[key] = !newExpanded[key];
        }

        setExpanded(newExpanded);
    }

    const populateRoomStats = async () => {
        const response = await fetch("https://jqbx.fm/active-rooms/0");
        const json = await response.json();

        setRoomStats(json);
    }

    return (
        <Masonry columns={{ xs: 2, md: 3, lg: 4, xl: 6}}>
            {roomStats !== null && roomStats.rooms.map((room) => (
                <Card className="roomCard" key={room._id} data-key={room._id}>
                    <CardHeader title={room.title} subheader={room.genre}/>
                    {room.tracks.length > 0 && (
                        <>
                            <CardMedia component="img" image={room.tracks[0].album.images[0].url}/>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {room.tracks[0].artists[0].name + " - " + room.tracks[0].album.name}
                                </Typography>
                            </CardContent>
                        </>
                    )}
                    <CardActions disableSpacing>
                        <Typography>Users ({room.usersCount})</Typography>
                        <ExpandMore expand={expanded[room._id]} onClick={handleExpandClick}
                                    aria-expanded={expanded[room._id]} aria-label="Show Users">
                            <ExpandMoreIcon/>
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expanded[room._id]} timeout="auto" unmountOnExit>
                        <CardContent>
                            <List>
                                {room.users.map((user) => (
                                    <ListItem key={user._id}>
                                        <ListItemAvatar>
                                            <Avatar alt={user.username} src={user.image}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.username}/>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Collapse>
                </Card>
            ))}
        </Masonry>
    );
}

export default App;
