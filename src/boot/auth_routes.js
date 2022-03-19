import { boot } from "quasar/wrappers";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from "src/router";

export default boot(async ({ router }) => {
  const auth = getAuth();

  await new Promise((resolve) => {
    const stopObserver = onAuthStateChanged(getAuth(), (firebaseUser) => {
      resolve(firebaseUser);
      stopObserver();
    });
  });

  router.beforeEach((to, from) => {
    if (!to.meta.requiresAuth || from.path === "/login") {
      return;
    }

    if (auth.currentUser && to.path === "/login") {
      return { path: from.path };
    }

    if (auth.currentUser && to.path === "/signup") {
      return { path: from.path };
    }

    if (!auth.currentUser && to.path !== "/login") {
      return { path: "/login" };
    }
  });
});
