FROM node:8

WORKDIR /uo2/

COPY package.json .
COPY tsconfig.json .
COPY .env.docker ./.env

RUN npm install

COPY ./src ./src

CMD ["npm", "start"]
