import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React from "react";
import "./MediaCard.css";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthProvider";

function MediaCard({ thesis, onExpand, canExpand, onEdit, onDelete }) {
    const { user } = useContext(AuthContext);

    const displayCheckIcon = () => {
        if (user.role === "tutor" && thesis.assigned_to) {
            return true;
        }
        if (thesis.assigned_to && thesis.assigned_to._id === user._id) {
            return true;
        }
        return false;
    };

    return (
        <div id="media-card">
            <Card sx={{ width: 345, overflow: "hidden" }}>
                <CardMedia
                    sx={{ height: 140, backgroundPosition: "top" }}
                    image={
                        thesis.image
                            ? `http://localhost:3000/images/${thesis.image}`
                            : "https://placehold.co/345x140"
                    }
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {thesis.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        component="div"
                    >
                        {thesis.created_by
                            ? `Prof. ${thesis.created_by.first_name} ${thesis.created_by.last_name}`
                            : ""}
                    </Typography>
                </CardContent>
                <CardActions className="card-actions">
                    {displayCheckIcon() && (
                        <CheckIcon
                            sx={{
                                marginRight: "auto",
                                color: thesis.grade ? "green" : "#EF5350",
                            }}
                        />
                    )}
                    {canExpand && (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={onExpand}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    )}
                    {user.role === "tutor" && (
                        <React.Fragment>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={onEdit}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={onDelete}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </React.Fragment>
                    )}
                </CardActions>
            </Card>
        </div>
    );
}

MediaCard.propTypes = {
    thesis: PropTypes.object.isRequired,
    onExpand: PropTypes.func.isRequired,
    canExpand: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default MediaCard;
