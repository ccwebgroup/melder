import { defineStore } from "pinia";
import { Loading, Notify, QSpinnerBall } from "quasar";
//Firebase
import {
  db,
  auth,
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  limit,
  arrayRemove,
  arrayUnion,
  serverTimestamp,
  increment,
  ref,
  getDownloadURL,
  storage,
  uploadString,
} from "boot/firebase";

//Other Stores
import { useUserStore } from "./users";
import { useNotifStore } from "./notifs";
import { useCodeStore } from "./invite-codes";
import { useSearchStore } from "./search";

export const useGroupStore = defineStore("groups", {
  state: () => {
    return {
      groupProfile: null,
      groupsManage: [],
    };
  },

  actions: {
    async softDeleteGroup(group_id) {
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

    // This will be process after the User accepted or Declined the group invite
    async deleteInviteList(notif) {
      const groupRef = doc(db, "groups", notif.groupId);
      await updateDoc(groupRef, {
        invites: arrayRemove(auth.currentUser.uid),
      });
    },

    async cancelGroupInvite(payload) {
      const searchStore = useSearchStore();
      //Remove from the group invites list
      const groupRef = doc(db, "groups", payload.groupId);
      await updateDoc(groupRef, {
        invites: arrayRemove(payload.userId),
      });
      //Remove User notification

      const notifRef = collection(
        doc(db, "users", payload.userId),
        "notifications"
      );
      const q = query(
        notifRef,
        where("groupId", "==", payload.groupId),
        where("type", "==", "group-invite"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((data) => {
        deleteDoc(doc(notifRef, data.id));
      });

      const index = searchStore.searchResults.findIndex(
        (user) => user.id == payload.userId
      );
      if (index !== -1) {
        searchStore.searchResults[index].invited = false;
      }
    },

    async sendGroupInvite(payload) {
      const searchStore = useSearchStore();
      const notifStore = useNotifStore();
      const groupRef = doc(db, "groups", payload.groupId);
      const docSnap = updateDoc(groupRef, {
        invites: arrayUnion(payload.userId),
      });
      notifStore.addUserNotification({ ...payload, type: "group-invite" });
      const index = searchStore.searchResults.findIndex(
        (user) => user.id == payload.userId
      );
      if (index !== -1) {
        searchStore.searchResults[index].invited = true;
      }
    },

    async updateGroupProfile(payload) {
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
        await this.addGroupAvatar({
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
      this.getGroupProfile(docSnap.id);

      notif({
        type: "positive",
        message: "Succesfully Updated!",
        timeout: 1000,
      });
    },

    async getGroupProfile(groupId) {
      const docRef = doc(db, "groups", groupId);
      const docSnap = await getDoc(docRef);
      const groupData = docSnap.data();
      groupData.id = docSnap.id;
      const index = groupData.roles.findIndex(
        (role) => role.userId == auth.currentUser.uid
      );
      if (index !== -1) {
        groupData.hasRole = groupData.roles[index];
      }
      this.groupProfile = groupData;
      return groupData;
    },

    async getGroupsManage() {
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
      this.groupsManage = groups;
    },

    async addMember(payload) {
      const groupRef = doc(db, "groups", payload.groupId);
      const membersRef = collection(groupRef, "members");
      const docRef = doc(membersRef, payload.userId);
      setDoc(docRef, { memberSince: serverTimestamp() });
      await updateDoc(groupRef, {
        membersCount: increment(1),
      });
    },

    async addGroup(payload) {
      const userStore = useUserStore();
      const codeStore = useCodeStore();
      Loading.show({
        spinner: QSpinnerBall,
      });
      const authUser = auth.currentUser;
      const groupDetails = {
        creatorId: authUser.uid,
        createdAt: serverTimestamp(),
        name: payload.name,
        description: payload.description,
        private: payload.private,
        roles: [
          {
            userId: authUser.uid,
            roleName: "Administrator",
            settings: { all: true },
          },
        ],
      };

      const groupRef = await addDoc(collection(db, "groups"), groupDetails);
      if (groupRef.id) {
        // Generate an invite code that does not expire
        codeStore.addInviteCode({
          expiration: false,
          groupId: groupRef.id,
        });

        // Add Creator as Admin
        this.addMember({ userId: authUser.uid, groupId: groupRef.id });

        // Set Group Avatar save to Storage
        await this.addGroupAvatar({
          newGroup: true,
          id: groupRef.id,
          photo: payload.photo,
        });

        // Add the Group to User's Groups Manage
        await userStore.addGroupManage({
          userId: authUser.uid,
          groupId: groupRef.id,
        });
      }
      Loading.hide();
      return groupRef.id;
    },

    async addGroupAvatar(payload) {
      if (payload.photo) {
        const avatarsRef = ref(
          storage,
          "groups/" + payload.id + "/avatar/" + payload.id
        );
        await uploadString(avatarsRef, payload.photo, "data_url");
        const url = await getDownloadURL(avatarsRef);
        // Update Group Avatar Url
        const docRef = doc(db, "groups", payload.id);
        await updateDoc(docRef, {
          photoURL: url,
        });
        //  Redirect new Group to profile page
        if (!payload.newGroup) {
          //Relaod the element image source
          let el = document.querySelector("#group_avatar");
          if (el.src) {
            el.src = url;
          }
        }
      }
    },
  },
});
