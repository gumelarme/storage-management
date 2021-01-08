<template>
  <div>
    <nav
      class="flex items-center justify-between flex-wrap p-3 fixed w-full top-0"
      :class="[!isManager ? 'bg-green-700': 'bg-blue-700']"
    >
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl">仓库管理系统</span>
      </div>
      <div class="w-full block-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <router-link
            class="header-menu"
            :class="'hover:'+[!isManager ? 'bg-green-500': 'bg-blue-500']"
            v-for="(menu, index) in getMenu()"
            :key="index"
            :to="menu.path"
          >{{menu.title}}</router-link>
        </div>
        <div>
          <a class="logout-button" @click="logout">退出</a>
        </div>
      </div>
    </nav>
    <div id="container">
       <slot></slot>
    </div>
  </div>
</template> 

<script>
 // import Auth from "@/components/services/Auth";

export default {
  name: "MasterMain",
  data() {
    return {
      isManager: false,
      menuList: [
        { path: "/goods", title: "货物管理" },
        { path: "/providers", title: "供货商管理" },
        { path: "/warehouses", title: "仓库管理" },
        { path: "/storages", title: "库存记录" },
      ],
      
        managerMenu: [{ path: "/managers", title: "员工管理" }],
    };
  },

  async mounted() {
    const authCookie = this.$cookies.get("auth");
      if(!authCookie) {
          this.redirectToLogin();
          return
      }

    switch (await authCookie.is_manager) {
      case -1:
        this.$cookies.remove("auth");
        break;
      case 0:
      case 1:
        this.isManager = authCookie.is_manager;
    }

  },
  methods: {
    getMenu() {
        const x =(this.isManager ? this.managerMenu : []);
        return [
            ...this.menuList,
            ...x
        ];
    },
    logout() {
      this.$cookies.remove("auth");
      this.redirectToLogin();
    },
    redirectToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang='postcss'>
#container {
  @apply mt-56;
}

.header-menu {
  @apply block py-2 px-4 text-gray-200;
}

@screen lg {
  .header-menu {
    @apply inline-block mt-0;
  }

  .logout-button {
    @apply mt-0;
  }

  #container {
    @apply mt-24;
  }
}

.header-menu:hover {
  @apply text-white;
}

.logout-button {
  @apply inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white py-2;
}

.logout-button:hover {
  @apply border-transparent text-green-500 bg-white;
}
</style>
