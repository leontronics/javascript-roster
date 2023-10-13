const express = require("express");
const router = express.Router();
const rosterDB = require("../db/database");
const {
    validateStudentData,
    validateStudentId,
} = require("../middleware/middleware");

// Endpoint to get students based on query parameters or all students if no parameters are provided
router.get("/", (request, response) => {
    // If there's a name or location query parameter, filter students by those parameters
    if (request.query.name || request.query.location) {
        const students = rosterDB.getStudentsByAny(request.query);
        response.send(students);
    } else {
        // If no query parameters are provided, return all students
        const students = rosterDB.getAllStudents();
        response.send(students);
    }
});

// Endpoint to add a new student
router.post("/", validateStudentData, (request, response) => {
    // Add each valid student to the database
    const newStudents = request.validStudents.map((student) =>
        rosterDB.addStudent(student)
    );
    // If any new students were added, return them with a 201 status
    if (newStudents.length) {
        response.status(201).send(newStudents);
    } else {
        // If no new students were added (due to duplicates or invalid data), return an error
        response.status(409).send({
            error: "No new students added, possible duplicates or invalid data.",
        });
    }
});

// Endpoint to update a student by ID
router.put("/:id", validateStudentId, (request, response) => {
    const { id: newId, name, location } = request.body;
    // Update the student in the database
    const updatedStudent = rosterDB.updateStudentById(request.student.id, {
        id: newId,
        name,
        location,
    });
    response.send(updatedStudent);
});

// Endpoint to delete a student by ID
router.delete("/:id", validateStudentId, (request, response) => {
    // Remove the student from the database
    rosterDB.removeStudentById(request.student.id);
    response.send({ message: "Student deleted successfully" });
});

// Endpoint to delete all students
router.delete("/", (request, response) => {
    // Remove all students from the database
    rosterDB.removeAllStudents();
    response.send({ message: "All students deleted successfully" });
});

module.exports = router;
