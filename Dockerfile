# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
# Menggunakan ci lebih stabil untuk CI/CD pipeline
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Sesuaikan '/app/dist' dengan folder hasil build kamu (dist/out/build)
COPY --from=builder /app/dist /usr/share/nginx/html

# Tambahkan baris ini agar routing React/Next.js tidak 404 saat refresh
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]