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
  limit,
  increment,
  where,
  onSnapshot,
} from "boot/firebase";
import { isInDestructureAssignment } from "@vue/compiler-core";

// State
const state = {
  profile: null,
  authUser: null,
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
  async deleteNotification({}, notif) {
    const userRef = doc(db, "users", auth.currentUser.uid);
    updateDoc(userRef, {
      notifications: arrayRemove(notif),
    }).then(() => {
      commit("setNotification", notif);
    });
  },

  async acceptInvite({ dispatch }, notif) {
    const groupRef = doc(db, "groups", notif.groupId);
    dispatch(
      "group/addMember",
      { groupId: notif.groupId, userId: auth.currentUser.uid },
      { root: true }
    ).then(() => {
      //Remove Notification
      dispatch("updateNotification", notif);
      //Remove from the group's invite list
      dispatch("group/removeInviteList", notif.groupId, { root: true });
    });
  },

  async declineInvite({}, groupId) {
    console.log(groupId);
  },

  async getNotifications({ commit, dispatch }) {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const unsub = await onSnapshot(userRef, (doc) => {
      const notif = doc.data().notifications;
      notif.forEach((item) => {
        if (item.type === "group-invite") {
          dispatch("getOtherUser", item.from).then((user) => {
            item.from = user;
          });
          dispatch(
            "group/getGroupDetails",
            { groupId: item.groupId, notif: true },
            { root: true }
          ).then((group) => (item.group = group));
        }
      });
      commit("setNotification", notif);
    });
  },

  async getOtherUser({}, id) {
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const user = docSnap.data();
      user.id = id;
      return user;
    }
  },

  async notifyUser({}, payload) {
    const authUserId = auth.currentUser.uid;
    const userRef = doc(db, "users", payload.userId);

    await updateDoc(userRef, {
      notifications: arrayUnion({
        createdAt: Date.now(),
        type: "group-invite",
        from: authUserId,
        groupId: payload.groupId,
        unread: false,
      }),
    });
  },

  async addUserProfile({ commit }, user) {
    try {
      const userRef = await setDoc(doc(db, "users", user.id), user);
      commit("setUserProfile", user);
    } catch (e) {
      console.log(e);
    }
  },

  async getPeopleOnSearch({ commit }, payload) {
    commit("setSearchResults", null);
    if (payload.keyword) {
      const userRef = collection(db, "users");
      const q = query(
        userRef,
        orderBy("displayName"),
        startAt(payload.keyword),
        endAt(payload.keyword + "\uf8ff"),
        limit(8)
      );

      const querySnapshot = await getDocs(q);
      const resultArray = [];
      querySnapshot.forEach((docSnap) => {
        let user = docSnap.data();
        user.id = docSnap.id;
        // Check if user was invited
        const groupRef = doc(db, "groups", payload.groupId);
        getDoc(groupRef).then((groupSnapData) => {
          const group = groupSnapData.data();
          if (group.invites) {
            if (group.invites.includes(docSnap.id)) {
              user.invited = true;
            }
          }
        });
        if (docSnap.id !== auth.currentUser.uid) {
          resultArray.push(user);
        }
      });
      commit("setSearchResults", resultArray);
    }
  },

  async getUserProfile({ commit }, id) {
    const userRef = doc(db, "users", id);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const user = docSnap.data();
      user.id = id;
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
            let el = document.querySelector("#profile_avatar");
            if (el.src) {
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
    if (payload.email) {
      if (payload.email !== authUser.email) {
        await updateEmail(authUser, payload.email);
        await updateDoc(userRef, {
          email: payload.email,
        });
      }
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

    dispatch("auth/getAuthUserProfile", authUser.uid, { root: true });
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

      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          //  If User updates sensitive details
          if (payload.newDetails) {
            dispatch("updateUserProfile", payload.newDetails);
          }

          if (payload.group_id) {
            dispatch("group/softDeleteGroup", payload.group_id, { root: true });
          }
          Loading.hide();
        })
        .catch((err) => {
          let errMessage;
          switch (err.code) {
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
            title: "Authentication Error",
            message: errMessage,
          });
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
  updateNotification: (state, notif) => {
    state.notifications.filter((item) => item !== notif);
  },
  setNotification: (state, notifications) =>
    (state.notifications = notifications),
  setSearchResults: (state, results) => (state.searchResults = results),
  setUserProfile: (state, user) => (state.profile = user),
  updateSearch: (state, userId) => {
    const index = state.searchResults.findIndex((item) => item.id === userId);
    if (index >= 0) {
      state.searchResults[index].invited = true;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
