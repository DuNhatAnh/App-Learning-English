FROM node:20-slim

WORKDIR /app

# Cài đặt openssl cho Prisma
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5001

CMD ["npm", "run", "dev"]
