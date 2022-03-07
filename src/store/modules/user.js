import { Loading, Dialog, Notify } from "quasar";
import {
  auth,
  db,
  doc,
  getDoc,
  updateProfile,
  updateDoc,
  updateEmail,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  storage,
  ref,
  uploadString,
  getDownloadURL,
} from "boot/firebase";

// State
const state = {
  profile: null,
};

// Getters
const getters = {};

// Actions
const actions = {
  async getUserProfile({ commit }, id) {
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    const authUser = auth.currentUser;
    if (docSnap.exists()) {
      const user = docSnap.data();
      user.id = docSnap.id;
      commit("setUserProfile", user);
    }
  },

  async updateUserProfile({ commit, dispatch }, payload) {
    //Auth user
    const authUser = auth.currentUser;
    let photoURL;
    const notif = Notify.create({
      type: "ongoing",
      message: "Please wait...",
      timeout: 0,
      position: "center",
    });

    // Change avatar or profile photo
    if (payload.photoURL !== authUser.photoURL) {
      const avatarsRef = ref(
        storage,
        "users/" + authUser.uid + "/avatar/" + authUser.uid
      );
      uploadString(avatarsRef, payload.photoURL, "data_url").then(
        (snapshot) => {
          getDownloadURL(avatarsRef).then((url) => {
            photoURL = url;
            updateProfile(authUser, {
              photoURL: photoURL,
            });
            //Relaod the element image source
            document.querySelector("#profile_avatar").src = url;
          });
        }
      );
    }

    if (payload.displayName) {
      updateProfile(authUser, {
        displayName: payload.displayName,
      });
    }

    if (payload.email !== authUser.email) {
      await updateEmail(authUser, payload.email);
    }

    const userRef = doc(db, "users", authUser.uid);

    await updateDoc(userRef, {
      bio: payload.bio,
      address: payload.address,
    });

    dispatch("getUserProfile", authUser.uid);

    commit("auth/setAuthUser", authUser, { root: true });
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

  async setTheme({ dispatch }, value) {
    const authUser = auth.currentUser;
    const userRef = doc(db, "users", authUser.uid);
    const docSnap = await updateDoc(userRef, {
      darkTheme: value,
    });
    dispatch("getUserProfile", authUser.uid);
  },
};

// Mutations
const mutations = {
  setUserProfile: (state, user) => (state.profile = user),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
