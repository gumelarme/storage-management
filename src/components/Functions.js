const functions = {
    async loadAll(param) {
        this.listData = await this.service.getAll(param);
    },

    async add() {
        if(this.beforeAdd) await this.beforeAdd();
        this.modalVisible = true;
        this.isUpdate = false;
    },

    async search(param) {
        this.loadAll(param);
    },

    async  edit(param) {
        if(this.beforeEdit) await this.beforeEdit(param);
        this.isUpdate = true;
        this.service.getOne(param.id).then((data) => {
            this.form = { ...data };
            this.modalVisible = true;
        });
    },


    async  submit() {
        if(this.beforeSubmit) this.beforeSubmit();

        let actionFn = this.service.add;
        if (this.isUpdate) {
            actionFn = this.service.update;
        }
        try {
            const res = await actionFn.bind(this.service)({ ...this.form });
            if (res.status === 201 || res.status === 200) {
                this.loadAll();
                this.closeModal();
            }
        } catch (err) {
            const resp = err.response;
            if (resp.status === 422) {
                this.validations = resp.data;
            }
        }
        
        if(this.afterSubmit) this.afterSubmit();
    },

    async remove(param) {
        if(this.beforeDelete) await this.beforeDelete(param);
        if (!confirm("确认删除这条信息?")) return;
        try {
            const res = await this.service.remove(param.id);
            if (res.status === 204) {
                this.closeModal();
                this.loadAll();
            }
        } catch (e) {
            if (e.response.status === 409) {
                alert("无法删除此用户，此用户仍有与其关联的数据。");
            }
        }
    },

    closeModal() {
        this.modalVisible = false;
        this.validations = [];
        this.form = {}
    },
}
export default functions;
