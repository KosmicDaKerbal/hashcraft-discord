#FROM node:18.18.0-slim
FROM node:alpine
WORKDIR /HashCraft
COPY . /HashCraft
#ENTRYPOINT ["npm", "start"]
ENTRYPOINT ["./docker-entrypoint.sh"]