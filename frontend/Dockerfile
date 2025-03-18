# Utilise l'image officielle de Nginx
FROM nginx:alpine

# Copie les fichiers dans le répertoire par défaut de Nginx
COPY . /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Démarre Nginx en mode non-démon
CMD ["nginx", "-g", "daemon off;"]
