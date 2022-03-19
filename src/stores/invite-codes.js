import { defineStore } from "pinia";

//Firebase
import {
  db,
  doc,
  auth,
  collection,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "boot/firebase";

//Other Stores
import { useGroupStore } from "./groups";
import { useNotifStore } from "./notifs";

export const useCodeStore = defineStore("inviteCodes", {
  state: () => {
    return {
      inviteCodes: [],
    };
  },

  actions: {
    async acceptInvite(notif) {
      const authUserId = auth.currentUser.uid;
      const groupStore = useGroupStore();
      const notifStore = useNotifStore();
      //Add user to the group
      await groupStore.addMember({
        groupId: notif.groupId,
        userId: auth.currentUser.uid,
      });
      //Add group to users Joined Groups list
      const joinedGroupsRef = doc(
        collection(doc(db, "users", authUserId), "joinedGroups"),
        notif.groupId
      );
      await setDoc(joinedGroupsRef, {});
      // Delete Notif
      await notifStore.deleteNotif(notif);
      //Remove from the group's invite list
      await groupStore.deleteInviteList(notif);
    },

    async declineInvite(notif) {
      const notifStore = useNotifStore();
      const groupStore = useGroupStore();
      // Delete Notif
      await notifStore.deleteNotif(notif);
      //Remove from the group's invite list
      await groupStore.deleteInviteList(notif);
    },

    async getInviteCodes(payload) {
      const codeRef = collection(db, "inviteCodes");
      const q = query(
        codeRef,
        where("creatorId", "==", auth.currentUser.uid),
        where("groupId", "==", payload.groupId)
      );

      const querySnapshot = await getDocs(q);
      const inviteCodes = [];
      querySnapshot.forEach((docSnap) => {
        let inviteCode = docSnap.data();
        inviteCode.id = docSnap.id;
        inviteCodes.push(inviteCode);
      });
      this.inviteCodes = inviteCodes;
    },

    async addInviteCode(payload) {
      payload.creatorId = auth.currentUser.uid;
      payload.createdAt = serverTimestamp();
      const codeRef = await addDoc(collection(db, "inviteCodes"), payload);
      this.inviteCodes.push({
        ...payload,
        id: codeRef.id,
      });
      return {
        ...payload,
        id: codeRef.id,
      };
    },
  },
});
