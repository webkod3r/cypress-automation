Steps to test

Simply run the following command to spin a docker container and run the test

```
docker run -it --rm -v $(pwd):/home/root -w /home/root/ --entrypoint="" \
  cypress/included yarn check-appt
```
