FROM node:12.9-alpine

ARG PULUMI_URL="https://get.pulumi.com/releases/sdk/pulumi-v1.0.0-beta.2-linux-x64.tar.gz"

RUN apk --no-cache add --update \
    curl=7.64.0-r2 \
    build-base=0.5-r1 \
    libc6-compat=1.1.20-r5 \
    docker=18.09.8-r0

# Install pulumi
WORKDIR /tmp 
RUN curl -s $PULUMI_URL -o pulumi.tar.gz \
    && tar -xf pulumi.tar.gz \
    && cp pulumi/* /usr/bin
RUN rm -rf /tmp
WORKDIR /

COPY . .
RUN yarn
RUN yarn build
RUN yarn link

WORKDIR /tests/integration
RUN yarn
RUN yarn link @timmyers/pulumi-kube-ops-view

ENTRYPOINT ["./entrypoint.sh"]