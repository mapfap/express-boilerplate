FROM node:8-alpine

EXPOSE 8080

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm install
ADD . /app

CMD ["npm", "start"]
