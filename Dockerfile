#FROM node:18.18.0-slim
FROM node:alpine
WORKDIR /HashCraft
COPY . /HashCraft
#ENTRYPOINT ["npm", "start"]
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]