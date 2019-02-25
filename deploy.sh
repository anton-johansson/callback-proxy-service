#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login --username $DOCKER_USERNAME --password-stdin
docker tag $DOCKER_USERNAME/callback-proxy-service:latest $DOCKER_USERNAME/callback-proxy-service:$TRAVIS_TAG
docker push $DOCKER_USERNAME/callback-proxy-service:$TRAVIS_TAG
