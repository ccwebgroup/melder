import { Loading, Dialog, Notify, Dark } from "quasar";
import {
  auth,
  db,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateProfile,
  updateDoc,
  deleteDoc,
  updateEmail,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  storage,
  ref,
  uploadString,
  getDownloadURL,
  arrayUnion,
  arrayRemove,
  query,
  collection,
  orderBy,
  startAt,
  endAt,
} from "boot/firebase";

// State
const state = {
  profile: null,
  searchResults: null,
};

// Getters
const getters = {
  getProfile: (state) => {
    return state.profile;
  },
};

// Actions
const actions = {
  async addUserProfile({ commit }, user) {
    console.log;
    try {
      const userRef = await setDoc(doc(db, "users", user.id), user);
      commit("setUserProfile", user);
    } catch (e) {
      console.log(e);
    }
  },

  async getPeopleOnSearch({ commit }, keyword) {
    commit("setSearchResults", null);
    if (keyword) {
      const userRef = collection(db, "users");
      const q = query(
        userRef,
        orderBy("displayName"),
        startAt(keyword),
        endAt(keyword + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const resultArray = [];
      querySnapshot.forEach((doc) => {
        let user = doc.data();
        user.id = doc.id;
        resultArray.push(user);
        console.log(doc.id, " => ", doc.data());
      });
      commit("setSearchResults", resultArray);
    }
  },

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
    const userRef = doc(db, "users", authUser.uid);
    let photoURL;
    const notif = Notify.create({
      type: "ongoing",
      message: "Please wait...",
      timeout: 0,
      position: "center",
    });

    // Change avatar or profile photo
    if (payload.photoURL && payload.photoURL !== authUser.photoURL) {
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
            updateDoc(userRef, {
              photoURL: photoURL,
            });

            //Relaod the element image source
            let el = document.querySelector("#profile_avatar").scroll;
            if (el) {
              el.src = url;
            }
          });
        }
      );
    }

    // Change Name
    if (payload.displayName) {
      updateProfile(authUser, {
        displayName: payload.displayName,
      });
      updateDoc(userRef, {
        displayName: payload.displayName,
      });
    }
    // Change Email
    if (payload.email !== authUser.email) {
      await updateEmail(authUser, payload.email);
    }

    // Change Bio, Address
    if (payload.bio || payload.address) {
      await updateDoc(userRef, {
        bio: payload.bio,
        address: payload.address,
      });
    }
    // Add Social, Link
    if (payload.link) {
      if (payload.delete) {
        await updateDoc(userRef, {
          social_links: arrayRemove(payload.link),
        });
      } else {
        await updateDoc(userRef, {
          social_links: arrayUnion(payload.link),
        });
      }
    }

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
        //  If User updates sensitive details
        if (payload.newDetails) {
          dispatch("updateUserProfile", payload.newDetails);
        }
        if (payload.group_id) {
          deleteDoc(doc(db, "groups", payload.group_id))
            .then(() => {
              Notify.create({
                type: "positive",
                message: "Succesfully deleted!",
                timeout: 1000,
              });
              this.$router.push("/groups");
            })
            .catch((err) => {
              Loading.hide();
              Dialog.create({
                title: "Error",
                message: err.message,
              });
            });
        }
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
  setSearchResults: (state, results) => (state.searchResults = results),
  setUserProfile: (state, user) => (state.profile = user),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
