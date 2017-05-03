FROM node:6.9.4-alpine

# for npm native dependencies build:
RUN apk add --no-cache make gcc g++ git

ENV NODE_ENV=production

WORKDIR /src

COPY . /src

ADD package.json /tmp/
RUN cd /tmp && npm install
RUN cd /src && ln -s /tmp/node_modules

EXPOSE 3001

ENTRYPOINT ["npm"]
CMD ["start"]