const express = require("express");
const cors = require("cors");
const db = require("./db"); // Connexion a MySQL, comment on va se connecter
const routes = require("./endpoints"); // Les routes de l'API

const app = express();
app.use(express.json());
app.use(cors());

// Utilisation des routes
app.use("/api", routes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000; // Le port est egale a precess.env.PORT mais s'il exste pas sa sera 3000

app.listen(PORT, () => {
  //Host name non preciser sa veux dire que c'est localhost
  console.log(`LAPI est démarré sur http://localhost:${PORT}`);
});
