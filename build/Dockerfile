
FROM node:10.15.3 as build-deps-wizard

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build


WORKDIR /app
RUN wget https://github.com/ethereum/eth2.0-deposit-cli/releases/download/v1.0.0/eth2deposit-cli-9310de0-linux-amd64.tar.gz
RUN tar zxvf *.tar.gz
RUN ls -l
RUN rm *.tar.gz
RUN mv */deposit ./
RUN ls -l


# build final image
FROM frolvlad/alpine-glibc 

WORKDIR /usr/src/app

USER root

RUN apk add --no-cache libressl ca-certificates supervisor expect wget nginx nodejs npm

COPY --from=build-deps-wizard /app/deposit /usr/bin/deposit
RUN chmod +x /usr/bin/deposit

RUN mkdir -p /usr/src/app/scripts
COPY files/mkkeys.sh /usr/src/app/scripts
RUN chmod +x /usr/src/app/scripts/mkkeys.sh


# Wizard
COPY --from=build-deps-wizard /usr/src/app/wizard/build /usr/local/wizard

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
# COPY --from=build-deps-wizard /usr/src/app/monitor /usr/src/monitor
# WORKDIR /usr/src/monitor
RUN npm i --production

COPY files/supervisord.conf /etc/supervisord/
COPY files/nginx.conf /etc/nginx/


ENTRYPOINT supervisord -n -c /etc/supervisord/supervisord.conf
