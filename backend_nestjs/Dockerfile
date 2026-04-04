FROM node:20-alpine as development

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev

COPY . .

RUN apk add --no-cache openssl

EXPOSE 3000

CMD ["npm", "run", "dev"]