const rosterDB = require("../db/database");

// Middleware to validate student data before adding to the database
const validateStudentData = (request, response, next) => {
    // Check if the request body is an array or a single object
    const studentsToAdd = Array.isArray(request.body)
        ? request.body
        : [request.body];

    // If no students provided, return an error
    if (!studentsToAdd.length) {
        return response.status(400).json({ error: "Empty request payload" });
    }

    // Get all existing students from the database
    const allStudents = rosterDB.getAllStudents();
    request.validStudents = studentsToAdd.filter((student) => {
        const { name, location } = student;
        if (!name || !location) return false;

        // Check if the student already exists in the database
        const exists = allStudents.some(
            (student) => student.name === name && student.location === location
        );
        return !exists;
    });

    // If no valid students found, return an error
    if (!request.validStudents.length) {
        return response
            .status(400)
            .json({ error: "Invalid student data or duplicates found" });
    }

    next();
};

// Middleware to validate a student's ID before updating or deleting
const validateStudentId = (request, response, next) => {
    const studentId = request.params.id;
    const student = rosterDB.getStudentById(studentId);

    // If the student with the provided ID doesn't exist, return an error
    if (!student) {
        return response
            .status(404)
            .json({ error: `Student with ID ${studentId} not found` });
    }

    // Attach the found student to the request object
    request.student = student;
    next();
};

// Export the middleware functions
module.exports = {
    validateStudentData,
    validateStudentId,
};
