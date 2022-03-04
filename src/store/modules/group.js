import { Loading, Dialog } from "quasar";

import { db, collection, addDoc, getDocs } from "boot/firebase";

const state = {
  groupDetails: {},
};
const getters = {};

const actions = {
  async addGroup({ commit }, payload) {
    Loading.show();
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        created: Date.now(),
        name: payload.name,
        description: payload.description,
        photoURL: payload.photo,
      });
      if (docRef.id) {
        this.$router.push("/group/" + docRef.id);
      }
      Loading.hide();
    } catch (e) {
      console.error("Error adding document: ", e);
      Loading.hide();
    }
  },

  async viewGroupProfile({ commit }, payload) {
    console.log(payload);
    const querySnapshot = await getDocs(collection(db, "groups"));
    querySnapshot.forEach((doc) => {
      commit("setGroupDetails", doc.data());
    });
  },
};

const mutations = {
  setGroupDetails: (state, data) => (state.groupDetails = data),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
