FROM node:10.15.1-slim
RUN mkdir /opt/callback-service \
 && mkdir /var/callback-service \
 && touch /var/callback-service/database.json \
 && chown -R node:node /opt/callback-service \
 && chown -R node:node /var/callback-service

USER 1000
WORKDIR /opt/callback-service

COPY --chown=node:node server /opt/callback-service/server
COPY --chown=node:node node_modules /opt/callback-service/node_modules
COPY --chown=node:node client/build /opt/callback-service/client

ENTRYPOINT ["nodejs", "server/index.js"]
