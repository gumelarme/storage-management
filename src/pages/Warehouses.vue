<template>
  <div>
    <div>
      <basic-template
        :data-table="listData"
        :title="'仓库管理'"
        :columns="columns"
        :column-headers="columnHeaders"
        :filter="searchQuery"
        :clickedRow.sync="rowClicked"
        selectionKey="id"
        @addClick="add"
        @editClick="edit"
        @removeClick="remove"
      >
        <div class="w-3/6 px-4">
          <h1 v-if="rowClicked > 0" class="pb-4">{{selectedWarehouse}}</h1>
          <datagrid
            :dataTable="listStorageData"
            :columns="storageColumns"
            :column-headers="storageColumnHeaders"
          ></datagrid>
        </div>
      </basic-template>
    </div>
    <modal :is-visible="modalVisible" @modalClosing="closeModal">
      <div class="card w-1/3 max-h-full">
        <h1>{{isUpdate? '修改仓库' : '添加仓库'}}</h1>
        <div class="inner-container">
          <div class="form-component" v-if="isUpdate">
            <label>仓库编号</label>
            <input type="text" v-model="form.id" disabled />
          </div>
          <div class="form-component">
            <label>仓库名称</label>
            <input type="text" v-model="form.name" />
            <p v-if="validations['name']" class="error">{{validations['name'][0]}}</p>
          </div>
          <div class="form-component">
            <label>仓库地址</label>
            <input type="text" v-model="form.address" />
            <p v-if="validations['address']" class="error">{{validations['use'][0]}}</p>
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
import Datagrid from "@/components/Datagrid";

import axios from "axios";
import { baseUrl } from "@/components/services/common";

const service = new BaseServices("warehouse", "warehouses");
export default {
  name: "Warehouse",
  components: { BasicTemplate, Modal, Datagrid },
  data() {
    return {
      service,
      searchQuery: "",
      listData: [],
      validations: [],
      columns: ["name", "address"],
      columnHeaders: ["名称", "地址"],
      storageColumns: ["goods.name", "quantity"],
      storageColumnHeaders: ["名称", "quantity"],
      modalVisible: false,
      isUpdate: false,
      rowClicked: -1,
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
  computed: {
    selectedWarehouse() {
      const warehouse = this.listData.find((wh) => wh.id === this.rowClicked);
      return warehouse.name;
    },
  },
  asyncComputed: {
    async listStorageData() {
      try {
        const resp = await axios.get(
          `${baseUrl}/warehouses/${this.rowClicked}/storages`
        );
        return resp.data.storages;
      } catch (err) {
        if (err.response.status === 404) {
          return [];
        }
      }
    },
  },

  methods: {
    ...Functions,
  },
};
</script>

<style>
</style>
