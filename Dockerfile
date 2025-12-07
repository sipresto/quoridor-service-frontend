FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=optional || (rm -rf node_modules package-lock.json && npm install)

RUN npm install --no-save @rollup/rollup-linux-x64-musl

COPY . .

RUN rm -rf dist && npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]