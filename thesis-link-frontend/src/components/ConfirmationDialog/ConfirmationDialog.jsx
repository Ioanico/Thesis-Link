import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import "./ConfirmationDialog.css";

const ConfirmationDialog = ({ open, title, onConfirm, onDeny, onClose }) => {
    return (
        <div id="confirmation-dialog">
            <Dialog
                PaperProps={{
                    sx: {
                        width: "240px",
                    },
                }}
                open={open}
                onClose={onClose}
                container={document.getElementById("confirmation-dialog")}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogActions>
                    <Button variant="contained" onClick={onConfirm}>
                        Yes
                    </Button>
                    <Button variant="contained" onClick={onDeny}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

ConfirmationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
