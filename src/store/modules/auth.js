import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
} from "boot/firebase";
import { db, collection, addDoc, getDocs, setDoc } from "boot/firebase";
import { doc, where } from "firebase/firestore";
import { Loading, Dialog } from "quasar";

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

  signUpUser({ commit }, payload) {
    Loading.show();
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: payload.displayName,
        });
        if (user) {
          const docRef = setDoc(doc(db, "users", user.uid), {
            groups_manage: [],
          });
        }

        this.$router.replace("/group/create");
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
        const user = userCredential.user;
        commit("setAuthUser", user);
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

  handleAuthStateChanged({ commit }) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
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
