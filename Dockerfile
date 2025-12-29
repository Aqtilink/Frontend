# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Accept build-time configuration for Vite
ARG VITE_API_URL
ARG VITE_ACTIVITY_API_URL
ARG VITE_USER_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY

ENV VITE_API_URL=$VITE_API_URL \
	VITE_ACTIVITY_API_URL=$VITE_ACTIVITY_API_URL \
	VITE_USER_API_URL=$VITE_USER_API_URL \
	VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
