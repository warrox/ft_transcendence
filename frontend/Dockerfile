FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3020

CMD ["npm", "run", "dev", "--host"]