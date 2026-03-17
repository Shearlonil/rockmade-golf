export class CustomError extends Error {
    constructor(name, message) {
        super(message); // (1)
        this.name = name; // (2)
    }
}