import { Box, Button } from "@mui/material";
import "./Header.css";
import Pana from "../../assets/pana.png";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthProvider";

const Header = () => {
    const { user, setToken } = useContext(AuthContext);

    return (
        <div id="header">
            <Box>
                <img className="feather-img" src={Pana} />
                <span className="greeting">{`Welcome, ${user.first_name}`}</span>
                <Button
                    variant="text"
                    size="large"
                    color="primary"
                    className="sign-out-btn"
                    onClick={() => setToken(null)}
                >
                    Sign out
                </Button>
            </Box>
        </div>
    );
};

export default Header;
