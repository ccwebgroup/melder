import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
} from "boot/firebase";

const state = {};
const getters = {};

const actions = {
  logoutUser() {
    auth.signOut();
  },

  loginUser({ commit }, payload) {
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        // Signed in
        // setPersistence(auth, browserSessionPersistence)
        //   .then(() => {
        //     // Existing and future Auth states are now persisted in the current
        //     // session only. Closing the window would clear any existing state even
        //     // if a user forgets to sign out.
        //     // ...
        //     // New sign-in will be persisted with session persistence.
        //     return signInWithEmailAndPassword(auth, email, password);
        //   })
        //   .catch((error) => {
        //     // Handle Errors here.
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //   });
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  },

  handleAuthStateChanged({ commit }) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        this.$router.push("/home");
        // ...
      } else {
        // User is signed out
        this.$router.replace("/");
        console.log("User logged out!");
      }
    });
  },
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
