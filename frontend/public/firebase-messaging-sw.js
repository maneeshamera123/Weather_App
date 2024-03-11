importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCc_1zGpoQsgJonO3SH24KJ68cpFL2Uc5c",
    authDomain: "weatherapp-69015.firebaseapp.com",
    projectId: "weatherapp-69015",
    storageBucket: "weatherapp-69015.appspot.com",
    messagingSenderId: "989345211952",
    appId: "1:989345211952:web:7fd5fde8bf78a256efeff5",
    measurementId: "G-CTEY74EJ6S"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});