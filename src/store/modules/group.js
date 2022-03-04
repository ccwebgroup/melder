import { Loading, Dialog } from "quasar";
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
} from "boot/firebase";

const state = {
  groupDetails: null,
  groups_manage: null,
};

const getters = {
  getProfile: (state) => {
    return state.groupDetails;
  },
  //  return {
  //   name: state.groupDetails.name,
  //   description: state.groupDetails.description,
  // };
};

const actions = {
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
        roles: [{ role_name: "Administrator" }],
      });
      if (docRef.id) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        updateDoc(userRef, {
          groups_manage: arrayUnion({ group_id: docRef.id }),
        });

        dispatch("clearGroupDetails", docRef.id);
      }
      Loading.hide();
    } catch (e) {
      console.error("Error adding document: ", e);
      Loading.hide();
    }
  },

  async viewGroupProfile({ commit }, payload) {
    const docRef = doc(db, "groups", payload);
    const docSnap = await getDoc(docRef);
    commit("setGroupDetails", docSnap.data());
  },

  async clearGroupDetails({ commit }, id) {
    commit("setClearedDetails");
    this.$router.push("/group/" + id);
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
  setClearedDetails: (state) => (state.groupDetails = {}),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
