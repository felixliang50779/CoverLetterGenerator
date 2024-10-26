FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /coverletter-app

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

CMD ["node", "index.js"]