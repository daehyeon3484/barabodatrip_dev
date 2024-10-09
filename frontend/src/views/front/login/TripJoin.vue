<template>
    <main class="mt-2">
        <div class="continer">
            <div class="row">
                <div class="col-md-12">
                    <div class="card bg-dark main-card  card-login-div">
                        <h1 class="mt-4 text-light">{{ $t("common.common_join") }}</h1>
                        <div class="card-body">
                            <div>
                                <div class="mb-3 row">
                                    <label class="col-md-3 col-form-label text-light">{{ $t('order.name') }}</label><!--실명-->
                                    <div class="input-group mb-9">
                                        <input v-model="mem_nm" ref="name" type="text" class="form-control"
                                            :placeholder="$t(`common.common_login_name_input`)"
                                            :aria-label="$t(`common.common_login_name_input`)">
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label class="col-md-3 col-form-label text-light">{{ $t('order.tel') }}</label><!--전화번호-->
                                    <div class="input-group mb-9">
                                        <input v-model="mem_tel" ref="tel" type="text" class="form-control"
                                            :placeholder="$t(`common.common_login_tel_input`)"
                                            :aria-label="$t(`common.common_login_tel_input`)">
                                    </div>
                                </div>
                                <div lass="mb-3 row">
                                    <label class="col-md-3 col-form-label text-light">{{ $t('common.email') }}</label><!--이메일-->
                                    <div class="input-group mb-3">
                                        <input v-model="mem_email" ref="email" type="text" class="form-control" :placeholder="$t(`common.common_email_input`)" :aria-label="$t(`common.common_email_input`)"/>
                                        <button type="button" class="float-end btn btn-danger md-2" @click="emailChk">{{ $t("common.common_duplication") }}</button>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label class="col-md-3 col-form-label text-light">{{ $t('common.common_login_password') }}</label><!--패스워드-->
                                    <div class="input-group mb-3">
                                        <input v-model="mem_pwd" ref="password" type="text" class="form-control" :placeholder="$t(`common.common_login_password_input`)" :aria-label="$t(`common.common_login_password_input`)"/>
                                    </div>
                                    <span><p class="text-danger">{{ $t('common.common_login_password_validation') }}</p></span>
                                </div>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button class="float-end btn btn-outline-danger me-md-2" type="button" @click="join">{{ $t("common.common_join") }}</button>
                                <button type="button" class="float-end btn btn-outline-secondary text-light" @click="cancel">{{ $t("common.common_cancel") }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import CryptoJS from "crypto-js";
import {isDEmpty} from '@/is';
import {swalTost, swal} from '@/alert'
export default {
    components: {
    },
    data() {
        return {
            mem_nm: "",
            mem_pwd: "",
            mem_tel:"",
            mem_email: "",
            email_addr: "",
            domain: "",
            lanTp : "",
            validationFlag : true
        }
    },
    computed : {
        user() {
        console.log("state.user : ",this.$store.state.user);
        return this.$store.state.user
        }
    },
    mounted() {
        
    },
    unmounted() {
    },
    created () {
        this.lanTp = this.$route.query.lan_tp
    },
    methods: {
        async emailChk() {
            console.log("this.mem_email: ",this.mem_email)
            if (isDEmpty(this.mem_email)) {
                swal.fire({
                    title: this.$t("common.common_email_input"),
                    icon : 'warning',
                    timer: 1500, 
                    confirmButtonText: this.$t("common.common_close"),
                })
                return this.$refs.email.focus()
            }
            let email = await this.$api("/api/loginChk",{param:[{mem_email : this.mem_email}]})
            if(email.length > 0) {
              swal.fire({
                  title: this.$t("common.common_join_duplication"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
              })
              this.emailFlag = false
              return this.$refs.email.focus()
            } else {
              swal.fire({
                  title: this.$t("common.common_login_email_use"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
              })
              this.emailFlag = true
            }
        },
        validationChk () {
            // const regex1 = /^[0-9a-z]{8,}+$/
            const regex1 = /^(?=.*[a-z])(?=.*[0-9]).{8,25}$/
            const regex3 = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            const regex = /^[0-9]+$/
            if (isDEmpty(this.mem_nm) ||this.mem_nm.length < 1) {
              swal.fire({
                title: this.$t("common.common_login_name_input"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              this.mem_nm = ''
              this.validationFlag = false
              return this.$refs.name.focus()
            }
            
            if (isDEmpty(this.mem_tel) || this.mem_tel.length < 1) {
              swal.fire({
                title: this.$t("common.common_login_tel_input"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              this.mem_tel = ''
              this.validationFlag = false
              return this.$refs.tel.focus()
            } else {
              if (!regex.test(this.mem_tel)) {
                this.mem_tel = ''
                swal.fire({
                  title: this.$t("common.common_tel_number"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
                this.validationFlag = false
                return this.$refs.tel.focus()
              }
            }
            if (isDEmpty(this.mem_email) || this.mem_email.length < 1) {
              swal.fire({
                title: this.$t("common.common_email_input"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              this.mem_email = ''
              this.validationFlag = false
              return this.$refs.email.focus()
            } else {
              if (!regex3.test(this.mem_email)) {
                swal.fire({
                  title: this.$t("common.common_login_email_validation"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
                this.mem_email = ''
                this.validationFlag = false
                return this.$refs.email.focus()
              }
              if (!this.emailFlag) {
                this.validationFlag = false
                return swal.fire({
                          title: this.$t("common.common_email_duplication"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
              }
            }
            // Check if email

            if (isDEmpty(this.mem_pwd) || this.mem_pwd.length < 1) {
              swal.fire({
                title: this.$t("common.common_login_password_input"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              this.mem_pwd = ''
              this.validationFlag = false
              return this.$refs.password.focus()
            } else {
                if (!regex1.test(this.mem_pwd)) {
                  swal.fire({
                    title: this.$t("common.common_login_password_validation"),
                    icon : 'warning',
                    timer: 1500, 
                    confirmButtonText: this.$t("common.common_close"),
                  })
                  this.mem_pwd = ''
                  this.validationFlag = false
                  return this.$refs.password.focus()
                }
            }
            this.validationFlag = true
            return this.validationFlag
        },
        join() {
            if(this.validationChk()) {
                swalTost.fire({
                  title: this.$t("common.common_join_confirm"),
                  icon : 'question',
                  confirmButtonText: this.$t("common.common_join"),
                  cancelButtonText: this.$t("common.common_cancel")
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        console.log("test");
                        let memId = await this.$api("/api/commSequences", {param : ['MEM','mem_id','10']})
                        let password = CryptoJS.SHA256(this.mem_pwd).toString();
                        const member = {
                            mem_id : memId[0].commSeq,
                            mem_nm : this.mem_nm,
                            mem_email : this.mem_email,
                            mem_password : this.mem_pwd,
                            mem_pwd : password,
                            reg_date : this.$dateFormat("sysdate")
                        }
                        let param = [
                            member,
                            {mem_email : this.mem_email}
                        ]    
                        this.$api("/api/signUp", {param})
                        // this.$store.commit("user", member);
                        swal.fire({
                          title: this.$t("common.common_join_success"),
                          icon : 'success',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_confirm"),
                        })
                        this.$router.push({path: "/login", query : {lan_tp : this.lanTp}});
                    }
                });
            }
            
            
        },
        cancel() {
          window.location.reload(true)
          window.location.href=`/?lan_tp=${sessionStorage.get('lan_tp')}`
            // this.$router.push({path: "/", query : {lan_tp : this.lanTp}});
        },
    }
}
</script>