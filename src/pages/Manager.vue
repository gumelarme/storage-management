<template>
  <div>
    <basic-template
      :data-table="listData"
      :title="'员工管理'"
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
        <h1>{{isUpdate ? '修改员工' : '添加员工'}}</h1>
        <div class="inner-container">
          <div class="form-component" v-if="isUpdate">
            <label>工作编号</label>
            <input type="text" v-model="form.id" disabled />
          </div>
          <div class="form-component">
            <label>名字</label>
            <input type="text" v-model="form.username" />
            <p v-if="validations['username']" class="error">{{validations['username'][0]}}</p>
          </div>
          <div class="form-component">
            <label>密码</label>
            <input type="password" v-model="form.password" @keyup="validateRepassword" />
            <p v-if="validations['password']" class="error">{{validations['password'][0]}}</p>
          </div>
          <div class="form-component">
            <label>密码</label>
            <input type="password" v-model="form.repassword" @keyup="validateRepassword" />
            <p v-if="validations['repassword']" class="error">{{validations['repassword'][0]}}</p>
          </div>
          <div class="form-component">
              <label>
                  是否管理员 <input type="checkbox" v-model="form.is_manager"/>
            </label>
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

const service = new BaseServices("user");

export default {
  name: "Manager",
  components: { BasicTemplate, Modal },
  data() {
    return {
      service,
      searchQuery: '',
      listData: [],
      validations: [],
      columns: ["id", "username"],
      columnHeaders: ["工作编号", "名字"],
      modalVisible: false,
      isUpdate: false,
      form: {
        id: 0,
          is_manager: false,
        username: "netuinha",
        password: "something",
        repassword: "something",
      },
    };
  },
  async mounted() {
    this.loadAll();
  },

  methods: {
      ...Functions,
      beforeSubmit(){
          if(this.form.password && this.form.password.length === 0){
              delete this.form.password;
              delete this.form.repassword;
          }
      },

    validateRepassword() {
      let v = [];
      if (this.form.password !== this.form.repassword) {
        v = ["密码不一致"];
      }
      this.$set(this.validations, "repassword", v);
    },
  },
};
</script>

<style scoped>
</style>
