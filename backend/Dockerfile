# Utilise l'image officielle de Node.js
FROM node:20

WORKDIR /app
# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY . .
# Installe les dépendances
RUN npm i --force
EXPOSE 3000

# Lance l'appliction
CMD ["npm", "run", "dev"]
