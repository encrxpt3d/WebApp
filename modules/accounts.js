const { getDb } = require("../database/mongo");

const Accounts = {};

Accounts.generateId = async () => {
    try {
        const db = getDb();
        const collection = db.collection("users");
        const count = await collection.countDocuments();
        const id = count + 1;
        return id.toString();
    } catch (error) {
        console.error("Error generating ID:", error);
        return null;
    }
};

Accounts.signup = async (username, password, sessionId) => {
    try {
        const db = getDb();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return "in-use";
        }

        const id = await Accounts.generateId();
        if (!id) return null;
        const newUser = { id, username, password, sessionId };
        await collection.insertOne(newUser);
        //console.log("User signed up:", newUser);
        return newUser;
    } catch (error) {
        console.error("Error signing up:", error);
        return null;
    }
};

Accounts.login = async (username, password) => {
    try {
        const db = getDb();
        const collection = db.collection("users");
        const user = await collection.findOne({ username });
        if (user && user.password === password) {
            console.log("User logged in:", username);
            return user;
        } else {
            //console.log("Invalid credentials:", username);
            return "incorrect";
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
};

Accounts.resetDatabase = async () => {
    try {
        const db = getDb();
        const collection = db.collection("users");
        await collection.deleteMany({});
        //console.log("User database reset.");
        return true;
    } catch (error) {
        console.error("Error resetting user database:", error);
        return false;
    }
};

Accounts.resetSessions = async () => {
    try {
        const db = getDb();
        const collection = db.collection("users");
        await collection.updateMany({}, { $set: { sessionId: null } });
        //console.log("User sessions reset.");
        return true;
    } catch (error) {
        console.error("Error resetting user sessions:", error);
        return false;
    }
};

module.exports = Accounts;