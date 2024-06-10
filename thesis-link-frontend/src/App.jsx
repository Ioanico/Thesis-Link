import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import AuthProvider from "./utils/AuthProvider";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/Register";
import Landing from "./pages/Landing/Landing";
import { ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
    palette: {
        primary: {
            main: "#EF5350",
            contrastText: "white",
        },
        secondary: {
            main: "#D90D32",
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AuthProvider>
                    <BrowserRouter basename="/">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route element={<ProtectedRoute />}>
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;
