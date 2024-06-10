const jwt = require("jsonwebtoken");

module.exports = {
    verifyToken: (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const [bearer, token] = req.headers.authorization.split(" ");
        if (bearer !== "Bearer") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.auth = decoded;
            next();
        });
    },
};
