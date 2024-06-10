const Thesis = require("../../db/models/thesis");
const wrap = require("express-async-wrap");
const upload = require("../../utils/multer");
const path = require("path");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;

const router = require("express").Router();

router.get(
    "/",
    wrap(async (req, res) => {
        const theses =
            req.auth.role === "student"
                ? await Thesis.find({
                      $or: [
                          { assigned_to: { $exists: false } },
                          { assigned_to: new ObjectId(req.auth._id) },
                      ],
                  }).populate("created_by assigned_to")
                : await Thesis.find({
                      created_by: new ObjectId(req.auth._id),
                  }).populate("created_by assigned_to");
        if (!theses) {
            return res.status(404).json({ message: "Theses not found" });
        }
        res.json(theses);
    })
);

router.get(
    "/my",
    wrap(async (req, res) => {
        const thesis = await Thesis.findOne({ assigned_to: req.auth._id });
        if (!thesis) {
            return res.json({ assigned: false });
        }
        res.json({ assigned: true });
    })
);

router.get(
    "/:id/download/:file",
    wrap(async (req, res) => {
        const { file } = req.params;
        const filePath = path.join(
            __dirname,
            `../../../public/uploads/${file}`
        );
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }
        res.download(`public/uploads/${file}`);
    })
);

router.post(
    "/",
    upload.fields([
        { name: "file", maxCount: 1 },
        { name: "image", maxCount: 1 },
    ]),
    wrap(async (req, res) => {
        const { title, description, deadline, created_by } = req.body;
        await Thesis.create({
            title,
            description,
            deadline,
            created_by,
            image: req.files["image"] ? req.files["image"][0].filename : null,
            file: req.files["file"][0].filename || null,
        });
        res.json({ message: "Thesis created" });
    })
);

router.delete(
    "/:id",
    wrap(async (req, res) => {
        const { id } = req.params;
        await Thesis.findByIdAndDelete(id);
        res.json({ message: "Thesis deleted" });
    })
);

router.post(
    "/:id/upload",
    upload.single("file"),
    wrap(async (req, res) => {
        const { id } = req.params;
        const { file } = req.body;
        await Thesis.findByIdAndUpdate(id, { file });
        res.json({ message: "File uploaded" });
    })
);

router.put(
    "/:id",
    upload.fields([
        { name: "file", maxCount: 1 },
        { name: "image", maxCount: 1 },
    ]),
    wrap(async (req, res) => {
        const { id } = req.params;
        await Thesis.findByIdAndUpdate(id, {
            ...req.body,
            image: req.files["image"] ? req.files["image"][0].filename : null,
            file: req.files["file"] ? req.files["file"][0].filename : null,
        });
        res.json({ message: "Thesis updated" });
    })
);

router.put(
    "/student/:id",
    upload.single("student_upload"),
    wrap(async (req, res) => {
        const { id } = req.params;
        const { file } = req;
        if (file) {
            await Thesis.findByIdAndUpdate(id, {
                ...req.body,
                student_upload: file.filename,
            });
        } else {
            await Thesis.findByIdAndUpdate(id, {
                ...req.body,
            });
        }
        res.json({ message: "Thesis updated" });
    })
);

module.exports = router;
