import { route } from "quasar/wrappers";
import { auth } from "./firebase";

export default ({ router, store, Vue }) => {
  router.beforeEach(async (to, from) => {
    if (to.meta.requiresAuth && !auth.currentUser) {
      return {
        path: "/login",
        // save the location we were at to come back later
        // query: { redirect: to.fullPath },
      };
    }

    // If user is Auth can't go to login page
    // if (to.fullPath === "/login" && auth.currentUser) {
    //   return false;
    // }
  });
};
