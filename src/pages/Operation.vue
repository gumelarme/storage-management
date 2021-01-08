<template>
<!-- 这是个读者借的书的界面，我该改成一个工作人员出库，入库操作 -->
    <master-main>
        <h1>入库/出库</h1>
        <div class="action-bar">
            <button class="add-button" @click="add">
                出库
            </button>
        </div>
        <table class="w-full" v-if="dataTable.length">
            <!-- 0" 这是干嘛的-->
            <thead>
                <tr>
                    <td v-for="(header,index) in getHeader" :key="index">{{header}}</td>
                </tr>
            </thead>
            <tbody>
                <!-- 这个地方应该是填写入库操作，类似一个小界面。但是显然这里不是 -->
                <tr v-for="(row, i) in dataTable" :key="i">
                    <td>{{i+1}}</td>
                    <td v-for="(col, j) in getColumns" :key="j">
                        {{row[col]}}
                    </td>
                    <td>
                        {{formatDate(row.withdrawDate)}}
                        <!-- 这里有个改动 =====出库时间-->
                    </td>
                    <td @click="Storage_In($event, row)">
                        <a>入库</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="dataTable.length <= 0" class="border-2 border-gray-700 border-dashed p-5">
            <h2 class="text-red-400 font-bold">
                没有进行入库/出库操作
            </h2>
        </div>
        <modal @modalClosing="closeModal" :is-visible="modalVisible">
            <div class="card w-1/2 overflow-scroll h-full">
                <table class="w-full" v-if="modalDataTable.length > 0">
                    <thead>
                    <tr>
                        <td v-for="(header,index) in getModalHeader" :key="index">{{header}}</td>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in modalDataTable" :key="i">
                            <td>{{i+1}}</td> 
                            <td v-for="(col,j) in getModalColumns" :key="j">
                                {{row[col]}}
                            </td>
                            <td @click="Storage_Out($event,row)">
                                <!-- 没有数量  -->
                                <a>出库</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </modal>
    </master-main>
</template>

<script>
    import MasterMain from "@/components/MasterMain";
    import Modal from "@/components/Modal";
    import Operation from "@/components/services/Operation";
    import Storages from "@/components/Storages";
    import Auth from "@/components/services/Auth";
    // import ProviderTemplate from "@/components/ProviderTemplate";
    const luxon = require('luxon');

    export default {
        name: "Operation",//这里改了
        components:{MasterMain,Modal},
        data(){
            return({
                dataTable:[],
                columns: ['name','instanceCode'],//此处有疑问
                columnsHeaders: ['No.','货物编号','工作人员编号','数量','生产日期','出库时间','操作'],
                modalDataTable:[],
                modalColumns: ['name', 'instanceCode'],
                modalColumnHeaders: ['No.', '货物编号','货物','操作'],
                modalVisible: false,
                out_operator: {},//当前使用人，我得改成出库操作人
            })
        },
        computed:{
            getColumns(){
                if(!this.columns||this.columns.length === 0){
                    return Object.keys(this.dataTable[0]);
                }
                return  Object.keys(this.dataTable[0]).filter(x => this.columns.includes(x));
            },
            getHeader(){
                var columns = this.getColumns;
                var diff = columns.length - (columns.length - this.columnsHeaders.length);
                return [...this.columnsHeaders, ...columns.slice(diff)];
            },

            getModalColumns(){
                if(!this.modalColumns||this.modalColumns.length === 0){
                    return Object.keys(this.modalDataTable[0]);
                }

                return Object.keys(this.modalDataTable[0]).filter(x => this.modalColumns.includes(x));
            },
            getModalHeader(){
                var columns = this.getModalColumns;
                var diff = columns.length - (columns.length - this.modalColumnHeaders.length);
                return [...this.modalColumnHeaders, ...columns.slice(diff)];
            },
        },
        async mounted(){//这是干嘛的
            this.out_operator = {
                ...await Auth.authenticate(this.$cookies.get('auth')).then(res => res.data)
            };
            this.loadStorages_out();//加载出库记录
        },
        methods: {
            async loadStorages_out(){
                this.dataTable = await Operation.getOut_StoragesByWorkerId(this.out_operator.id, true).then(res => res.data);
            },//加载出库的内容

            async loadAvailableStorage(){
                this.modalDataTable = await Storages.getAvailableStorages().then(res => res.data);
            },//加载剩余货物

            formaDate(str){
                const date = luxon.DateTime.fromISO(str);
                if(date.isValid){
                    return date.setLocale("zh").toLocaleString(luxon.DateTime.DATE_MED);
                }
                return str;
            },

            async add(){
                this.modalVisible = true;
                this.loadAvailableStorage();
            },

            Storage_In(event, param){
                Operation.Storage_In(param.OutId).then(res =>{//改了OutId。我不知道哪里来的
                    if(res.status !== 204) return;
                    this.loadAvailableStorage();//入库后加入，刷新可用货物
                });
            },

            Storages_out(event,param){
                Operation.Storages_out(this.out_operator.id, param.id).then(res => {
                    if(res.status !== 204) return;
                }).then(() => {
                    this.loadStorages_out();//出库操作，更新出库操作
                    this.loadAvailableStorage();//更新可用的操作
                });
            },

            closeModal(){
                this.modalVisible = false;
            }
        }
    }
</script>

<style scoped>
</style>