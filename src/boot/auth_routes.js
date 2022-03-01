import { auth } from "./firebase";

export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some((route) => route.meta.requiresAuth)) {
      if (auth.currentUser) {
        console.log(auth);
        next();
      } else next("/login");
    }
  });
};
