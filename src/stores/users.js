import { defineStore } from "pinia";
// Quasar Plugins
import { Notify } from "quasar";

//Firebase
import {
  db,
  auth,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  updateProfile,
  updateEmail,
  arrayUnion,
  arrayRemove,
  ref,
  storage,
  uploadString,
  getDownloadURL,
} from "boot/firebase";

//Other Stores
import { useAuthStore } from "./auth";

export const useUserStore = defineStore("users", {
  state: () => {
    return {
      userProfile: null,
    };
  },

  actions: {
    async updateUserProfile(payload) {
      const authStore = useAuthStore();
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
      const authUserProfile = await this.getUserProfile(authUser.uid);
      authStore.authUserProfile = authUserProfile;

      notif({
        type: "positive",
        message: "Succesfully Updated!",
        timeout: 1000,
      });
    },

    async getUserProfile(id) {
      const userRef = doc(db, "users", id);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const user = docSnap.data();
        user.id = id;
        return user;
      }
    },

    async addGroupManage(payload) {
      const userRef = doc(db, "users", payload.userId);
      const groupsManageRef = collection(userRef, "groupsManage");
      const docRef = doc(groupsManageRef, payload.groupId);
      await setDoc(docRef, {});
    },

    async addUserProfile(user) {
      await setDoc(doc(db, "users", user.id), user);
      return user;
    },
  },
});
