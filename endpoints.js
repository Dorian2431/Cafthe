const express = require("express");
const db = require("./db");
const { query } = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

/*
 *Route : Lister les produits
 * Get /api/produit
 */
router.get("/produit", (req, res) => {
  db.query("select * from produit", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur du serveur" });
    }
    res.json(result);
  });
});

router.get("/produit/:id", (req, res) => {
  const { id } = req.params;
  db.query("select * from produit WHERE id_produit =?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur du serveur" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json(result[0]); // Retournera uniquement le premier résultat
  });
});

router.post("/client/register", (req, res) => {
  const { nom, email, MDP, adresse } = req.body;

  // Contrôler si le mail est déjà présent dans la base de donnée
  db.query("select * from client WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur du serveur" });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
  });

  // Hachage du mot de passe
  bcrypt.hash(MDP, 10, (err, hash) => {
    // Le 10 represente le nombre de fois
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors du chargement du mot de passe" });
    }

    // Insertion du nouveau client
    db.query(
      "INSERT INTO client (Nom, email, MDP, adresse) Values (?,?,?,?)",
      [nom, email, hash, adresse],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Erreur lors de l'inscription" });
        }
        return res
          .status(201)
          .json({ message: "Inscription réussie", id_client: result.insertId });
      },
    );
  });
});

module.exports = router;
