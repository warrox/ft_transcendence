


# Utilise l'image officielle de Node.js
FROM node:20


# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste des fichiers dans le répertoire de travail
COPY . .

# Expose le port 3000
EXPOSE 3000

# Lance l'application
CMD ["node", "app.js"]
