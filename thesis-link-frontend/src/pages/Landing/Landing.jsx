import { Button } from "@mui/material";
import Logo from "../../assets/logo_trnspr.png";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div id="landing-page">
            <div className="logo">
                <img src={Logo} />
            </div>
            <div className="content">
                <span className="landing-text">
                    Unlocking your potential through seamless connections with
                    knowledgeable Tutors.
                </span>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/login")}
                >
                    Dive in
                </Button>
            </div>
        </div>
    );
};

export default Landing;
