FROM node
WORKDIR /usr/bin
RUN npm install -g javascript-obfuscator
COPY obfuscate obfuscate
RUN chmod +x obfuscate
WORKDIR /workdir