import { Loading, Dialog, Notify } from "quasar";
import {
  auth,
  db,
  doc,
  updateProfile,
  updateDoc,
  updateEmail,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  EmailAuthProvider,
} from "boot/firebase";

// State
const state = {};

// Getters
const getters = {};

// Actions
const actions = {
  async updateUserProfile({ commit }, payload) {
    const notif = Notify.create({
      type: "ongoing",
      message: "Please wait...",
      timeout: 0,
      position: "center",
    });
    const authUser = auth.currentUser;
    updateProfile(authUser, {
      displayName: payload.displayName,
      photoURL: payload.photoURL,
    });

    if (payload.email !== authUser.email) {
      await updateEmail(authUser, payload.email);
    }

    const userRef = doc(db, "users", authUser.uid);

    await updateDoc(userRef, {
      bio: payload.bio,
      address: payload.address,
    });

    // commit('auth/setAuthUser', authUser, { root: true })
    notif({
      type: "positive",
      message: "Succesfully Updated!",
      timeout: 1000,
    });
  },

  async reAuthenticateUser({ commit, dispatch }, payload) {
    Loading.show();
    try {
      const credential = EmailAuthProvider.credential(
        payload.credential.email,
        payload.credential.password
      );

      reauthenticateWithCredential(auth.currentUser, credential).then(() => {
        dispatch("updateUserProfile", payload.newDetails);
        Loading.hide();
      });
    } catch (error) {
      Loading.hide();
      Dialog.create({
        title: "Authentication Error",
        message: error.message,
      });
    }
  },
};

// Mutations
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
