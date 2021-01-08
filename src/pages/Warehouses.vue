<template>
  <div>
    <basic-template
      :data-table="listData"
      :title="'仓库管理'"
      :columns="columns"
      :column-headers="columnHeaders"
        :filter="searchQuery"
      @searchClick="search"
      @addClick="add"
      @editClick="edit"
      @removeClick="remove"
    ></basic-template>
    <modal :is-visible="modalVisible" @modalClosing="closeModal">
      <div class="card w-1/3 max-h-full">
        <h1>{{isUpdate? '修改仓库' : '添加仓库'}}</h1>
        <div class="inner-container">
          <div class="form-component" v-if="isUpdate">
            <label>仓库编号</label>
            <input type="text" v-model="form.id" disabled/>
          </div>
          <div class="form-component">
            <label>仓库名称</label>
            <input type="text" v-model="form.name" />
          </div>
          <div class="form-component">
            <label>仓库名称</label>
            <input type="text" v-model="form.address" />
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import BaseServices from "@/components/services/BaseServices";
import Modal from "@/components/Modal";
import BasicTemplate from "@/components/BasicTemplate";
import Functions from "@/components/Functions";

const service = new BaseServices("warehouse", "warehouses");
export default {
  name: "Manager",
  components: { BasicTemplate, Modal },
  data() {
    return {
      service,
        searchQuery: '',
      listData: [],
      validations: [],
      columns: ["name", "address"],
      columnHeaders: ["名称", "地址"],
      modalVisible: false,
      isUpdate: false,
      form: {
        id: 0,
        name: "",
        address: "",
      },
    };
  },
  async mounted() {
    this.loadAll();
  },

  methods: {
    ...Functions,
  },
};
</script>

<style>
</style>
