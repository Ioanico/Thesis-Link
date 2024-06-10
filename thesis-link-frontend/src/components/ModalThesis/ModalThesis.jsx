import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Tooltip,
} from "@mui/material";
import Dropzone from "react-dropzone";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import PropTypes from "prop-types";
import "./ModalThesis.css";

const ModalThesis = ({
    open,
    thesisInfo,
    setThesisInfo,
    handleInputChange,
    handleClose,
    handleDateChange,
    handleSubmit,
}) => {
    return (
        <div id="modal-thesis">
            <Dialog
                open={open}
                onClose={handleClose}
                disablePortal
                PaperProps={{
                    sx: {
                        width: "35%",
                    },
                }}
            >
                <DialogContent className="dialog-content">
                    {thesisInfo.image ? (
                        <Tooltip
                            title="Click here to change image"
                            onClick={() => {
                                setThesisInfo({ ...thesisInfo, image: null });
                            }}
                        >
                            <img
                                src={URL.createObjectURL(thesisInfo.image)}
                            ></img>
                        </Tooltip>
                    ) : (
                        <Dropzone
                            accept={{
                                "image/*": [],
                            }}
                            multiple={false}
                            maxFiles={1}
                            onDrop={(files) => {
                                setThesisInfo({
                                    ...thesisInfo,
                                    image: files[0],
                                });
                            }}
                            onDropRejected={(error) => console.error(error)}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div id="dropzone" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className="dropzone-container">
                                        <ImageIcon />
                                        <span>
                                            Click to upload or drag and drop
                                        </span>
                                        <span>JPG, JPEG, PNG</span>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                    )}
                    <TextField
                        type="text"
                        label="Thesis title"
                        name="title"
                        value={thesisInfo.title}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        type="text"
                        label="Description"
                        name="description"
                        multiline
                        minRows={3}
                        maxRows={10}
                        value={thesisInfo.description}
                        onChange={handleInputChange}
                        required
                    />
                    <DateTimePicker
                        label="Deadline"
                        name="deadline"
                        value={thesisInfo.deadline}
                        onChange={(newValue) => handleDateChange(newValue)}
                        required
                    />
                    {thesisInfo.file ? (
                        <div className="uploaded-file">
                            <PictureAsPdfIcon />
                            <span>{thesisInfo.file.name}</span>
                            <IconButton
                                onClick={() =>
                                    setThesisInfo({ ...thesisInfo, file: null })
                                }
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    ) : (
                        <Dropzone
                            accept={{
                                "application/pdf": [".pdf"],
                            }}
                            multiple={false}
                            maxFiles={1}
                            onDrop={(files) => {
                                setThesisInfo({
                                    ...thesisInfo,
                                    file: files[0],
                                });
                            }}
                            onDropRejected={(error) => console.error(error)}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div id="dropzone" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className="dropzone-container">
                                        <PictureAsPdfIcon />
                                        <span>
                                            Click to upload or drag and drop
                                        </span>
                                        <span>PDF Only</span>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

ModalThesis.propTypes = {
    open: PropTypes.bool.isRequired,
    thesisInfo: PropTypes.object.isRequired,
    setThesisInfo: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleDateChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

export default ModalThesis;
