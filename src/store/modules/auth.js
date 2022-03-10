import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
} from "boot/firebase";
import {
  db,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "boot/firebase";
import { Loading, Dialog, Dark } from "quasar";

const state = {
  authUser: {},
};

const getters = {
  getUser: (state) => {
    return state.authUser;
  },
};

const actions = {
  logoutUser() {
    auth.signOut();
  },

  async signUpUser({ dispatch }, payload) {
    Loading.show();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );

      // If user successfully signed up
      if (userCredential.user) {
        const user = userCredential.user;
        //Add and set UserProfile
        dispatch(
          "user/addUserProfile",
          {
            id: ser.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: null,
          },
          { root: true }
        );
        Loading.hide();
        this.$router.push("/group/create");
      }
    } catch (error) {
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
      console.log(error);
      // A Dialog to display Sign up Error
      Dialog.create({
        title: "Sign Up Error",
        message: errMessage,
      });
    }
  },

  loginUser({ commit }, payload) {
    Loading.show();
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        const user = userCredential.user;
        commit("setAuthUser", user);
        dispatch("user/getUserProfile", user.uid, { root: true });
        this.$router.push("/home");
        Loading.hide();
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

  handleAuthStateChanged({ commit, dispatch }) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch("user/getUserProfile", user.uid, { root: true });
        commit("setAuthUser", user);
      } else {
        this.$router.replace("/login");
      }
    });
  },
};

const mutations = {
  setAuthUser: (state, user) => {
    state.authUser = user;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
