import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardMedia,
    Fab,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./Dashboard.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MediaCard from "../../components/MediaCard/MediaCard";
import { AuthContext } from "../../utils/AuthProvider";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";
import ModalThesis from "../../components/ModalThesis/ModalThesis";
import dayjs from "dayjs";
import ModalViewThesis from "../../components/ModalViewThesis/ModalViewThesis";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [theses, setTheses] = useState([]);
    const [studentHasThesis, setStudentHasThesis] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState({});
    const [tutorsView, setTutorsView] = useState(false);
    const [tutors, setTutors] = useState([]);
    const [thesisInfo, setThesisInfo] = useState({
        title: "",
        description: "",
        deadline: null,
        file: null,
        image: null,
    });

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user._id) return;
        axios.get("http://localhost:3000/theses").then((response) => {
            setTheses(response.data);
        });
        axios.get("http://localhost:3000/theses/my").then((response) => {
            setStudentHasThesis(response.data.assigned);
        });
    }, [user]);

    useEffect(() => {
        if (!tutorsView) return;

        axios.get("http://localhost:3000/users/tutors").then((response) => {
            setTutors(response.data);
        });
    }, [tutorsView]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        setThesisInfo({ ...thesisInfo, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setThesisInfo({ ...thesisInfo, deadline: date });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/theses/${id}`).then(() => {
            setSelectedThesis({});
            setOpenConfirmation(false);
            axios.get("http://localhost:3000/theses").then((response) => {
                setTheses(response.data);
            });
        });
    };

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("title", thesisInfo.title);
        formData.append("description", thesisInfo.description);
        formData.append("deadline", thesisInfo.deadline);
        formData.append("created_by", user._id);
        formData.append("image", thesisInfo.image);
        formData.append("file", thesisInfo.file);

        isEmpty(selectedThesis)
            ? axios
                  .post("http://localhost:3000/theses", formData, {
                      headers: {
                          "Content-Type": "multipart/form-data",
                      },
                  })
                  .then(() => {
                      axios
                          .get("http://localhost:3000/theses")
                          .then((response) => {
                              setTheses(response.data);
                          });
                      setOpen(false);
                  })
            : axios
                  .put(
                      `http://localhost:3000/theses/${selectedThesis._id}`,
                      formData,
                      {
                          headers: {
                              "Content-Type": "multipart/form-data",
                          },
                      }
                  )
                  .then(() => {
                      axios
                          .get("http://localhost:3000/theses")
                          .then((response) => {
                              setTheses(response.data);
                          });
                      setOpen(false);
                  });
    };

    return (
        <div id="dashboard-page">
            <Header />
            <div
                className="content"
                style={{
                    flexDirection: tutorsView ? "column" : "row",
                    gap: tutorsView ? 8 : 32,
                }}
            >
                {!tutorsView
                    ? theses.map((thesis) => (
                          <div key={thesis._id} className="thesis">
                              <MediaCard
                                  thesis={thesis}
                                  canExpand={
                                      user.role === "tutor" ||
                                      !studentHasThesis ||
                                      thesis.assigned_to?._id === user._id
                                  }
                                  onExpand={() => {
                                      setSelectedThesis(thesis);
                                      setOpenView(true);
                                  }}
                                  onEdit={() => {
                                      setSelectedThesis(thesis);
                                      setThesisInfo({
                                          title: thesis.title,
                                          description: thesis.description,

                                          deadline: dayjs(thesis.deadline),
                                      });
                                      setOpen(true);
                                  }}
                                  onDelete={() => {
                                      setSelectedThesis(thesis);
                                      setOpenConfirmation(true);
                                  }}
                              />
                          </div>
                      ))
                    : tutors.map((tutor) => (
                          <Accordion key={tutor._id} className="accordion">
                              <AccordionSummary
                                  expandIcon={<ArrowDropDownIcon />}
                              >
                                  <Typography>
                                      {tutor.first_name} {tutor.last_name}
                                  </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                  {tutor.theses.map((thesis) => (
                                      <div key={thesis._id}>
                                          <Card
                                              sx={{
                                                  display: "flex",
                                                  padding: "16px",
                                                  marginBottom: "16px",
                                                  cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                  setSelectedThesis({
                                                      ...thesis,
                                                      created_by: tutor,
                                                  });
                                                  setOpenView(true);
                                              }}
                                          >
                                              <CardMedia
                                                  component="img"
                                                  sx={{
                                                      height: "100px",
                                                      width: "unset",
                                                  }}
                                                  image={`http://localhost:3000/images/${thesis.image}`}
                                              />
                                              <Box
                                                  sx={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      justifyContent: "center",
                                                      marginLeft: "16px",
                                                  }}
                                              >
                                                  <Typography variant="h4">
                                                      {thesis.title}
                                                  </Typography>
                                              </Box>
                                          </Card>
                                      </div>
                                  ))}
                              </AccordionDetails>
                          </Accordion>
                      ))}
                {user.role === "student" && (
                    <Button
                        name={tutorsView ? "Theses" : "Tutors"}
                        color="secondary"
                        className="tutors-btn"
                        variant="text"
                        onClick={() => setTutorsView(!tutorsView)}
                        startIcon={
                            tutorsView ? <ArticleIcon /> : <PeopleIcon />
                        }
                    >
                        {tutorsView ? "Theses" : "Tutors"}
                    </Button>
                )}
                {user.role === "tutor" && (
                    <Fab
                        className="add-btn"
                        color="secondary"
                        size="large"
                        onClick={() => {
                            setSelectedThesis({});
                            setThesisInfo({
                                title: "",
                                description: "",
                                deadline: null,
                                file: null,
                                image: null,
                            });
                            setOpen(true);
                        }}
                    >
                        <AddIcon />
                    </Fab>
                )}
            </div>
            <ModalThesis
                open={open}
                handleClose={handleClose}
                thesisInfo={thesisInfo}
                setThesisInfo={setThesisInfo}
                handleInputChange={handleInputChange}
                handleDateChange={handleDateChange}
                handleSubmit={handleSubmit}
            />
            <ModalViewThesis
                open={openView}
                handleClose={() => setOpenView(false)}
                thesis={selectedThesis}
                onSubmit={() => {
                    axios
                        .get("http://localhost:3000/theses")
                        .then((response) => {
                            setTheses(response.data);
                        });
                }}
            />
            <ConfirmationDialog
                open={openConfirmation}
                title={"Are you sure?"}
                onConfirm={() => handleDelete(selectedThesis._id)}
                onDeny={() => setOpenConfirmation(false)}
                onClose={() => setOpenConfirmation(false)}
            />
        </div>
    );
};

export default Dashboard;
