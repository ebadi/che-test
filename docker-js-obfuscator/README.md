# docker-js-obfuscator
JavaScript Obfuscator wrapper for docker


```
docker build -t jsob .
docker run --volume=$pwd:/data  -it jsob /data/chedokucode/script.js --output   /data/chedokucode/script.js

```