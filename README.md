# Example request:

## Register
~~~
curl --request POST \
  --url http://localhost:6868/regiser \
  --header 'content-type: application/json' \
  --data '{
  "userName": "nvhuy8",
  "email": "huy8@gmail.com",
  "fullName": "Huy",
  "phone": "08999999999",
  "password": "string"
}'
~~~

## Login
~~~
curl --request POST \
  --url http://localhost:6868/auth \
  --header 'content-type: application/json' \
  --data '{
  "identifier": "huy@gmail.com",
  "password": "string"
}'
~~~

## Check-auth
~~~
curl --request GET \
  --url http://localhost:6868/check-auth \
  --header 'content-type: application/json' \
  --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJkNjUwNGJiMy0yYzBiLTRkY2ItYmEyMi1mM2E4YzhhOWU5ZGYiLCJpYXQiOjE1OTM4NTczMDUsImV4cCI6MTU5NjQ0OTMwNX0.hv8l9xFBiWLY3Baq9qZTOBvztXF0Fzlm9Xm5bk35vDE'
~~~
response
~~~
{
  "message": "Logined"
}
~~~
