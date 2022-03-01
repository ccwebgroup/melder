const routes = [
  //Authentication Routes
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "/auth/login", component: () => import("pages/auth/Login.vue") },
      {
        path: "/auth/signup",
        component: () => import("pages/auth/Signup.vue"),
      },
    ],
  },

  // Main Routes
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    redirect: "/home",
    children: [
      { path: "/home", component: () => import("pages/user/Home.vue") },
      { path: "/files", component: () => import("pages/files/Files.vue") },
      { path: "/groups", component: () => import("pages/group/Groups.vue") },
      {
        path: "/updates",
        component: () => import("pages/updates/Updates.vue"),
      },
    ],
  },

  //User Profile Routes
  {
    path: "/user",
    component: () => import("layouts/UserLayout.vue"),
    children: [
      {
        path: "/user/profile",
        component: () => import("pages/user/UserProfile.vue"),
      },
    ],
  },

  //Group Routes
  {
    path: "/group/",
    component: () => import("layouts/GroupLayout.vue"),
    children: [
      {
        path: "/group/create",
        component: () => import("pages/group/CreateGroup.vue"),
      },
      {
        path: "/group/:id",
        component: () => import("pages/group/GroupProfile.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
