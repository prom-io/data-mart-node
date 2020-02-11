FROM node:12

WORKDIR /front-end

COPY . .
RUN yarn install

EXPOSE ${REACT_APP_PRODUCTION_PORT}

CMD ["yarn", "run", "production"]
