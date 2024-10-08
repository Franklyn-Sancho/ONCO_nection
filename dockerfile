FROM node:20


WORKDIR /usr/src/app


COPY package*.json ./
COPY tsconfig.json ./


RUN npm install


COPY . .


EXPOSE 3333


CMD [ "npm", "run", "dev" ]
