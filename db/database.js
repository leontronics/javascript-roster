const { uid } = require("uid");
const axios = require("axios");

class RosterDB {
    constructor() {}

    // Method to add a student to the database
    addStudent({ name, location }) {
        // Generate a unique ID for the student
        const id = uid();
        const placeholderImage = "https://via.placeholder.com/150";

        // Create a new student object with the provided details and a placeholder image
        this[id] = {
            id,
            name,
            location,
            picture: placeholderImage,
        };

        // Update the student's picture based on their location
        this.updatePictureByLocation(id, location);

        return this[id];
    }

    // Method to update a student's picture based on their location
    async updatePictureByLocation(studentId, location) {
        try {
            const picture = await this.fetchPictureByLocation(location);
            if (picture) {
                this[studentId].picture = picture;
            }
        } catch (error) {
            console.error("Error updating picture:", error);
        }
    }

    // Method to fetch a picture from Unsplash based on a location
    async fetchPictureByLocation(location) {
        const url = `https://api.unsplash.com/search/photos?query=${location}&client_id=${process.env.UNSPLASH_API_KEY}&per_page=1`;

        const response = await axios.get(url);
        if (
            response.data &&
            response.data.results &&
            response.data.results.length > 0
        ) {
            return response.data.results[0].urls.small;
        }
        return null;
    }

    // Method to get a student by their ID
    getStudentById(id) {
        return this[id];
    }

    // Method to get all students
    getAllStudents() {
        return Object.values(this);
    }

    // Method to get students based on any combination of ID, name, or location
    getStudentsByAny({ id, name, location }) {
        return Object.values(this).filter((student) => {
            let matches = true;

            if (id) {
                matches = matches && student.id === id;
            }

            if (name) {
                matches = matches && student.name === name;
            }

            if (location) {
                matches = matches && student.location === location;
            }

            return matches;
        });
    }

    // Method to update a student's details by their ID
    updateStudentById(oldId, { id: newId, name, location }) {
        let locationChanged = false;

        if (this[oldId]) {
            locationChanged = this[oldId].location !== location;

            if (newId && newId !== oldId) {
                this[newId] = {
                    ...this[oldId],
                    id: newId,
                    name,
                    location,
                };
                delete this[oldId];
            } else {
                this[oldId] = {
                    ...this[oldId],
                    name,
                    location,
                };
            }
        }

        if (locationChanged) {
            this.updatePictureByLocation(newId || oldId, location);
        }

        return this[newId || oldId];
    }

    // Method to remove a student by their ID
    removeStudentById(id) {
        delete this[id];
    }

    // Method to remove all students
    removeAllStudents() {
        const allStudentIds = Object.keys(this);
        allStudentIds.forEach((id) => {
            delete this[id];
        });
    }
}

// Create an instance of the RosterDB class and export it
const rosterDB = new RosterDB();
module.exports = rosterDB;
