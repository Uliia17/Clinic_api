FROM node:20-alpine

WORKDIR /app

COPY ./backend/package.json ./backend/package-lock.json* ./

RUN npm install

COPY ./backend .

EXPOSE 7000

CMD ["npm", "start"]

