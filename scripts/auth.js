// listen for auth status changes
firebaseAuth.onAuthStateChanged(user => {
  if (user) {
    console.log('User logged In', user);
    // get data
    firestore
      .collection('guides')
      .get()
      .then(snapshot => {
        setupGuides(snapshot.docs);
      });
  } else {
    setupGuides([]);
  }
});

// sign up
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', e => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // create user on firebase
  firebaseAuth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // select sign up modal ui component
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch(err => console.log(err));
});

// sign out
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
  e.preventDefault();
  firebaseAuth.signOut();
});

// sign in
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // login user via firebase
  firebaseAuth
    .signInWithEmailAndPassword(email, password)
    .then(cred => {
      // select sign up modal ui component and close it
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch(err => console.log(err));
});
