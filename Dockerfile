FROM node:8-alpine
WORKDIR /uniopen2/
COPY tsconfig.json package.json package-lock.json Procfile ./
COPY .env.docker ./.env
RUN npm install; mkdir /uniopen2-logs
COPY ./src ./src
CMD ["npm", "start"]