<template>
  <transition name="fade">
    <div class="box">
      <div class="content">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.base_name}}</span>
        </div>
        <div class="item_body">
          <div class="item__left" style="width:58%;">
            <span>{{$t('purchase.schemeName')}}：</span>
            <span class="new_data">{{currentProduct.product_name}}</span>
          </div>
          <div class="item__right" style="width:42%;text-align:right;">
            <span style="flex:1;">{{$t('purchase.purchaseAmt')}}：</span>
            <span class="all_data" style="flex:0 auto;">{{currentProduct.subscribe_money}}{{$t('apointRecord.tenThousandYuan')}}</span>
          </div>
        </div>
        <div class="item_foot">
          <span>{{$t('purchase.purchaseTime')}}：</span>
          <span>{{currentProduct.subscribe_time}}</span>
        </div>
        <div class="item_foot" style="display: flex;" v-if="currentProduct.describe">
          <span>{{$t('purchase.productIntroduction')}}：</span>
          <div style="flex: 1;">
            <span style="line-height: 1;">{{currentProduct.describe}}</span>
          </div>
        </div>
      </div>
      <div style="padding: 10px;width: 100%;box-sizing: border-box;">
        <div class="form_box">
          <form class="form_area" method="post" @submit.prevent="formSubmit()">
            <div style="padding: 0 10px;">
              <div class="select_type" v-if="pickerArr.length > 1">
                <i class="iconfont icon-unfold"></i>
                <span class="type_title">{{$t('modifyPlan.selectPlan')}}：</span>
                <!-- <input type="text" palceholder="请选择方案类型" @click="selectPlan" readonly :value="curValue" /> -->
                <select id="zySelect" class="zy_select" @change="selectPlan">
                  <option :value="o.text" v-for="(o, i) in pickerArr" :key="i">{{o.text}}</option>
                </select>
              </div>
            </div>
            <div style="padding: 0 10px 5px;" v-if="showArr.length > 1">
              <div class="item_body">
                <div class="item__left" style="width:65%;">
                  <span>{{$t('purchase.schemeName')}}：</span>
                  <span class="new_data">{{currentPlan.name}}</span>
                </div>
                <div class="item__right" style="width:35%;text-align:right;">
                  <span style="flex:1;">{{$t('purchase.maxNumber')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{currentPlan.max_amount}}</span>
                </div>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('addApply.minShare')}}：</span>
                  <span class="new_data">{{currentPlan.min_money / 10000}}{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
                <div class="item__right" style="text-align:right;">
                  <span style="flex:1;">{{$t('purchase.increasingShare')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{currentPlan.step_money / 10000}}{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
              </div>
              <div class="item_foot" style='display:flex'>
                <span>{{$t('purchase.settlementTime')}}：</span>
                <div style="flex:1;display:flex;flex-wrap:wrap;">
                  <div style="display:flex;width:50%;" v-for="(t, i) in currentPlan.settlement_time" :key="i">
                    <span style="flex:1">{{t}}</span>
                  </div>
                </div>
              </div>
              <div class="item_foot" style="display: flex;">
                <span>{{$t('purchase.schemeDetail')}}：</span>
                <div style="flex: 1;">
                  <span>{{currentPlan.describe}}</span>
                </div>
              </div>
            </div>
            <div v-if="flag" style="padding: 0 10px;">
              <div class="input_area">
                <div class="input_form">
                  <i class="iconfont icon-redeemed"></i>
                  <span class='unit'>{{$t('apointRecord.tenThousandYuan')}}</span>
                  <input type="number" v-model="purchaseAmt" :placeholder="$t('modifyPlan.tip1')" />
                </div>
              </div>
              <div class="btn_area">
                <cube-button type="submit" :disabled="btnDisabled">{{modifyBtnTxt}}</cube-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getProduct} from 'common/js/storage'
  import {_normalizeStr, getMd5, getBJDate} from 'common/js/tool'
  import $ from 'jquery'
  import * as API from 'common/js/http'
  import Plan from 'common/js/plan'
  import {showToast, showAlert, showDialog} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        loading: null,
        showArr: [],
        pickerArr: [],
        curValue: '',
        currentPlan: null,
        currentProduct: null,
        customer_id: '',
        purchaseAmt: '',
        btnDisabled: false,
        flag: false
      }
    },
    computed: {
      modifyBtnTxt() {
        return this.$i18n.t('modifyPlan.modifyBtnTxt')
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('modifyPlan.tip1')
      },
      tip2() {
        return this.$i18n.t('modifyPlan.tip2')
      },
      tip3() {
        return this.$i18n.t('modifyPlan.tip3')
      },
      tip4() {
        return this.$i18n.t('modifyPlan.tip4')
      },
      tip5() {
        return this.$i18n.t('modifyPlan.tip5')
      },
      tip6() {
        return this.$i18n.t('apointRecord.tenThousandYuan')
      },
      modifyTip() {
        return this.$i18n.t('common.modifyTip')
      },
      netWork() {
        return this.$i18n.t('common.network')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
      },
      cancel() {
        return this.$i18n.t('common.cancel')
      },
      pickerTitle() {
        return this.$i18n.t('modifyPlan.selectPlan')
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.loading = this.$createToast({
        time: 0,
        txt: this.loadingTip,
        mask: true
      })
      this.loading.show()
      this.currentProduct = getProduct()
      this.customer_id = parent.localStorage.getItem('zyId')
    },
    mounted() {
      var that = this
      this.$nextTick(() => {
        this.getSubProductList(that, this.currentProduct.base_id)
      })
    },
    methods: {
      /**
       * 获取申购项目子列表
      */
      getSubProductList(that, bid) {
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/product/listByBaseId',
          data: {
            base_product_id: bid
          },
          async: false,
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': secret_key,
            'time_stamp': time_stamp
          },
          success: (res) => {
            this.loading.hide()
            var list = res.obj.list.reverse()
            var pickerArr = []
            var showArr = list
            if (showArr.length > 0) {
              showArr.forEach((item, index) => {
                item.settlement_time = _normalizeStr(item.settlement_time)
                pickerArr.push(new Plan({
                  text: item.name,
                  value: index
                }))
              })
              if (showArr[0].name === that.currentProduct.product_name) {
                this.flag = false
              } else {
                this.flag = true
              }
              this.pickerArr = pickerArr
              this.showArr = showArr
              this.currentPlan = showArr[0]
              this.curValue = pickerArr[0].text
            }
          },
          error: (err) => {
            this.loading.hide()
            console.log(err)
            showToast(this.netWork, 'error')
          }
        })
      },
      // 方案选择
      selectPlan(e) {
        this.currentPlan = this.showArr[e.target.options.selectedIndex]
        this.curValue = this.pickerArr[e.target.options.selectedIndex].text
        if (this.showArr[e.target.options.selectedIndex].name === this.currentProduct.product_name) {
          this.flag = false
        } else {
          this.flag = true
        }
      },
      // 表单提交
      formSubmit() {
        var that = this
        const param = this.purchaseAmt
        const curPlan = this.currentPlan
        if (this.checkPurchase(that, param)) {
          showDialog(this.modifyTip, `${this.tip5}${curPlan.name}${param}${this.tip6}?`, this.confirm, this.cancel, this.confirmFn, this.cancelFn)
        }
      },
      confirmFn() {
        var that = this
        const param = this.purchaseAmt
        this.btnDisabled = true
        this.mySubmit(that, param)
      },
      cancelFn() {
        console.log('cancel')
      },
      // 校验申购金额
      checkPurchase: (that, param) => {
        var amt = param
        var curPlan = that.currentPlan
        var min = curPlan.min_money / 10000
        var max = that.currentProduct.subscribe_money
        var step = curPlan.step_money / 10000

        if (!amt) {
          showAlert(that.tip, that.tip1, that.confirm)
          return false
        } else if (amt < min) {
          showAlert(that.tip, `${that.tip2}${min}${that.tip6}`, that.confirm)
          return false
        } else if (amt > max) {
          showAlert(that.tip, that.tip3, that.confirm)
          return false
        } else if (amt % step !== 0) {
          showAlert(that.tip, `${that.tip4}${step}${that.tip6}`, that.confirm)
          return false
        } else {
          return true
        }
      },
      /**
       * 提交方案更改
      */
      mySubmit: (that, param) => {
        var purchaseAmt = parseInt(param)
        var target_product_id = that.currentPlan.id
        var subscribe_id = that.currentProduct.id
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/subscribe/editFA',
          data: {
            subscribe_id: subscribe_id,
            target_product_id: target_product_id,
            eidt_money: purchaseAmt * 10000
          },
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': secret_key,
            'time_stamp': time_stamp
          },
          success: (res) => {
            if (!res.ret) {
              showToast(res.msg, 'warn')
              that.btnDisabled = false
              return false
            }
            showToast(res.msg, 'correct')
            setTimeout(() => {
              that.btnDisabled = false
              if (that.$i18n.locale === 'zh') {
                parent.window.location.href = parent.path + '/common/m-myCenter.html'
              } else if (that.$i18n.locale === 'tw') {
                parent.window.location.href = parent.path + '/common/m-ft-myCenter.html'
              } else if (that.$i18n.locale === 'en') {
                parent.window.location.href = parent.path + '/common/m-en-myCenter.html'
              }
            }, 500)
          },
          error: (err) => {
            console.log(err)
            showToast(this.netWork, 'error')
            that.btnDisabled = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.box {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.content {
  width:100%;
  display:flex;
  flex-direction:column;
  padding:85px 15px 5px;
  box-sizing:border-box;
}
.item_head{
  position: relative;
  line-height:30px;
  padding-bottom:10px;
}
.item_head i{
  color: #212832;
  font-size: 18px;
}
.item_head .title{
  padding-left: 10px;
  font-size: 18px;
  color: #212121;
}
.item_body{
  display: flex;
  line-height: 1.5;
}
.item__left,.item__right{
  flex: 1;
  color: #333333;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: 50%;
}
.new_data,.all_data{
  font-size: 14px;
  color: #212832;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.item_foot{
  color: #333333;
  line-height: 1.5;
  font-size: 14px;
  display: flex;
}
.form_box {
  position:relative;
  flex: 1;
  background:#fff;
  border-radius:4px;
  box-shadow:0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
}
.form_area {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom:15px;
  padding-top:5px;
}
.select_type, .input_area {
  flex: 1;
  display:flex;
  align-items:center;
  height:40px;
  box-sizing:border-box;
}
.select_type {
  color: #333333;
  position: relative;
  margin-bottom: 5px;
}
.select_type i {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 40px;
  color: #212832;
  z-index: 0;
}
.select_type input {
  width: 100%;
  flex: 1;
  height: 40px;
  font-size: 18px;
  border-radius: 0;
  border-bottom: 1px solid #212832;
  box-sizing: border-box;
}
.type_title, .input_title {
  flex: 0 1 auto;
  font-size: 14px;
}
.input_form{
  position:relative;
  box-sizing:border-box;
  line-height: 1.5;
  display: flex;
  align-items: center;
  width: 100%;
}
.input_form i{
  font-size:18px;
  position:absolute;
  left:0;
  top: 50%;
  transform: translateY(-50%);
  color: #212832;
}
.input_form .unit{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #212832;
  font-size: 12px;
}
.input_form input{
  height:50px;
  line-height:16px;
  padding:17px 25px;
  font-size: 16px;
  flex:1;
  border-radius: 0;
  border-bottom:1px solid #212832;
  box-sizing: border-box;
  background: #fff;
  outline: none;
}
.btn_area{
  margin-top: 15px;
}
.cube-btn{
    background: #ffa127!important;
}
.cube-btn.cube-btn_disabled, .cube-btn.cube-btn_disabled.cube-btn_active, .cube-btn.cube-btn_disabled:active{
  background: #ccc!important;
}
::-webkit-input-placeholder {
  font-size:12px;
}
:-moz-placeholder {/* Firefox 18- */
  font-size:12px;
}
::-moz-placeholder{/* Firefox 19+ */
  font-size:12px;
}
:-ms-input-placeholder {
  font-size:12px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
.zy_select{
  border: none;
  border-bottom: 1px solid #212832;
  flex: 1;
  height: 40px;
  font-size: 16px;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: transparent;
  position: relative;
  outline: none;
}
select::-ms-expand { display: none;}
</style>
