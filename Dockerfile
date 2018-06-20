FROM node:8-alpine
WORKDIR /uo2/
COPY package.json .
COPY tsconfig.json .
COPY .env.docker ./.env
RUN npm install; mkdir /uniopen2-logs
COPY ./src ./src
CMD ["npm", "start"]