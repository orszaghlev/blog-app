# blog-app
A React blog app.  
```
npm install
npm run start-auth
npm start
```  
You can send the following requests:  

`Login:`
```
POST http://localhost:8000/auth/login with the following body:
{
    "email": "registered email here",
    "password": "registered password here"
}
```

After a successful login, you'll get an access token,  
which you'll need to use for authorization when working with posts.
```
Authorization: Bearer {the access token you received after login}
```

`CRUD Operations:`
```
GET http://localhost:8000/api/posts
GET http://localhost:8000/api/posts/{id}
DELETE http://localhost:8000/api/posts/{id} + JSON body
POST http://localhost:8080/api/posts + JSON body
PUT http://localhost:8080/api/posts/{id} + JSON body
```  