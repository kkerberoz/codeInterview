FROM node

RUN mkdir -p /app/backend

WORKDIR /app/backend

COPY package.json * /app/backend/

RUN npm install

COPY . /app/backend/

CMD  ["npm", "run", "dev"]

