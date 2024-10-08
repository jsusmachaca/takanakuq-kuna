FROM node:lts-iron

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]