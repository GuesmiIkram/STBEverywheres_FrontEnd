FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/digi-corp-v1 /usr/share/nginx/html

# Ajoute cette ligne :
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
