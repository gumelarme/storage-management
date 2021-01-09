<template>
  <div>
    <datagrid
      :data-table="logData"
      :columns="columns"
      :column-headers="columnHeaders"
      :rowClass="setRowClass"
      @editClick="edit"
      @deleteClick="remove"
    ></datagrid>
    <modal :is-visible="modalVisible" @modalClosing="closeModal">
      <div class="card w-1/3 max-h-full">
        <h1>{{isUpdate ? '修改记录' : '添加记录'}}</h1>
        <div class="inner-container">
          <div class="form-component" v-if="isUpdate">
            <label>编号</label>
            <input type="text" v-model="form.id" disabled />
          </div>
          <div class="form-component">
            <label>产品</label>
            <datagrid
              :data-table="listStorageData"
              :columns="storageColumns"
              :column-headers="storageColumnHeaders"
              :selection-mode="true"
              :selected.sync="form.storage_id"
              selectionKey="id"
              selectionName="storage"
            />
          </div>
          <div class="form-component">
            <label>数量</label>
            <input type="text" v-model="form.quantity" />
            <p v-if="validations['quantity']" class="error">{{validations['quantity'][0]}}</p>
          </div>
          <div class="form-component">
            <label>员工</label>
            <input type="text" v-if="form.user" v-model="form.user.username" disabled />
          </div>
          <div class="form-component">
            <button class="btn-blue w-full py-3" @click="submit">提交</button>
          </div>
        </div>
      </div>
    </modal>
    <input type="hidden" name="reload" value="reloadKey" />
  </div>
</template>
<script type="text/javascript">
import Datagrid from "@/components/Datagrid";
import Functions from "@/components/Functions";
import axios from "axios";
import BaseServices from "@/components/services/BaseServices";
import Modal from "@/components/Modal";
import { baseUrl } from "@/components/services/common";

const storageSrv = new BaseServices("storage");
const storageInSrv = new BaseServices("storage_in");
const storageOutSrv = new BaseServices("storage_out");

const setOperation = (obj, op) => {
  obj.operation = op;
  return obj;
};
const sortByDate = (a, b) => new Date(a) - new Date(b);

const combineAndSort = (stIn, stOut) => {
  return [
    ...stIn.map((x) => setOperation(x, "IN")),
    ...stOut.map((x) => setOperation(x, "OUT")),
  ].sort((a, b) => sortByDate(a.created_at, b.created_at));
};

const getStorageLogsById = async (id) => {
  const url = `${baseUrl}/storages/${id}/log`;
  const response = await axios.get(url);
  const stIn = response.data.storage_ins;
  const stOut = response.data.storage_outs;
  return combineAndSort(stIn, stOut);
};

const getStorageLogs = async () => {
  let url = `${baseUrl}/storage_ins/`;
  const stIn = await axios.get(url);

  url = `${baseUrl}/storage_outs/`;
  const stOut = await axios.get(url);

  return combineAndSort(
    stIn.data.storage_ins.data,
    stOut.data.storage_outs.data
  );
};

export default {
  name: "StorageLog",
  components: { Datagrid, Modal },
  props: ["storageId", "reloadKey"],
  data() {
    return {
      listData: [],
      validations: [],
      searchQuery: "",
      columns: [
        "storage.goods.name",
        "storage.warehouse.name",
        "quantity",
        "created_at",
        "description",
        "user.username",
      ],
      columnHeaders: ["产品", "仓库", "数量", "日期", "备注", "员工"],
      listStorageData: [],
      storageColumns: [
        "goods.name",
        "goods.provider.name",
        "warehouse.name",
        "quantity",
      ],
      storageColumnHeaders: ["产品", "提供者", "仓库", "数量"],
      modalVisible: false,
      isUpdate: false,
      reload: 1,
      form: {
        id: 0,
        quantity: 0,
        user: {},
      },
    };
  },
  asyncComputed: {
    async logData() {
      if (!this.reloadKey) return;
      if (!this.reload) return;
      if (this.storageId) {
        return await getStorageLogsById(this.storageId);
      } else {
        return await getStorageLogs();
      }
    },
  },
  methods: {
    ...Functions,
    async beforeEdit(param) {
      this.listStorageData = await storageSrv.getAll("").then((res) => res);
      if (param.operation === "IN") {
        this.service = storageInSrv;
      } else if (param.operation === "OUT") {
        this.service = storageOutSrv;
      }
    },
    beforeDelete(param) {
      this.beforeEdit(param);
    },
    afterSubmit() {
      this.$emit("update:log");
      this.reload += 1;
    },

    setRowClass(data) {
      if (data.operation == "IN") {
        return "bg-green-200";
      } else {
        return "bg-red-200";
      }
    },
  },
};
</script>
<style lang="postcss">
.switch {
  @apply px-5;
}
</style>

