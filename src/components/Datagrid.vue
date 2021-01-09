<template>
  <div class="w-full">
    <table v-if="table && table.length > 0" class="w-full">
      <thead>
        <td>编号</td>
        <td v-for="(key, i) in getHeader" :key="i">{{headerCase(key)}}</td>
        <td colspan="2" v-if="hasEditListener || hasdeleteClick || selectionMode">操作</td>
      </thead>
      <tbody>
        <tr
          v-for="(data, index) in table"
          :key="index"
          :class="[hasClickedRow && clickedRow == q(data, selectionKey) ?'selected':'', getRowClass(data)]"
        >
          <td>{{index+1}}</td>
          <td
            v-for="(prop, i) in getColumns"
            :key="i"
            @click="rowClickedEvent($event, data, index)"
          >{{format(q(data, prop))}}</td>
          <td v-if="hasEditListener"
            @click="rowClickedEvent($event, data, index)">
            <a @click="editEvent($event, data)">修改</a>
          </td>
          <td v-if="hasdeleteClick"
            @click="rowClickedEvent($event, data, index)">
            <a @click="deleteEvent($event, data)">删除</a>
          </td>
          <td v-if="selectionMode">
            <input
              type="radio"
              :name="selectionName"
              :value="q(data, selectionKey)"
              @click="selectedChange"
              :checked="q(data, selectionKey) == selected"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="table && table.length <= 0" class="border-2 border-gray-700 border-dashed p-5">
      <h2 class="text-red-400 font-bold">No Data</h2>
    </div>
  </div>
</template>

<script>
const luxon = require("luxon");
export default {
  name: "Datagrid",
  props: [
    "dataTable",
    "columns",
    "columnHeaders",
    "showClicked",
    "selectionMode",
    "selectionKey",
    "selectionName",
    "clickedRow",
    "selected",
    "rowClass",
    "filter",
  ],
  data() {
    return {
    };
  },
  computed: {
    table() {
      if (!this.filter) {
        return this.dataTable;
      }
      return this.dataTable.filter((row) => {
        for (let c of this.columns) {
          const value = this.q(row, c) + "";
          if (value.toLowerCase().includes(this.filter.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    },
      hasClickedRow(){
          return hasOwnProperty.call(this.$options.propsData, 'clickedRow') && this.clickedRow != undefined;
      },
      hasEditListener(){
          return this.$listeners && this.$listeners.editClick;
      },
      hasdeleteClick(){
          return this.$listeners && this.$listeners.deleteClick;
      },
    getColumns() {
      if (!this.columns || this.columns.length === 0) {
        return Object.keys(this.dataTable[0]);
      }

      return this.columns;
    },
    getHeader() {
      var columns = this.getColumns;
      var diff = columns.length - (columns.length - this.columnHeaders.length);
      return [...this.columnHeaders, ...columns.slice(diff)];
    },
  },
  methods: {
    getRowClass(data) {
      if (!this.rowClass) return "";
      return this.rowClass(data);
    },
    selectedChange(event) {
      this.$emit("update:selected", event.target.value);
    },
    q(data, query) {
      let value = data;
      for (let key of query.split(".")) {
        value = value[key];
      }
      return value;
    },
    headerCase(str) {
      return str[0].toUpperCase() + str.substring(1, str.length);
    },

    format(data) {
      if (typeof data === "number") {
        return data;
      }
      const date = luxon.DateTime.fromISO(data);
      if (date.isValid) {
        return date.setLocale("zh").toLocaleString(luxon.DateTime.DATE_MED);
      }
      return data;
    },
    editEvent(event, param) {
      this.$emit("editClick", param);
    },
    deleteEvent(event, param) {
      this.$emit("deleteClick", param);
    },
    rowClickedEvent(ev, param) {
      if (!this.hasClickedRow) return;
      const val = this.q(param, this.selectionKey);
        console.log(this.selectionKey, val);
      this.$emit("update:clickedRow", val);
      this.$emit("rowClick", val);
    },
  },
};
</script>
<style lang="postcss">
.selected {
  @apply bg-blue-400;
}
</style>
