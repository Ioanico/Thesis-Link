import { useContext, useState } from "react";
import { TextField, Button, Link } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../utils/AuthProvider";
import Logo from "../../assets/logo_trnspr.png";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleValidation = () => {
        let formIsValid = true;
        let newErrors = { email: "", password: "" };

        if (!email) {
            formIsValid = false;
            newErrors.email = "Email is required";
        }

        if (!password) {
            formIsValid = false;
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!handleValidation()) return;

        axios
            .post("http://localhost:3000/auth", {
                email: email,
                password: password,
            })
            .then((response) => {
                setToken(response.data.token);
                navigate("/dashboard");
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setToken(null);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <div id="login-page">
            <img src={Logo} />
            <div className="form-container">
                <span className="title">Login</span>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Sign in
                </Button>
                <Link
                    className="register-link"
                    onClick={() => navigate("/register")}
                >
                    Don&apos;t have an account?
                </Link>
            </div>
        </div>
    );
};

export default Login;
