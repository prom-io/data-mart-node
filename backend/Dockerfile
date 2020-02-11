FROM node:13.2.0

WORKDIR /var/www/api

COPY . .

RUN yarn global add @nestjs/cli
RUN yarn install

EXPOSE ${DATA_MART_API_PORT}

RUN ["chmod", "+x", "./start.sh"]

CMD ["/bin/bash", "./start.sh"]
