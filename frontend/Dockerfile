# Utilise l'image officielle de Nginx
FROM nginx:alpine

# Copie les fichiers du front-end dans un répertoire temporaire
COPY . /tmp/frontend/

# Liste le contenu de /tmp/frontend/ pour vérifier si les fichiers sont là
RUN ls -al /tmp/frontend/

# Déplace les fichiers vers /home/whamdi/goinfre dans le conteneur
RUN mv /tmp/frontend/* /home/whamdi/goinfre/

# Expose le port 80
EXPOSE 80

# Change le répertoire de travail pour Nginx afin qu'il serve les fichiers
WORKDIR /home/whamdi/goinfre
