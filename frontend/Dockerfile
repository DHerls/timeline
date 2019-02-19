FROM node:latest
EXPOSE 8080
WORKDIR /bindmount
COPY package.json *yarn* ./
RUN yarn
CMD yarn start:dev     # webpack-dev-server --host 0.0.0.0 --hot
