<template>
  <transition name="fade">
    <div class="box">
      <div class="content">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.name}}</span>
        </div>
        <div class="item_body">
          <div class="item__left" style="width:44%;">
            <span>{{$t('purchase.purchaseAmt')}}：</span>
            <span class="new_data">{{currentProduct.subscribe_money}}{{$t('apointRecord.tenThousandYuan')}}</span>
          </div>
          <div class="item__right" style="width:56%;text-align:right;">
            <span style="flex:1;">{{$t('purchase.purchaseTime')}}：</span>
            <span class="all_data" style="flex:0 auto;">{{currentProduct.subscribe_time}}</span>
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
        <div class="input_area">
          <div class="input_form">
            <i class="iconfont icon-redeemed"></i>
            <span class='unit'>{{$t('apointRecord.tenThousandYuan')}}</span>
            <input type="number" v-model="redeemAmt" maxlength="20" :placeholder="$t('redeem.tip1')" />
          </div>
          <!-- <div class="redeem_tip">
            <i class="iconfont icon-risk"></i>
            <span>{{$t('redeem.tip2')}}</span>
          </div> -->
        </div>
        <div class="btn_area">
          <cube-button type="submit" :disabled="btnDisabled">{{redeemBtnTxt}}</cube-button>
        </div>
      </form>
      <div class="redeem_rule">
        <div class="rule_title">
          <i class="iconfont icon-rule"></i>
          <span class="tit">{{$t('redeem.rule.title')}}</span>
        </div>
        <span>1.{{$t('redeem.rule.one')}}</span>
        <span>2.{{$t('redeem.rule.two')}}</span>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import {getProduct} from 'common/js/storage'
  import {getMd5, getBJDate} from 'common/js/tool'
  import * as API from 'common/js/http'
  import {showToast, showAlert, showDialog} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        loading: null,
        currentProduct: null,
        redeemAmt: '',
        btnDisabled: false
      }
    },
    computed: {
      redeemBtnTxt() {
        return this.$i18n.t('redeem.redeemBtnTxt')
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('redeem.tip1')
      },
      tip2() {
        return this.$i18n.t('redeem.tip3')
      },
      tip3() {
        return this.$i18n.t('redeem.rule.two')
      },
      tip4() {
        return this.$i18n.t('redeem.tip4')
      },
      tip5() {
        return this.$i18n.t('redeem.tip5')
      },
      tip6() {
        return this.$i18n.t('apointRecord.tenThousandYuan')
      },
      redeemTip() {
        return this.$i18n.t('common.redeemTip')
      },
      netWork() {
        return this.$i18n.t('common.network')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
      },
      cancel() {
        return this.$i18n.t('common.cancel')
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
      this.customer_id = parent.sessionStorage.getItem('zyCid')
    },
    mounted() {
      setTimeout(() => {
        this.loading.hide()
      }, 20)
    },
    methods: {
      // 提交赎回
      formSubmit() {
        const param = this.redeemAmt
        if (this.checkRedeem(param)) {
          showDialog(this.redeemTip, `${this.tip5}${param}${this.tip6}?`, this.confirm, this.cancel, this.confirmFn, this.cancelFn)
        }
      },
      confirmFn() {
        const param = this.redeemAmt
        this.btnDisabled = true
        this.mySubmit(param)
      },
      cancelFn() {
        console.log('cancel')
      },
      // 校验赎回金额
      checkRedeem(param) {
        var amt = param
        var max = getProduct().subscribe_money
        if (!amt) {
          showAlert(this.tip, this.tip1, this.confirm)
          return false
        } else if (amt < 1) {
          showAlert(this.tip, this.tip2, this.confirm)
          return false
        } else if (amt > max) {
          showAlert(this.tip, this.tip3, this.confirm)
          return false
        } else if (amt % 1 !== 0) {
          showAlert(this.tip, this.tip4, this.confirm)
          return false
        } else {
          return true
        }
      },
      mySubmit(param) {
        var redeemAmt = parseInt(param)
        var customer_id = this.customer_id
        var subscribe_id = getProduct().subscribe_id
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/redeem/addRedeem',
          data: {
            subscribe_id: subscribe_id,
            customer_id: customer_id,
            redeem_money: redeemAmt * 10000
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
              this.btnDisabled = false
              return false
            }
            showToast(res.msg, 'correct')
            setTimeout(() => {
              this.btnDisabled = false
              if (this.$i18n.locale === 'zh') {
                parent.window.location.href = parent.path + '/common/myCenter.html?code=zhzx&no=0'
              } else if (this.$i18n.locale === 'tw') {
                parent.window.location.href = parent.path + '/common/ft_myCenter.html?code=zhzx&no=0'
              } else if (this.$i18n.locale === 'en') {
                parent.window.location.href = parent.path + '/common/en_myCenter.html?code=zhzx&no=0'
              }
            }, 500)
          },
          error: (err) => {
            console.log(err)
            showToast(this.netWork, 'error')
            this.btnDisabled = false
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
  width: 800px;
  left: 50%;
  margin-left: -400px;
}
.content {
  width:100%;
  display:flex;
  flex-direction:column;
  padding:30px 15px 5px;
  box-sizing:border-box;
}
.item_head{
  position: relative;
  line-height:30px;
  padding-bottom:10px;
}
.item_head i{
  color: #ffac2a;
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
  width:50%;
}
.new_data,.all_data{
  font-size: 14px;
  color: #ffac2a;
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
  color: #ffac2a;
}
.input_form .unit{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #ffac2a;
}
.input_form input{
  height:50px;
  line-height:16px;
  padding:17px 25px;
  font-size: 16px;
  flex:1;
  border-bottom:1px solid #ffac2a;
  border-radius: 0;
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
  color: #ffac2a;
  padding: 0 5px;
}
.redeem_tip span{
  font-size: 12px;
  color: #ffac2a;
}
.btn_area{
  margin-top: 30px;
  padding:0 15px;
}
.btn_area .devide{
  position: relative;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 18px;
  color: #333;
}
.btn_area .devide::after{
  position: absolute;
  width: 100%;
  height: 1px;
  top: 50%;
  transition: translateY(-50%);
  border: 1px solid #BDBDBD;
}
.redeem_rule{
  display:flex;
  flex-direction:column;
  width:100%;
  padding:15px;
  box-sizing:border-box;
}
.redeem_rule span{
  line-height: 1.5;
  color: #666666;
  font-size: 12px;
}
.rule_title{
  margin-bottom:15px;
}
.rule_title i{
  font-size:20px;
  color:#ffac2a;
}
.rule_title .tit{
  font-size:18px;
  color:#222;
}
.cube-btn{
  background: #ffac2a!important;
}
.cube-btn.cube-btn_disabled, .cube-btn.cube-btn_disabled.cube-btn_active, .cube-btn.cube-btn_disabled:active{
  background: #ccc!important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
</style>
