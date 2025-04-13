#!/usr/bin/env bash

./mvnw clean &&
  npm run docker:db:down &&
  rm -rf src/main/java/ src/main/webapp/ src/test/ &&
  jhipster --force &&
  jhipster --force jdl uml.jdl &&
  sed -i '/contexts: dev\, faker/ s/, faker//g' src/main/resources/config/application-dev.yml &&
  git apply --check patches/test.patch && git apply patches/test.patch
  ./mvnw
