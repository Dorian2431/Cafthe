const express = require("express");
const db = require("./db");
const { query, response } = require("express");
const { VerityToken } = require("./middleware");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");

/*
 *Route : Lister les produits
 * Get /api/produit
 Récupérer les produits */
router.get("/produit", (req, res) => {
  db.query("select * from produit", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur du serveur" });
    }
    res.json(result);
  });
});

/*Recuperer un produit parsont id*/
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
  const { nom, email, MDP, adresse, prenom } = req.body;

  // Contrôler si le mail est déjà présent dans la base de donnée
  db.query("select * from client WHERE Email = ?", [email], (err, result) => {
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
    if (err)
      return res
        .status(500)
        .json({ message: "Erreur lors du chargement du mot de passe" });
    // Insertion du nouveau client
    db.query(
      "INSERT INTO client (Nom, Email, MDP, Adresse, prenom) Values (?,?,?,?, ?)",
      [nom, email, hash, adresse, prenom],
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

/* Route pour ce login */
router.post("/client/login", (req, res) => {
  const { email, motDePasse } = req.body;
  db.query("SELECT * FROM client WHERE Email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur du serveur" });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: "Email incorrect" });
    }
    const client = result[0];

    /*Vérification du MDP*/
    bcrypt.compare(motDePasse, client.MDP, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Erreur du serveur" });
      if (!isMatch)
        return res.status(401).json({ message: "Mot de passe incorrect" });

      //Génération d'un Token JWT
      const token = sign(
        { id: client.id_client, email: client.Email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );
      res.json({
        message: "Conneexion réussie",
        token,
        client: {
          id: client.id_client,
          Nom: client.Nom,
          prenom: client.prenom,
          email: client.Email,
        },
      });
    });
  });
});

/*router.get("/categorie", (req, res) => {
  db.query("SELECT * FROM categorie", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur du serveur" });
    }
    res.json(result);
  });
}); */

router.get("/categorie/cafe", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM produit WHERE id_categorie = 2;",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erreur du serveur" });
      }
      res.json(result);
    },
  );
});

router.get("/categorie/the", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM produit WHERE id_categorie = 1;",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erreur du serveur" });
      }
      res.json(result);
    },
  );
});

router.get("/categorie/accessoires", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM produit WHERE id_categorie = 3;",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erreur du serveur" });
      }
      res.json(result);
    },
  );
});

router.get("/Compte/:id", (req, res) => {
  const { id } = req.params; //recupe les donners passer dans l'url
  db.query("SELECT *  FROM client where id_client = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur du serveur" });
    }
    res.json(result);
  });
});

router.get("/statue", (req, res) => {
  res.json("ok");
});

module.exports = router;
