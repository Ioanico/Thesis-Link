import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import "./ModalViewThesis.css";
import PropTypes from "prop-types";
import React from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Dropzone from "react-dropzone";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import axios from "axios";
import { AuthContext } from "../../utils/AuthProvider";

const ModalViewThesis = ({ open, handleClose, thesis, onSubmit }) => {
    const { user } = React.useContext(AuthContext);
    const [studentFile, setStudentFile] = React.useState(null);
    const [mentions, setMentions] = React.useState(thesis.mentions || "");
    const [grade, setGrade] = React.useState(thesis.grade || "");

    React.useEffect(() => {
        setMentions(thesis.mentions || "");
        setGrade(thesis.grade || "");
    }, [thesis]);

    const handleSubmit = () => {
        const formData = new FormData();

        if (user.role == "student") {
            formData.append("assigned_to", user._id);
            studentFile && formData.append("student_upload", studentFile);
        }

        if (user.role === "tutor") {
            formData.append("mentions", mentions);
            formData.append("grade", grade);
        }

        axios
            .put(
                `http://localhost:3000/theses/student/${thesis._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then(() => {
                handleClose();
                onSubmit();
                setStudentFile(null);
            });
    };

    const downloadFile = async (thesisId, file) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/theses/${thesisId}/download/${file}`,
                {
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", dirtyStripper(file));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const dirtyStripper = (filename) => {
        const parts = filename.split("-");
        return parts.slice(2).join("-");
    };

    const isTutorOrIsAssigned = () => {
        return (
            user.role === "tutor" ||
            (thesis.assigned_to && thesis.assigned_to._id === user._id)
        );
    };

    return (
        <div id="modal-view-thesis">
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
                <DialogTitle>
                    {thesis.image && (
                        <img
                            style={{ width: "100%" }}
                            src={`http://localhost:3000/images/${thesis.image}`}
                            alt="thesis"
                        />
                    )}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6">
                        {thesis.created_by
                            ? `Prof. ${thesis.created_by.first_name} ${thesis.created_by.last_name}`
                            : null}
                    </Typography>
                    <Typography variant="h4">{thesis.title}</Typography>
                    <Typography variant="body1" sx={{ margin: "24px 0" }}>
                        {thesis.description}
                    </Typography>
                    <div className="uploaded-file">
                        {(user.role === "student" ||
                            (user.role === "tutor" &&
                                thesis.student_upload)) && (
                            <PictureAsPdfIcon color="primary" />
                        )}
                        <Link
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                                downloadFile(
                                    thesis._id,
                                    user.role === "student"
                                        ? thesis.file
                                        : thesis.student_upload
                                )
                            }
                        >
                            {user.role === "student"
                                ? thesis.file && dirtyStripper(thesis.file)
                                : thesis.student_upload &&
                                  dirtyStripper(thesis.student_upload)}
                        </Link>
                    </div>
                    {user.role === "student" ? (
                        studentFile || thesis.student_upload ? (
                            <div
                                className="uploaded-file"
                                style={{ marginTop: 16 }}
                            >
                                <PictureAsPdfIcon color="primary" />
                                <Link
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                        thesis.student_upload &&
                                            downloadFile(
                                                thesis._id,
                                                thesis.student_upload
                                            );
                                    }}
                                >
                                    {studentFile
                                        ? studentFile.name
                                        : dirtyStripper(thesis.student_upload)}
                                </Link>
                                <IconButton
                                    color="primary"
                                    disabled={!!thesis.student_upload}
                                    onClick={() => setStudentFile(null)}
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
                                    setStudentFile(files[0]);
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
                        )
                    ) : (
                        <React.Fragment>
                            {thesis.assigned_to && (
                                <Typography
                                    className="uploaded-by"
                                    variant="body1"
                                >{`Uploaded by: ${thesis.assigned_to.first_name} ${thesis.assigned_to.last_name}`}</Typography>
                            )}
                        </React.Fragment>
                    )}
                    <DateTimePicker
                        className="date-picker"
                        label="Deadline"
                        defaultValue={dayjs(thesis.deadline)}
                        disabled
                    />
                    {isTutorOrIsAssigned() && (
                        <div className="grade-section">
                            <TextField
                                label="Mentions"
                                value={mentions}
                                disabled={
                                    !thesis.student_upload ||
                                    user.role === "student"
                                }
                                onChange={(e) => setMentions(e.target.value)}
                                multiline
                                minRows={3}
                            />
                            <TextField
                                required
                                label="Grade"
                                type="number"
                                value={grade}
                                disabled={
                                    !thesis.student_upload ||
                                    user.role === "student"
                                }
                                onChange={(e) => setGrade(e.target.value)}
                                inputProps={{ min: 0, max: 10 }}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        className="submit-button"
                        variant="contained"
                        disabled={
                            user.role === "student"
                                ? !studentFile
                                : thesis.student_upload
                                ? !grade
                                : true
                        }
                        onClick={handleSubmit}
                    >
                        {user.role === "student" ? "Submit" : "Done"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

ModalViewThesis.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    thesis: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ModalViewThesis;
