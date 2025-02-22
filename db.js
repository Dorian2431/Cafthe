const mysql = require("mysql2");
require("dotenv").config(); // Permet de charger des variables d'environnement

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((error) => {
  if (error) {
    console.error("Erreur de connexion MYSQL :", error);
    process.exit(1); /* Sert de deco en cas d'erreur*/
  }

  console.log("Connecté à la BBD MySQL");
});

module.exports = db;
