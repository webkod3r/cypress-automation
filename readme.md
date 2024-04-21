Steps to test

Simply run the following command to spin a docker container and run the test

```
docker run -it --rm -v $(pwd):/home/root -w /home/root/ --entrypoint="" \
  cypress/included yarn check-appt
```

Further implementation will include saving the screenshots into AWS S3

We need the following dependencies
```
"@aws-sdk/client-s3"
"@aws-sdk/lib-storage"
```
