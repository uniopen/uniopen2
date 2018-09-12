FROM node:8-alpine
WORKDIR /uniopen2/
COPY tsconfig.json tslint.json process.json package.json package-lock.json Procfile ./
COPY .env.docker ./.env
RUN npm install; mkdir /uniopen2-logs
COPY ./src ./src
COPY ./grabber ./grabber
CMD ["npm", "start"]