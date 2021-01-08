<template>
  <div>
    <basic-template
      :data-table="listData"
      :title="'供应商管理'"
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
        <h1>{{isUpdate? '修改供应商' : '添加供应商'}}</h1>
        <div class="inner-container">
          <div class="form-component" v-if="isUpdate">
            <label>供应商编号</label>
            <input type="text" v-model="form.id" disabled/>
          </div>
          <div class="form-component">
            <label>供应商名称</label>
            <input type="text" v-model="form.name" />
          </div>
          <div class="form-component">
            <label>电话</label>
            <input type="text" v-model="form.contact" />
          </div>
          <div class="form-component">
            <button class="btn-blue w-full py-3" @click="submit">提交</button>
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
const service = new BaseServices("provider", "providers");

export default {
  name: "Provider",
  components: { BasicTemplate, Modal },
  data() {
    return {
      service,
        searchQuery: '',
      listData: [],
      columns: ["name", "contact"],
      columnHeaders: ["供应商名称", "联系方式"],
      modalVisible: false,
      isUpdate: false,
      form: {
        id: "",
        name: "",
        phone: "",
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
<style scoped>
</style>
