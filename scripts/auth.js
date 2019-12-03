// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = firebaseFunc.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(res => {
    console.log(res);
  });
});

// listen for auth status changes
firebaseAuth.onAuthStateChanged(user => {
  if (user) {
    console.log('User logged In', user);
    // get data
    // firestore
    //   .collection('guides')
    //   .get()
    //   .then(snapshot => {
    //     setupUI(user);
    //     setupGuides(snapshot.docs);
    //   });
    // get data in real-time
    firestore.collection('guides').onSnapshot(
      snapshot => {
        setupGuides(snapshot.docs);
        setupUI(user);
      },
      err => console.log(err.message)
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

// create new guide
const createForm = document.querySelector('#create-form');

createForm.addEventListener('submit', e => {
  e.preventDefault();

  firestore
    .collection('guides')
    .add({
      title: createForm['title'].value,
      content: createForm['content'].value
    })
    .then(() => {
      // select sign up modal ui component and close it
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch(err => console.log(err.message));
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
      return firestore
        .collection('users')
        .doc(cred.user.uid)
        .set({
          bio: signupForm['signup-bio'].value
        });
    })
    .then(() => {
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
      loginForm.reset();
    })
    .catch(err => console.log(err));
});
