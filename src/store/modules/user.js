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
  notifications: [],
  searchResults: null,
};

// Getters
const getters = {
  getProfile: (state) => state.profile,
  getNotifications: (state) => state.notifications,
};

// Actions
const actions = {
  async addGroupManage({}, payload) {
    const userRef = doc(db, "users", payload.userId);
    const groupsManageRef = collection(userRef, "groupsManage");
    const docRef = doc(groupsManageRef, payload.groupId);
    await setDoc(docRef, {});
  },

  async acceptInvite({ dispatch }, notif) {
    const authUserId = auth.currentUser.uid;
    const groupRef = doc(db, "groups", notif.groupId);
    //Add user to the group
    dispatch(
      "group/addMember",
      { groupId: notif.groupId, userId: auth.currentUser.uid },
      { root: true }
    ).then(() => {
      //Add group to users Joined Groups list
      const joinedGroupsRef = doc(
        collection(doc(db, "users", authUserId), "joinedGroups"),
        notif.groupId
      );
      setDoc(joinedGroupsRef, {});
      //Remove Notification
      dispatch("deleteNotification", notif);
      //Remove from the group's invite list
      dispatch("group/deleteInviteList", notif, { root: true });
    });
  },

  async declineInvite({ dispatch }, notif) {
    //Remove Notification
    dispatch("deleteNotification", notif);
    //Remove from the group's invite list
    dispatch("group/deleteInviteList", notif, { root: true });
  },

  async deleteNotification({}, notif) {
    const notifRef = doc(
      collection(doc(db, "users", auth.currentUser.uid), "notifications"),
      notif.id
    );
    deleteDoc(notifRef);
  },

  async getNotifications({ commit, dispatch }) {
    const notifRef = collection(
      doc(db, "users", auth.currentUser.uid),
      "notifications"
    );
    const q = query(notifRef, orderBy("createdAt"));
    const unsub = await onSnapshot(notifRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const notif = change.doc.data();
          notif.id = change.doc.id;
          if (notif.type === "group-invite") {
            dispatch("getOtherUser", notif.from).then((user) => {
              notif.from = user;
            });
            dispatch(
              "group/getGroupDetails",
              { groupId: notif.groupId, notif: true },
              { root: true }
            )
              .then((group) => (notif.group = group))
              .then(() => {
                commit("setNotification", notif);
              });
          }
        }
        if (change.type === "modified") {
          console.log("modified");
        }
        if (change.type === "removed") {
          commit("removeNotification", change.doc.id);
        }
      });
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

  async addUserNotification({}, payload) {
    const authUserId = auth.currentUser.uid;
    const notifRef = doc(
      collection(doc(db, "users", payload.userId), "notifications")
    );

    await setDoc(notifRef, {
      createdAt: serverTimestamp(),
      type: "group-invite",
      from: authUserId,
      groupId: payload.groupId,
      unread: true,
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

        const groupRef = doc(db, "groups", payload.groupId);
        // Check if user is a member
        const membersRef = collection(groupRef, "members");
        getDocs(membersRef).then((membersSnap) => {
          membersSnap.forEach((memDoc) => {
            if (memDoc.id == docSnap.id) {
              user.alreadyMember = true;
            }
          });
        });

        getDoc(groupRef).then((groupSnapData) => {
          const group = groupSnapData.data();
          if (group.invites) {
            // Check if user was invited
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

  async setTheme({ dispatch, commit }, value) {
    const authUser = auth.currentUser;
    const userRef = doc(db, "users", authUser.uid);
    const docSnap = await updateDoc(userRef, {
      darkTheme: value,
    });
    console.log(value);
    dispatch("getUserProfile", authUser.uid);
    commit("auth/updateAuthUserTheme", value, { root: true });
  },
};

// Mutations
const mutations = {
  removeNotification: (state, notifId) => {
    state.notifications = state.notifications.filter(
      (item) => item.id !== notifId
    );
  },
  setNotification: (state, notif) => {
    const index = state.notifications.findIndex((item) => item.id === notif.id);
    if (index === -1) {
      state.notifications.unshift(notif);
    }
  },
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
