docker container rm -f flaskapp
docker run --name flaskapp --restart=always -p 5000:5000 -e TRELLO_API_KEY=%TRELLO_API_KEY% -e TRELLO_API_TOKEN=%TRELLO_API_TOKEN% -v ~/pyfit/src:/app pyfit -d
