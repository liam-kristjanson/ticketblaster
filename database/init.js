//setup collections and seed initial data for database
db = db.getSiblingDB('ticketblaster');

db.createCollection('events');
db.createCollection('tickets');
db.createCollection('users');

db.users.insertMany([
    {
        username: "admin",
        password: "Testuser123!",
        role: "admin"
    },
    {
        username: "customer",
        password: "Testuser123!",
        role: "customer"
    },
    {
        username: "host",
        password: "Testuser123!",
        role: "host"
    }
])