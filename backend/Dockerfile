FROM node:13.2.0

WORKDIR /backend

COPY . .

RUN yarn global add @nestjs/cli
RUN yarn install
RUN yarn build

EXPOSE ${DATA_MART_API_PORT}

CMD ["node", "dist/main.js"]
