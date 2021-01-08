<template>
  <div>
    <master-main class="static">
      <div class="card w-3/4">
        <h1>{{title}}</h1>
        <div class="action-bar">
          <button class="add-button" @click="add">添加 +</button>
        </div>
        <div class="action-bar">
          <input type="text" class="flex-grow mr-2" v-model="searchQuery" />
          <button class="w-1/6 btn-blue" @click="search">查询</button>
        </div>
        <datagrid
          :dataTable="dataTable"
          :columns="columns"
            :columnHeaders="columnHeaders"
            :filter="searchQuery"
          @editClick="edit"
          @deleteClick="remove"
        ></datagrid>
      </div>
    </master-main>
  </div>
</template>

<script>
import MasterMain from "./MasterMain";
import Datagrid from "@/components/Datagrid";
export default {
  name: "BasicTemplate",
  components: { Datagrid, MasterMain },
  props: ["dataTable", "columns", "columnHeaders", "title", "filter"],
  data() {
    return {
      searchQuery: "",
    };
  },

  methods: {
    add() {
      this.$emit("addClick");
    },

    edit(param) {
      this.$emit("editClick", param);
    },
    remove(param) {
      this.$emit("removeClick", param);
    },
    async search() {
      const query = this.searchQuery.trim();
      // if(query.length === 0) return;
      this.$emit("searchClick", query);
    },
  },
};
</script>
<style scoped>
</style>
