FROM node:18.18.0-slim
WORKDIR /HashCraft
COPY . /HashCraft
EXPOSE 8091
ENTRYPOINT ["npm", "start"]