<template>
    <div class="wrapper">
        <div class="card w-1/3">
            <div>
                <h1>仓库管理系统</h1>
            </div>
            <div class="form-component">
                <label>用户名</label>
                <input type="text" v-model="form.username" />
                <p v-if="validation[0]" class="error">    
                    {{validation[0]}}
                </p>
            </div>
            <div class="form-component">
                <label>密码</label>
                <input type="password" v-model="form.password"/>
                <p v-if="validation[1]" class="error">
                    {{validation[1]}}
                </p>
            </div>
            <div class="form-component">
                <button class="btn-blue w-full"
                        :class="!isValid ? 'disabled': ''" @click="submit"
                        :disabled = "!isValid">
                    Login
                </button>
                <div v-if="message.text" class="py-3 error">
                    {{message.text}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Auth from '@/components/services/Auth'
    export default{
        name: "Login",
        data(){
            return{
                form:{
                    username: '',
                    password: '',
                },
                validation:[],
                message:{
                    type: '',
                    text: ''
                },
                isValid:false,
            }
        },
        watch:{
            "form.username":function(newVal){
                this.validation[0] = "";
                const min = 4;
                if(newVal.length < min){
                    this.validation[0] = `用户名不能少于${min}个字`;
                }
                this.validate();
            },
            "form.password":function(newVal){
                this.validation[1] = "";
                const min = 8;
                if(newVal.length < min){
                    this.validation[1] = `密码不能少于${min}个字`;
                }
                this.validate();
            }
        },
        async mounted(){},
        computed:{},
        methods:{
           async submit(){
               try{
                   const form = this.form;
                   const result = await Auth.login(form.username,form.password);
                   this.$router.push({path:"/storages"});
                   this.$cookies.set("auth", result.data, "4h");
                }catch(err){
                    this.message.text = err.error;
                   if(err.response.status > 400) {
                       this.message.text = "用户名或密码错误";
                       return ;
                   }
                } 
            },
        validate(){
            this.isValid = this.validation.join("").trim().length===0
            && this.form.password.length > 0
            && this.form.username.length > 0;
        }
        }
    }
</script>

<style scoped>
    .wrapper{
        @apply my-6
    }

</style>
