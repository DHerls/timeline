FROM python:3.7

ENV PYTHONUNBUFFERED 1
RUN mkdir /timeline
WORKDIR /timeline
ADD . /timeline

RUN apt-get update && apt-get install -y libsasl2-dev python3-dev libldap2-dev libssl-dev libcairo2-dev pango1.0-tests && pip install -r requirements/base.txt
