const router = require("express").Router();
const wrap = require("express-async-wrap");
const User = require("../../db/models/user");

router.get(
    "/students",
    wrap(async (_, res) => {
        const students = await User.find(
            { role: "student" },
            { _id: 0, password: 0, role: 0 }
        );
        if (!students) {
            return res.status(404).json({ message: "Students not found" });
        }
        res.json(students);
    })
);

router.get(
    "/tutors",
    wrap(async (_, res) => {
        const tutors = await User.aggregate([
            {
                $match: { role: "tutor" },
            },
            {
                $lookup: {
                    from: "theses",
                    localField: "_id",
                    foreignField: "created_by",
                    as: "theses",
                },
            },
            {
                $match: { theses: { $exists: true, $ne: [] } },
            },
            {
                $project: {
                    _id: 0,
                    password: 0,
                    role: 0,
                },
            },
        ]);
        if (!tutors) {
            return res.status(404).json({ message: "tutors not found" });
        }
        res.json(tutors);
    })
);

module.exports = router;
