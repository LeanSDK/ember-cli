FROM node:latest

RUN npm i -g npm
RUN npm i -g phantomjs-prebuilt

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/LeanSDK/leanes-cli.git ~/leanes-cli
RUN cd ~/leanes-cli && npm i

ENTRYPOINT ["/bin/bash"]
