FROM node:18.18.0-slim
WORKDIR /HashCraft
COPY . /HashCraft
RUN npm start