
const logOut = document.querySelector('#sign-out');
const signIn = document.querySelector('#sign-in');
const signInGoogle = document.querySelector('#sign-in-google');
const logIn = document.querySelector('#log-in');
const Email = document.querySelector('#emailaddress');
const Pass = document.querySelector('#password');
//buat user
signIn.addEventListener('click',(e)=>{
  const email = Email.value;
  const password = Pass.value;
  console.log(email);
  console.log(password);
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      //console.log(user)
    })
    .catch((error) => {
      console.log(error)
      var errorCode = error.code;
      var errorMessage = error.message;
    });
});
//login
logIn.addEventListener('click',(e)=>{
  const email = Email.value;
  const password = Pass.value;
  console.log(email);
  console.log(password);
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log(user)
    })
    .catch((error) => {
      console.log(error)
      var errorCode = error.code;
      var errorMessage = error.message;
    });
});
//ambi; session 
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
 firebase.auth().onAuthStateChanged((firebaseUser) => {
    // Check if we are already signed-in Firebase with the correct user.
    if (firebaseUser) {
        logOut.classList.remove('hidden');
        console.log(firebaseUser);
    } else {
      logOut.classList.add('hidden');
      console.log('User logOut.');
    }
  });

  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    // Send token to your backend via HTTPS
    console.log(idToken);
    // ...
  }).catch(function(error) {
    console.log(error);
  });




logOut.addEventListener('click',e => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
});

signInGoogle.addEventListener('click',e =>{
  firebase.auth().languageCode = 'id';
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(credential);
      console.log(token);
      console.log(user);
      //return user
      onSignIn(token)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
});

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}