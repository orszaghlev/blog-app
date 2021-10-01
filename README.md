# blog-app
A React blog app, which lets you view posts as a guest, save your favorite posts and write comments as a user, or create/edit/duplicate/delete posts as an admin.

## Deploy

Create a Firebase project, use the Firestore database to store blog posts.  
You can use the JSON data from the src/data folder or you can add your own posts as well.

Create your local .env file and include the following lines:

```
REACT_APP_FIREBASE_API_KEY="your-api-key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your-auth-domain"
REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
REACT_APP_FIREBASE_APP_ID="your-app-id"
REACT_APP_FIREBASE_ADMIN_UID="your-admin-uid"
```

If you have a Tiny API Key, you can include this line as well:

```
REACT_APP_TINY_API_KEY="your-tiny-api-key"
```

After you have created the .env file, use the following commands to deploy the application:

```
npm install
npm run build
firebase deploy
```

## Preview

https://blog-app-16c67.web.app