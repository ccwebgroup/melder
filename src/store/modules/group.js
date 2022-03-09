import { Loading, Dialog, Notify } from "quasar";
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
} from "boot/firebase";

const state = {
  groupDetails: null,
  groups_manage: null,
};

const getters = {};

const actions = {
  async updateGroupProfile({ commit }, payload) {
    const notif = Notify.create({
      type: "ongoing",
      message: "Please wait...",
      timeout: 0,
      position: "center",
    });
    const batch = writeBatch(db);
    const docRef = doc(db, "groups", payload.id);
    if (payload.photoURL) {
      batch.update(docRef, { photoURL: payload.photoURL });
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
    const groupDocSnap = await getDoc(groupRef);
    const groupData = groupDocSnap.data();
    groupData.id = groupDocSnap.id;
    commit("setGroupDetails", groupData);

    notif({
      type: "positive",
      message: "Succesfully Updated!",
      timeout: 1000,
    });
  },

  async getGroupsManage({ commit }) {
    let creator_id = auth.currentUser.uid;
    const q = query(
      collection(db, "groups"),
      where("creator_id", "==", creator_id)
    );

    const querySnapshot = await getDocs(q);
    let groups = [];
    querySnapshot.forEach((doc) => {
      let group = doc.data();
      group.id = doc.id;
      groups.push(group);
    });
    commit("setGroupsManage", groups);
  },

  async addGroup({ commit, dispatch }, payload) {
    Loading.show();
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        creator_id: auth.currentUser.uid,
        created: Date.now(),
        name: payload.name,
        description: payload.description,
        photoURL: payload.photo,
        members: [
          {
            id: auth.currentUser.uid,
            role: "Administrator",
          },
        ],
        roles: [{ role_name: "Administrator", settings: { all: true } }],
      });
      if (docRef.id) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        updateDoc(userRef, {
          groups_manage: arrayUnion({ group_id: docRef.id }),
        });
        this.$router.push("/group/" + docRef.id);
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
    group.members.forEach((member) => {
      if (member.id == authUserId) {
        let myRole = member.role;
        group.roles.forEach((role) => {
          if (myRole == role.role_name) {
            group.myRole = role;
          }
          state.groupDetails = group;
        });
      }
    });
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
