# blog-app
A React blog app, which lets you view posts as a guest and perform operations as a verified user.

## Deploy

Create a Firebase project, use the Firestore database to store blog posts.  
You can use the JSON data from the data folder or you can add your own posts as well.

Create your local .env file and include the following lines:

```
REACT_APP_FIREBASE_API_KEY="your-api-key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your-auth-domain"
REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
REACT_APP_FIREBASE_APP_ID="your-app-id"
```

After you have created the .env file, use the following commands to deploy the application:

```
npm install
npm run build
firebase deploy
```

## Preview

https://blog-app-16c67.web.app