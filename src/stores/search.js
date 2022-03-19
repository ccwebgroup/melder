import { defineStore } from "pinia";

import {
  db,
  auth,
  doc,
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
} from "boot/firebase";

export const useSearchStore = defineStore("search", {
  state: () => {
    return {
      searchResults: null,
    };
  },

  actions: {
    async getUserOnSearch(payload) {
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
        this.searchResults = resultArray;
      }
    },
  },
});
