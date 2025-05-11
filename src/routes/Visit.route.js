// visitRoutes.js
const express = require("express");
const visitController = require("../controllers/Visit.controller");
const visitSchema = require("../joi/Visit.schema");

const router = express.Router();

router.post("/add", (req, res) => {
    const { error, value } = visitSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    visitController
        .addVisit(value)
        .then(() => res.status(201).send({ message: "Visit added successfully" }))
        .catch((err) => res.status(500).send({ error: "Internal Server Error" }));
});

router.get("/", (req, res) => {
    visitController
        .getCities()
        .then((cities) => res.status(200).json(cities))
        .catch((err) => res.status(500).send({ error: "Internal Server Error" }));
});

router.get("/:id", (req, res) => {
    visitController
        .getVisitById(req.params.id)
        .then((visit) => {
            if (!visit) return res.status(404).send({ error: "Visit not found" });
            res.status(200).json(visit);
        })
        .catch((err) => res.status(500).send({ error: "Internal Server Error" }));
});

router.put("/:id", (req, res) => {
    const { error, value } = visitSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    visitController
        .updateVisit(req.params.id, value)
        .then((visit) => {
            if (!visit) return res.status(404).send({ error: "Visit not found" });
            res.status(200).send({ message: "Visit updated successfully" });
        })
        .catch((err) => res.status(500).send({ error: "Internal Server Error" }));
});

router.delete("/:id", (req, res) => {
    visitController
        .deleteVisit(req.params.id)
        .then((visit) => {
            if (!visit) return res.status(404).send({ error: "Visit not found" });
            res.status(200).send({ message: "Visit deleted successfully" });
        })
        .catch((err) => res.status(500).send({ error: "Internal Server Error" }));
});

module.exports = router;
