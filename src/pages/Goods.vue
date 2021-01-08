<template>
  <div>
    <basic-template
      :data-table="listData"
      :title="'货物管理'"
      :columns="columns"
      :column-headers="columnHeaders"
      @searchClick="search"
      @addClick="add"
      @editClick="edit"
      @removeClick="remove"
    />
    <modal :is-visible="modalVisible" @modalClosing="closeModal">
      <div class="card w-3/4 max-h-full">
        <h1>{{isUpdate ? '修改产品' : '添加产品'}}</h1>
        <div class="form-component">
          <label>选择提供者</label>
          <p v-if="validations['provider_id']" class="error">{{validations['provider_id'][0]}}</p>
          <datagrid
            :data-table="listProviderData"
            :columns="providerColumns"
            :column-headers="providerColumnHeaders"
            :selection-mode="true"
            v-bind:selected.sync="form.provider_id"
            selectionKey="id"
          />
        </div>
        <div class="form-component" v-if="isUpdate">
          <label>工作编号</label>
          <input type="text" v-model="form.id" disabled />
        </div>
        <div class="form-component">
          <label>产品名称</label>
          <input type="text" v-model="form.name" />
          <p v-if="validations['name']" class="error">{{validations['name'][0]}}</p>
        </div>
        <div class="form-component">
          <button class="btn-blue w-full py-3" @click="submit">提交</button>
        </div>
      </div>
    </modal>
  </div>
</template>
<script type="text/javascript">
import BaseServices from "@/components/services/BaseServices";
import Modal from "@/components/Modal";
import Datagrid from "@/components/Datagrid";
import BasicTemplate from "@/components/BasicTemplate";
import Functions from "@/components/Functions";

const service = new BaseServices("goods", "goods");
const providerService = new BaseServices("provider");

export default {
  name: "Goods",
  components: { BasicTemplate, Modal, Datagrid },
  data() {
    return {
      service,
      listData: [],
      columns: ["name", "provider.name"],
      columnHeaders: ["产品", "提供者"],
      listProviderData: [],
      providerColumns: ["name", "contact"],
      providerColumnHeaders: ["提供者", "联系方式"],
      validations: [],
      modalVisible: false,
      isUpdate: false,
      form: {
        id: 0,
        provider_id: 0,
        name: "",
      },
    };
  },
  async mounted() {
    this.loadAll();
  },
  methods: {
    ...Functions,
    async beforeAdd() {
      this.listProviderData = await providerService
        .getAll("")
        .then((res) => res);
    },
    async beforeEdit() {
      this.beforeAdd();
    },
    beforeSubmit() {
      if (!this.form.provider_id) {
        this.validations.provider_id = ["必须选提供者"];
      }
    },
  },
};
</script>
