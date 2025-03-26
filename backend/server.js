const Fastify = require('fastify');
import cors from '@fastify/cors';

const db = require('./db.js');
const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: '*', // Permet toutes les origines (à éviter en prod)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
  credentials: true // Autoriser l'envoi de cookies et d'identifiants
});
// Route pour ajouter un utilisateur
fastify.post('/users', (request, reply) => {
  const { name, surname , email, password } = request.body;
  
	if(!name || !surname || !email || !password){
		return reply.status(400).send({error : " tous les champs sont obligatoires"});
	}
  db.run('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)', 
		[name,surname, email, password], 
		function (err) {
    if (err) {
      reply.status(400).send({ error: 'Email déjà utilisé ou erreur SQL' });
    } else {
      reply.send({ id: this.lastID, name, surname, email });
    }
  });
});

// Route pour récupérer tous les utilisateurs
fastify.get('/users', (request, reply) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      reply.status(500).send({ error: 'Erreur lors de la récupération des utilisateurs' });
    } else {
      reply.send(rows);
    }
  });
});

// Démarrer le serveur
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Serveur démarré sur ${address}`);
});

