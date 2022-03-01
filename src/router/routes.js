const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    // children: [
    //   { path: "", redirect}
    // ]
  },

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

  // User Routes
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: "/home" },
      { path: "/home", component: () => import("pages/user/Home.vue") },
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
