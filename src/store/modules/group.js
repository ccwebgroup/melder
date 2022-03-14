import { Loading, Dialog, Notify, date } from "quasar";
import { useRoute } from "vue-router";

import {
  auth,
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  writeBatch,
  increment,
  storage,
  ref,
  uploadString,
  getDownloadURL,
  deleteDoc,
  orderBy,
} from "boot/firebase";

const state = {
  groupDetails: null,
  groups_manage: null,
};

const getters = {};

const actions = {
  async removeInviteList({}, groupId) {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      invites: arrayRemove(auth.currentUser.uid),
    });
  },

  async getGroupDetails({}, payload) {
    if (payload.notif) {
      const groupRef = doc(db, "groups", payload.groupId);
      const docSnap = await getDoc(groupRef);
      if (docSnap.exists()) {
        const group = docSnap.data();
        group.id = payload.groupId;
        return group;
      }
    }
  },

  // If user was reauthenticated
  async softDeleteGroup({}, group_id) {
    try {
      const groupRef = doc(db, "groups", group_id);
      const userRef = doc(db, "users", auth.currentUser.uid);
      const groupMangeRef = collection(userRef, "groupsManage");
      await updateDoc(groupRef, {
        softDelete: true,
      });
      await updateDoc(doc(groupMangeRef, group_id), {
        softDelete: true,
      });

      Notify.create({
        type: "positive",
        message: "Succesfully deleted!",
        timeout: 1000,
      });
      this.$router.push("/groups");
    } catch (err) {
      Dialog.create({
        title: "Error",
        message: err.message,
      });
    }
  },

  async sendGroupInvite({ commit, dispatch }, payload) {
    const groupRef = doc(db, "groups", payload.groupId);
    const docSnap = updateDoc(groupRef, {
      invites: arrayUnion(payload.userId),
    });
    dispatch("user/notifyUser", payload, { root: true });
    commit("user/updateSearch", payload.userId, { root: true });
  },

  async addMember({}, payload) {
    const groupRef = doc(db, "groups", payload.groupId);
    const membersRef = collection(groupRef, "members");
    const docRef = doc(membersRef, payload.userId);
    setDoc(docRef, {});
    await updateDoc(groupRef, {
      membersCount: increment(1),
    });
  },

  async updateGroupProfile({ commit, dispatch }, payload) {
    const notif = Notify.create({
      type: "ongoing",
      message: "Please wait...",
      timeout: 0,
      position: "center",
    });
    const batch = writeBatch(db);
    const docRef = doc(db, "groups", payload.id);
    batch.update(docRef, { updatedAt: Date.now() });

    if (payload.photoURL) {
      dispatch("setGroupAvatar", {
        id: payload.id,
        photo: payload.photoURL,
      });
    }
    if (payload.name) {
      batch.update(docRef, { name: payload.name });
    }
    if (payload.description) {
      batch.update(docRef, { description: payload.description });
    }
    // Commit the batch
    const result = await batch.commit();

    const groupRef = doc(db, "groups", payload.id);
    const docSnap = await getDoc(groupRef);
    const groupData = docSnap.data();
    groupData.id = docSnap.id;
    commit("setGroupDetails", groupData);

    notif({
      type: "positive",
      message: "Succesfully Updated!",
      timeout: 1000,
    });
  },

  async setGroupAvatar({}, payload) {
    if (payload.photo) {
      const avatarsRef = ref(
        storage,
        "groups/" + payload.id + "/avatar/" + payload.id
      );
      uploadString(avatarsRef, payload.photo, "data_url").then((snapshot) => {
        getDownloadURL(avatarsRef)
          .then((url) => {
            // Update Group Avatar Url
            const docRef = doc(db, "groups", payload.id);
            updateDoc(docRef, {
              photoURL: url,
            });
          })
          .then(() => {
            //Redirect new Group to profile page
            if (payload.newGroup) {
              this.$router.push("/group/" + payload.id);
            }
          });
      });
    }
  },

  async getGroupsManage({ commit }) {
    let authUserId = auth.currentUser.uid;
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("creatorId", "==", authUserId));

    const querySnapshot = await getDocs(q);
    let groups = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      if (!data.softDelete) {
        groups.push(data);
      }
    });
    commit("setGroupsManage", groups);
  },

  async addGroup({ dispatch }, payload) {
    Loading.show();
    const authUser = auth.currentUser;
    const groupDetails = {
      creatorId: authUser.uid,
      createdAt: Date.now(),
      name: payload.name,
      description: payload.description,
      roles: [
        {
          userId: authUser.uid,
          roleName: "Administrator",
          settings: { all: true },
        },
      ],
    };

    try {
      const groupRef = await addDoc(collection(db, "groups"), groupDetails);
      if (groupRef.id) {
        dispatch("addMember", { userId: authUser.uid, groupId: groupRef.id });
        await dispatch("setGroupAvatar", {
          newGroup: true,
          id: groupRef.id,
          photo: payload.photo,
        });
        const userRef = doc(db, "users", authUser.uid);
        const groupsManageRef = collection(userRef, "groupsManage");
        const docRef = doc(groupsManageRef, groupRef.id);
        await setDoc(docRef, {});
      }
      Loading.hide();
    } catch (e) {
      console.error("Error adding document: ", e);
      Loading.hide();
    }
  },

  async viewGroupProfile({ commit }, group_id) {
    const docRef = doc(db, "groups", group_id);
    const docSnap = await getDoc(docRef);
    const groupData = docSnap.data();
    groupData.id = docSnap.id;
    commit("setGroupDetails", groupData);
  },
};

const mutations = {
  setGroupDetails: (state, group) => {
    let authUserId = auth.currentUser.uid;
    group.roles.forEach((role) => {
      if (role.userId == authUserId) {
        group.hasRole = role;
      }
    });
    state.groupDetails = group;
  },
  setGroupsManage: (state, data) => (state.groups_manage = data),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
