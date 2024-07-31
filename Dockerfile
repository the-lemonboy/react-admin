FROM alpine:3.19
ADD dist /dist
RUN mkdir /web && apk --update add tzdata &&  \
     apk add zip && \
     cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  && \
     echo "Asia/Shanghai" > /etc/timezone && apk del tzdata && rm -rf /var/cache/apk/*
WORKDIR /dist
ENTRYPOINT ["sh","-c","cd /web && rm -rf ./* && cp /dist/* /web/ -R && echo `date` >./.pubinfo && tail -f ./.pubinfo " ]