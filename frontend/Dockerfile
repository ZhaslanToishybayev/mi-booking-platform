# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Копирование package файлов
COPY package*.json ./
RUN npm ci

# Копирование исходников
COPY . .

# Сборка
RUN npm run build

# Production stage
FROM nginx:alpine

# Копирование собранного приложения
COPY --from=build /app/dist /usr/share/nginx/html

# Копирование nginx конфига
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
