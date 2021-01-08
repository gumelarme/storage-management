<template>
  <div>
    <basic-template
      :data-table="listData"
      :title="'员工管理'"
      :columns="columns"
      :column-headers="columnHeaders"
      @searchClick="search"
      @addClick="add"
      @editClick="edit"
      @removeClick="remove"
    ></basic-template>
    <modal :is-visible="modalVisible" @modalClosing="closeModal">
      <div class="card w-3/4">
        <h1>{{isUpdate ? '修改员工' : '添加员工'}}</h1>
        <div class="inner-container">
          <div class="form-component">
            <label>产品</label>
            <p v-if="validations['goods_id']" class="error">{{validations['goods_id'][0]}}</p>
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
            <!-- <label>数量</label> -->
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
import BaseServices from "@/components/services/BaseServices";
import Modal from "@/components/Modal";
import BasicTemplate from "@/components/BasicTemplate";
import Functions from "@/components/Functions";
import Datagrid from "@/components/Datagrid";

const service = new BaseServices("storage");
const warehouseSrv = new BaseServices("warehouse");
const goodsSrv = new BaseServices("goods", "goods");

export default {
  name: "Storages",
  components: { BasicTemplate, Modal, Datagrid },
  data() {
    return {
      service,
      validations: [],
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
      form: {
        goods_id: 0,
        warehouse_id: 0,
        quantity: 0,
      },
    };
  },
  async mounted() {
    this.loadAll();
  },
  methods: {
    ...Functions,
    async beforeAdd() {
      this.listGoodsData = await goodsSrv.getAll("").then((res) => res);
      this.listWarehouseData = await warehouseSrv.getAll("").then((res) => res);
    },
    async beforeEdit() {
      this.beforeAdd();
    },
    updateWarehouseSelection(ev) {
      console.log("warehouse", ev);
    },

    updateGoodsSelection(ev) {
      console.log("goods", ev);
    },
  },
};
</script>

<style></style>
