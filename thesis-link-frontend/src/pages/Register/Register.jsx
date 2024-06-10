import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Link,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_trnspr.png";
import "./Register.css";
import { AuthContext } from "../../utils/AuthProvider";
import { toast } from "react-toastify";

function Register() {
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "student",
        authentication_code: "",
    });
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        authentication_code: "Authentication Code is needed for tutors",
    });

    const handleValidation = () => {
        let formIsValid = true;
        let newErrors = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            authentication_code: "",
        };

        if (!userInfo.first_name) {
            formIsValid = false;
            newErrors.first_name = "First Name is required";
        }

        if (!userInfo.last_name) {
            formIsValid = false;
            newErrors.last_name = "Last Name is required";
        }

        if (!userInfo.email) {
            formIsValid = false;
            newErrors.email = "Email is required";
        }

        if (!userInfo.password) {
            formIsValid = false;
            newErrors.password = "Password is required";
        }

        if (!userInfo.password_confirmation) {
            formIsValid = false;
            newErrors.password_confirmation =
                "Password Confirmation is required";
        }

        if (userInfo.password !== userInfo.password_confirmation) {
            formIsValid = false;
            newErrors.password = "Passwords do not match";
            newErrors.password_confirmation = "Passwords do not match";
        }

        if (userInfo.role === "tutor" && !userInfo.authentication_code) {
            formIsValid = false;
            newErrors.authentication_code = "Authentication Code is required";
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const handleRegister = () => {
        if (!handleValidation()) return;
        axios
            .post("http://localhost:3000/auth/register", userInfo)
            .then((response) => {
                setToken(response.data.token);
                navigate("/dashboard");
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setToken(null);
            });
    };

    const handleInputChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    // TODO: Add validation for all fields and check if passwords match

    return (
        <div id="register-page">
            <img src={Logo} />
            <div className="form-container">
                <span className="title">Register</span>
                <TextField
                    type="text"
                    label="First Name"
                    name="first_name"
                    value={userInfo.first_name}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    margin="normal"
                    required
                />
                <TextField
                    type="text"
                    label="Last Name"
                    name="last_name"
                    value={userInfo.last_name}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    margin="normal"
                    required
                />
                <TextField
                    type="email"
                    label="Email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                    margin="normal"
                    required
                />
                <TextField
                    type="password"
                    label="Password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                    margin="normal"
                    required
                />
                <TextField
                    type="password"
                    label="Confirm Password"
                    name="password_confirmation"
                    value={userInfo.password_confirmation}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.password_confirmation}
                    helperText={errors.password_confirmation}
                    margin="normal"
                    required
                />
                <FormControl>
                    <FormLabel>Role</FormLabel>
                    <RadioGroup
                        row
                        name="role"
                        value={userInfo.role}
                        onChange={handleInputChange}
                    >
                        <FormControlLabel
                            value="student"
                            control={<Radio />}
                            label="Student"
                        />
                        <FormControlLabel
                            value="tutor"
                            control={<Radio />}
                            label="Tutor"
                        />
                    </RadioGroup>
                </FormControl>
                {userInfo.role === "tutor" && (
                    <TextField
                        type="password"
                        label="Authentication Code"
                        name="authentication_code"
                        value={userInfo.authentication_code}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!errors.authentication_code}
                        helperText={errors.authentication_code}
                        margin="normal"
                        required
                    />
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRegister}
                >
                    Register
                </Button>
                <Link className="login-link" onClick={() => navigate("/login")}>
                    Already have an account?
                </Link>
            </div>
        </div>
    );
}

export default Register;
