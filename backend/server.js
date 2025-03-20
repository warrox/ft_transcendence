const Fastify = require('fastify');
const db = require('./db');

const fastify = Fastify({ logger: true });

// Route pour ajouter un utilisateur
fastify.post('/users', (request, reply) => {
  const { name, email } = request.body;
  
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) {
      reply.status(400).send({ error: 'Email déjà utilisé ou erreur SQL' });
    } else {
      reply.send({ id: this.lastID, name, email });
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

