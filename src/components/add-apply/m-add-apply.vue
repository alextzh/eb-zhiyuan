<template>
  <transition name="fade">
    <div class="box">
      <div class="content">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.name}}</span>
          <span class="new_data" style='color: #652D92;text-align:right;' v-if="currentProduct.sub_status === 'DSH'">{{$t('apointRecord.pendingReview')}}</span>
          <span class="new_data" style='color: #09B3CD;text-align:right;' v-if="currentProduct.sub_status === 'SHTG'">{{$t('apointRecord.reviewPassed')}}</span>
          <span class="new_data" style='color: #EB1C22;text-align:right;' v-if="currentProduct.sub_status === 'SHJJ'">{{$t('apointRecord.reviewReject')}}</span>
          <span class="new_data" style='color: #92278F;text-align:right;' v-if="currentProduct.sub_status === 'ZJDSH'">{{$t('apointRecord.addPendingReview')}}</span>
          <span class="new_data" style='color: #41123C;text-align:right;' v-if="currentProduct.sub_status === 'XGDSH'">{{$t('apointRecord.modifyPendingReview')}}</span>
          <span class="new_data" style='color: #262163;text-align:right;' v-if="currentProduct.sub_status === 'SHSHZ'">{{$t('apointRecord.redeemPendingReview')}}</span>
          <span class="new_data" style='color: #2E3094;text-align:right;' v-if="currentProduct.sub_status === 'YSH'">{{$t('apointRecord.redeemed')}}</span>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>{{$t('purchase.purchaseAmt')}}：</span>
            <span class="new_data">{{currentProduct.subscribe_money}}{{$t('apointRecord.tenThousandYuan')}}</span>
          </div>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>{{$t('purchase.purchaseTime')}}：</span>
            <span class="new_data">{{currentProduct.subscribe_time}}</span>
          </div>
        </div>
        <div class="item_foot" v-if="currentProduct.recast_start_time">
          <span>{{$t('purchaseRecord.addStart')}}：</span>
          <span>{{currentProduct.recast_start_time}}</span>
        </div>
        <div class="item_foot" v-if="currentProduct.recast_end_time">
          <span>{{$t('purchaseRecord.addEnd')}}：</span>
          <span>{{currentProduct.recast_end_time}}</span>
        </div>
        <div class="item_foot" style='display:flex'>
          <span>{{$t('purchase.settlementTime')}}：</span>
          <div style="flex:1;display:flex;flex-wrap:wrap;">
            <div style="display:flex;width:50%;" v-for="(t, i) in currentProduct.settlement_time" :key="i">
              <span style='flex:1'>{{t}}</span>
            </div>
          </div>
        </div>
      </div>
      <form class="form_area" method="post" @submit.prevent="formSubmit()">
        <div style="padding: 0 15px;">
          <div class="select_type" v-if="pickerArr.length > 1">
            <i class="iconfont icon-unfold"></i>
            <span class="type_title">{{$t('purchase.schemeType')}}：</span>
            <select class="zy_select" @change="selectPlan">
              <option :value="curValue" v-for="(o, i) in pickerArr" :key="i">{{o.text}}</option>
            </select>
          </div>
        </div>
        <div class="input_area">
          <div class="input_form">
            <i class="iconfont icon-redeemed"></i>
            <span class='unit'>{{$t('apointRecord.tenThousandYuan')}}</span>
            <input type="number" v-model="subscribeAmt" maxlength="20" :placeholder="$t('addApply.tip1')" />
          </div>
          <div class="redeem_tip">
            <i class="iconfont icon-risk"></i>
            <span>{{$t('addApply.tip8')}}</span>
          </div>
        </div>
        <div class="btn_area">
          <cube-button type="submit" :disabled="btnDisabled">{{subscribeBtnTxt}}</cube-button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import {getProduct} from 'common/js/storage'
  import {_normalizeStr, getMd5, getBJDate} from 'common/js/tool'
  import Plan from 'common/js/plan'
  import * as API from 'common/js/http'
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
        subscribeAmt: '',
        btnDisabled: false
      }
    },
    computed: {
      subscribeBtnTxt() {
        return this.$i18n.t('addApply.subscribeBtnTxt')
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('addApply.tip1')
      },
      tip2() {
        return this.$i18n.t('addApply.tip2')
      },
      tip3() {
        return this.$i18n.t('addApply.tip3')
      },
      tip4() {
        return this.$i18n.t('addApply.tip4')
      },
      tip5() {
        return this.$i18n.t('addApply.tip5')
      },
      tip6() {
        return this.$i18n.t('addApply.tip6')
      },
      tip7() {
        return this.$i18n.t('apointRecord.tenThousandYuan')
      },
      addTip() {
        return this.$i18n.t('common.addTip')
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
      this.$nextTick(() => {
        this.getSubProductList(this.currentProduct.base_product_id)
      })
    },
    methods: {
      /**
       * 获取申购项目子列表
      */
      getSubProductList(id) {
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/product/listByBaseId',
          data: {
            base_product_id: id
          },
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
      },
      // 提交追加
      formSubmit: function() {
        var that = this
        const param = this.subscribeAmt
        const planName = this.currentPlan.name
        if (this.checkSubscribe(that, param)) {
          showDialog(this.addTip, `${this.tip5}${planName}${this.tip6}${param}${this.tip7}?`, this.confirm, this.cancel, this.confirmFn, this.cancelFn)
        }
      },
      confirmFn() {
        var that = this
        const param = this.subscribeAmt
        this.btnDisabled = true
        this.mySubmit(that, param)
      },
      cancelFn() {
        console.log('cancel')
      },
      // 校验追加份额
      checkSubscribe: function(that, param) {
        var amt = param
        if (!amt) {
          showAlert(that.tip, that.tip1, that.confirm)
          return false
        } else if (amt < 1) {
          showAlert(that.tip, that.tip2, that.confirm)
          return false
        } else if (amt > 100000) {
          showAlert(that.tip, that.tip3, that.confirm)
          return false
        } else if (amt % 1 !== 0) {
          showAlert(that.tip, that.tip4, that.confirm)
          return false
        } else {
          return true
        }
      },
      mySubmit: function(that, param) {
        var subscribeAmt = parseInt(param)
        var product_id = that.currentPlan.id
        var customer_id = that.customer_id
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/subscribe/recast4Vip',
          data: {
            product_id: product_id,
            customer_id: customer_id,
            money: subscribeAmt * 10000
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
            showToast(that.netWork, 'error')
            that.btnDisabled = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.box{
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
  display: flex;
  align-items: center;
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
.form_area{
  display:flex;
  flex-direction:column;
  width:100%;
  padding: 15px 0;
}
.select_type {
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
  flex: 1;
  height: 40px;
  font-size: 18px;
  border-radius: 0;
  border-bottom: 1px solid #212832;
  box-sizing: border-box;
}
.type_title {
  flex: 0 1 auto;
  font-size: 14px;
}
.input_area{
  flex:1;
  padding:0 15px;
}
.input_form{
  position:relative;
  box-sizing:border-box;
  line-height: 1.5;
  display: flex;
  align-items: center;
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
  font-size:12px;
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
.redeem_tip {
  line-height: 15px;
  padding-top: 5px;
}
.redeem_tip i{
  font-size: 12px;
  color: #212832;
  padding: 0 5px;
}
.redeem_tip span{
  font-size: 12px;
  color: #212832;
}
.btn_area{
  margin-top: 30px;
  padding:0 15px;
}
.cube-btn{
  background: #ffac2a!important;
}
.cube-btn.cube-btn_disabled, .cube-btn.cube-btn_disabled.cube-btn_active, .cube-btn.cube-btn_disabled:active{
  background: #ccc!important;
}
.zy_select{
  border: 0 none;
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
</style>
