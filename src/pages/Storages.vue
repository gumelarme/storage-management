<template>
  <div>
    <master-main class="static">
      <div class="card w-11/12">
        <div class="w-full flex">
          <div class="w-2/6 px-4">
            <h1>库存管理</h1>
            <div class="action-bar flex space-x-2">
              <button class="btn-blue" @click="add">添加 +</button>
              <div class="flex-grow"></div>
              <button v-show="clickedRowId" class="btn-red" @click="clearSelection">取消选择</button>
              <button class="btn-blue" @click="loadAll">刷新</button>
            </div>
            <div class="action-bar">
              <input type="text" class="flex-grow mr-2" v-model="searchQuery" />
              <button class="w-1/6 btn-blue" @click="search">查询</button>
            </div>
            <datagrid
              :data-table="listData"
              :columns="columns"
              :column-headers="columnHeaders"
              :clickedRow.sync="clickedRowId"
              selectionKey="id"
              :filter="searchQuery"
              @editClick="edit"
              @deleteClick="remove"
            ></datagrid>
            <p v-if="inoutValidations.storage" class="error">{{inoutValidations.storage[0]}}</p>
            <div class="action-bar">
              <div class="form-component">
                <label for>数量</label>
                <input type="number" class="flex-grow mr-2" v-model="inoutForm.quantity" />
                <p v-if="inoutValidations.quantity" class="error">{{inoutValidations.quantity[0]}}</p>
              </div>
              <div class="form-component">
                <label for>备注</label>
                <input type="text" class="flex-grow mr-2" v-model="inoutForm.description" />
              </div>
            </div>
            <div class="action-bar flex flex-row-reverse items-center">
              <button class="btn-blue" @click="submitOperation">提交</button>
              <div class="switch">
                入库
                <input type="radio" name="action" value="IN" v-model="inoutForm.action" />
              </div>
              <div class="switch">
                出库
                <input type="radio" name="action" value="OUT" v-model="inoutForm.action" />
              </div>
              <p v-if="inoutValidations.action" class="error">{{inoutValidations.action[0]}}</p>
            </div>
          </div>
          <div class="w-4/6">
            <storage-log :storage-id="clickedRowId" :reloadKey="reloadStorageLogsKey" @update:log="loadAll"/>
          </div>
        </div>
      </div>
    </master-main>
    <modal :is-visible="modalVisible" @modalClosing="closeModal">
      <div class="card w-3/4">
        <h1>{{isUpdate ? '修改库存' : '添加库存'}}</h1>
        <div class="inner-container">
          <div class="form-component">
            <label>产品</label>
            <p v-if="inoutValidations[0]" class="error">{{inoutValidations.quantitiy[0]}}</p>
            <datagrid
              :data-table="listGoodsData"
              :columns="goodsColumns"
              :column-headers="goodsColumnHeaders"
              :selection-mode="true"
              :selected.sync="form.goods_id"
              selectionKey="id"
              selectionName="goods"
            />
          </div>
          <div class="form-component">
            <label>仓库</label>
            <p v-if="validations['warehouse_id']" class="error">{{validations['warehouse_id'][0]}}</p>
            <datagrid
              :data-table="listWarehouseData"
              :columns="warehouseColumns"
              :column-headers="warehouseColumnHeaders"
              :selection-mode="true"
              :selected.sync="form.warehouse_id"
              selectionKey="id"
              selectionName="warehouse"
            />
          </div>
          <div class="form-component" v-if="isUpdate">
            <label>编号</label>
            <input type="text" v-model="form.id" disabled />
          </div>
          <div class="form-component" v-if="isUpdate">
            <input type="hidden" v-model="form.quantity" disabled />
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
import MasterMain from "@/components/MasterMain";
import BaseServices from "@/components/services/BaseServices";
import Modal from "@/components/Modal";
import Functions from "@/components/Functions";
import StorageLog from "@/components/StorageLog";
import Datagrid from "@/components/Datagrid";

const service = new BaseServices("storage");
const warehouseSrv = new BaseServices("warehouse");
const goodsSrv = new BaseServices("goods", "goods");

const storageInSrv = new BaseServices("storage_in");
const storageOutSrv = new BaseServices("storage_out");

export default {
  name: "Storages",
  components: { Modal, Datagrid, MasterMain, StorageLog },
  data() {
    return {
      searchQuery: "",
      service,
      validations: {},
      inoutValidations: {},
      listData: [],
      columns: [
        "goods.name",
        "goods.provider.name",
        "warehouse.name",
        "quantity",
      ],
      columnHeaders: ["产品", "提供者", "仓库", "数量"],
      listGoodsData: [],
      goodsColumns: ["id", "name", "provider.name"],
      goodsColumnHeaders: ["编号", "产品", "提供者"],
      listWarehouseData: [],
      warehouseColumns: ["id", "name", "address"],
      warehouseColumnHeaders: ["仓库编号", "名称", "地址"],
      modalVisible: false,
      isUpdate: false,
      clickedRowId: 0,
      reloadStorageLogsKey: 1, // will reload on change, anything works
      form: {
        goods_id: 0,
        warehouse_id: 0,
        quantity: 0,
      },
      inoutForm: {
        quantity: 0,
        description: "",
        action: "IN",
      },
    };
  },
  async mounted() {
    this.loadAll();
  },
  methods: {
    ...Functions,
    async beforeAdd() {
        this.form.quantity = 0;
      this.listGoodsData = await goodsSrv.getAll("").then((res) => res);
      this.listWarehouseData = await warehouseSrv.getAll("").then((res) => res);
    },
    async beforeEdit() {
      this.beforeAdd();
    },
    clearSelection() {
      this.clickedRowId = 0;
      this.loadAll();
    },
    isValid() {
      let v = {};
      if (this.clickedRowId <= 0) {
        v.storage = ["请选择库存信息"];
      }

      if (this.inoutForm.quantity <= 0) {
        v.quantity = ["不能小于0"];
      }

      if (this.inoutForm.action <= 0) {
        v.action = ["请选择操作模式"];
      }
      //reset if all good
      this.inoutValidations = v;
      return !(v.length > 0);
    },
    async submitOperation() {
      if (!this.isValid()) return;
      let srv = storageInSrv;
      if (this.inoutForm.action == "OUT") {
        srv = storageOutSrv;
      }
      try {
        const resp = await srv.add({
          ...this.inoutForm,
          user_id: this.$cookies.get("auth").id,
          storage_id: this.clickedRowId,
        });
        if (resp.status == 201) {
          // trick StorageLogs to force reload
          this.reloadStorageLogsKey += 1;
        }
        this.loadAll();
        this.inoutForm = {
            ...this.inoutForm,
            quantity: 0,
            description: '',
        };
      } catch (err) {
        if (err.response.status === 422) {
          this.inoutValidations = err.response.data;
        } else {
          console.log(err);
        }
      }
    },
  },
};
</script>

<style lang="postcss">
tbody td {
  @apply p-1 text-sm;
}
</style>
