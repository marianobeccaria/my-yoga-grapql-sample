FROM node:18.16.0

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "main.js"]