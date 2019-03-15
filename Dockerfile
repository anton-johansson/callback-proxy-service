FROM node:10.15.1-slim
RUN mkdir /opt/callback-proxy-service \
 && mkdir /var/callback-proxy-service \
 && touch /var/callback-proxy-service/database.json \
 && chown -R node:node /opt/callback-proxy-service \
 && chown -R node:node /var/callback-proxy-service

USER 1000
WORKDIR /opt/callback-proxy-service

COPY --chown=node:node server /opt/callback-proxy-service/server
COPY --chown=node:node node_modules /opt/callback-proxy-service/node_modules
COPY --chown=node:node client/build /opt/callback-proxy-service/client

ENTRYPOINT ["nodejs", "--no-warnings", "server/index.js"]
