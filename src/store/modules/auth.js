import {
  auth,
  db,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
} from "boot/firebase";

import { Loading, Dialog } from "quasar";

const state = {
  authUser: {},
};
const getters = {};

const actions = {
  logoutUser() {
    auth.signOut();
  },

  signUpUser({ commit, dispatch }, payload) {
    Loading.show();
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        updateProfile(user, {
          displayName: payload.displayName,
        });

        // ...
        Loading.hide();
      })
      .catch((error) => {
        const errorCode = error.code;
        let errMessage;

        switch (errorCode) {
          case "auth/email-already-in-use":
            errMessage = "Email is already registered!";
            break;
          case "auth/invalid-email":
            errMessage = "Invalid Email.";
            break;
          case "auth/operation-not-allowed":
            errMessage = "Operation is not allowed.";
            break;
          case "auth/weak-password":
            errMessage =
              "Password is weak. Try putting some symbols and numbers. Should be 8 digits or more.";
            break;
        }

        Loading.hide();
        Dialog.create({
          title: "Sign Up Error",
          message: errMessage,
        }).onOk(() => {
          // console.log('OK')
        });
      });
  },

  loginUser({ commit }, payload) {
    Loading.show();
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        Loading.hide();
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        let errMessage;

        switch (errorCode) {
          case "auth/invalid-email":
            errMessage = "Email is invalid";
            break;
          case "auth/user-not-found":
            errMessage = "User is not registered.";
            break;
          case "auth/wrong-password":
            errMessage = "Wrong password.";
            break;
        }

        Loading.hide();
        Dialog.create({
          title: "Login Error",
          message: errMessage,
        }).onOk(() => {
          // console.log('OK')
        });
      });
  },

  handleAuthStateChanged({ commit }) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$router.push("/home");
        commit("setAuthUser", user);
        console.log(user);
      } else {
        // User is signed out
        this.$router.replace("/login");
      }
    });
  },
};

const mutations = {
  setAuthUser: (state, user) => (state.authUser = user),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
