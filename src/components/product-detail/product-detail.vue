<template>
  <transition name="fade">
    <div class="box">
      <div class="content" v-if="currentProduct">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.name}}</span>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>{{$t('purchase.productType')}}：</span>
            <span class="new_data">{{currentProduct.product_type}}</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">{{$t('purchase.productStatus')}}：</span>
            <span class="all_data" style="flex:0 auto;" v-if="currentProduct.status === 'YYZ'">{{$t('apointRecord.inAppointment')}}</span>
          </div>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>{{$t('purchase.minShare')}}：</span>
            <span class="new_data">{{currentProduct.start_money / 10000}}{{$t('apointRecord.tenThousandYuan')}}</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">{{$t('purchase.increasingShare')}}：</span>
            <span class="all_data" style="flex:0 auto;">1{{$t('apointRecord.tenThousandYuan')}}</span>
          </div>
        </div>
        <div class="item_foot" v-if="currentProduct.status !== '操盘中'">
          <span>{{$t('apointRecord.appointmentTime')}}：</span>
          <span>{{currentProduct.sg_start_time}} <span style="color:#ffac2a;">~</span> {{currentProduct.sg_end_time}}</span>
        </div>
        <div class="item_foot">
          <span>{{$t('purchase.diskTime')}}：</span>
          <span>{{currentProduct.caopan_time}}</span>
        </div>
        <div class="item_foot" style="display: flex;" v-if="currentProduct.describe">
          <span>{{$t('purchase.productIntroduction')}}：</span>
          <div style="flex: 1;">
            <span style="line-height: 1;">{{currentProduct.describe}}</span>
          </div>
        </div>
      </div>
      <div style="padding: 10px;width: 100%;box-sizing: border-box;" v-if="currentProduct">
        <div class="form_box">
          <form class="form_area" method="post" @submit.prevent="formSubmit()">
            <div style="padding: 0 10px;">
              <div class="select_type" v-if="pickerArr.length > 1">
                <i class="iconfont icon-unfold"></i>
                <span class="type_title">{{$t('purchase.schemeType')}}：</span>
                <!-- <input type="text" palceholder="请选择方案类型" @click="selectPlan" readonly :value="curValue" /> -->
                <select id="zySelect" class="zy_select" @change="selectPlan">
                  <option :value="o.text" v-for="(o, i) in pickerArr" :key="i">{{o.text}}</option>
                </select>
              </div>
            </div>
            <div style="padding: 10px;" v-if="showArr.length === 1">
              <div class="item_body">
                <div class="item__left" style="width:65%;">
                  <span>{{$t('purchase.productName')}}：</span>
                  <span class="new_data">{{currentPlan.name}}</span>
                </div>
                <div class="item__right" style="width:35%;text-align:right;">
                  <span style="flex:1;">{{$t('purchase.maxNumber')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{currentPlan.max_amount}}</span>
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
                <span>{{$t('purchase.productDetail')}}：</span>
                <div style="flex: 1;">
                  <span style="line-height: 1;">{{currentPlan.describe}}</span>
                </div>
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
            <div v-if="currentProduct" style="padding: 0 10px;">
              <div class="money_type">
                <span class="title">{{$t('moneyType.title')}}：</span>
                <div class="con">
                  <cube-radio-group v-model="moneyType" :options="options" :horizontal="true" />
                </div>
              </div>
              <div class="input_area">
                <div class="input_title">{{$t('purchase.bidShare')}}：</div>
                <div class="input_con">
                  <input type="number" v-model="purchaseAmt" :placeholder="$t('purchase.tip1')" />
                  <span class='unit'>{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
              </div>
              <div class="btn_area" v-if="btnState === 1">
                <cube-button type="submit" :disabled="btnDisabled">{{purchaseBtnTxt}}</cube-button>
              </div>
              <div class="btn_area" v-if="btnState === 0">
                <cube-button type="submit" :disabled="btnDisabled">{{purchaseDisTxt}}</cube-button>
              </div>
              <div class="btn_area" v-if="btnState === 2">
                <cube-button type="submit" :disabled="btnDisabled">{{purchaseDisTxt1}}</cube-button>
              </div>
            </div>
          </form>
        </div>
        <div class="explain" v-if="showArr.length > 1">
          <h6>【{{$t('explain.title')}}】</h6>
          <p>{{$t('explain.item1')}}</p>
          <p>{{$t('explain.item2')}}</p>
          <p>{{$t('explain.item2_1')}}</p>
          <p>{{$t('explain.item2_2')}}</p>
          <p>{{$t('explain.item2_3')}}</p>
          <p>{{$t('explain.item3')}}</p>
        </div>
      </div>
      <div v-if="hasData" class="noData">
        <div class="no_data">
          <img src="./no_data.png" alt="">
          <p>{{$t('purchase.tip19')}}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {_normalizeStr, getMd5, getBJDate} from 'common/js/tool'
  import {showToast, showAlert, showDialog} from 'common/js/cubeTool'
  import $ from 'jquery'
  import * as API from 'common/js/http'
  import Plan from 'common/js/plan'

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
        hasData: false,
        moneyType: '1',
        type: 'rmb',
        options: [
          {
            label: this.$i18n.t('moneyType.rmb'),
            value: '1'
          },
          {
            label: this.$i18n.t('moneyType.hkd'),
            value: '2'
          }
        ]
      }
    },
    computed: {
      purchaseBtnTxt() {
        return this.$i18n.t('purchase.purchaseBtnTxt')
      },
      purchaseDisTxt() {
        return this.$i18n.t('purchase.purchaseDisTxt')
      },
      purchaseDisTxt1() {
        return this.$i18n.t('purchase.purchaseDisTxt1')
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('purchase.tip1')
      },
      tip2() {
        return this.$i18n.t('purchase.tip2')
      },
      tip3() {
        return this.$i18n.t('purchase.tip3')
      },
      tip4() {
        return this.$i18n.t('purchase.tip4')
      },
      tip5() {
        return this.$i18n.t('purchase.tip5')
      },
      tip6() {
        return this.$i18n.t('purchase.tip6')
      },
      tip7() {
        return this.$i18n.t('apointRecord.tenThousandYuan')
      },
      tip8() {
        return this.$i18n.t('apointRecord.yuan')
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
      this.user_id = parent.siteUserId
    },
    mounted() {
      this.$nextTick(() => {
        this.getSubProductList()
      })
    },
    watch: {
      moneyType(newVal) {
        if (newVal === '1') {
          this.type = 'rmb'
        } else {
          this.type = 'hk'
        }
      }
    },
    methods: {
      /**
       * 获取预约项目信息
      */
      getSubProductList() {
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/deduct/product4Vip',
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': secret_key,
            'time_stamp': time_stamp
          },
          success: (res) => {
            this.loading.hide()
            if (!res.ret) {
              showToast(res.msg, 'warn')
              this.hasData = true
              return false
            }
            var obj = res.obj
            // 开始时间的时间戳
            var startTime = new Date(obj.sg_start_time + '000').getTime()
            // 结束时间的时间戳
            var endTime = new Date(obj.sg_end_time + '000').getTime()
            if (time_stamp < startTime) {
              this.btnState = 0
              this.btnDisabled = true
            } else if (time_stamp > endTime) {
              this.btnState = 2
              this.btnDisabled = true
            } else {
              this.btnState = 1
              this.btnDisabled = false
            }
            obj.caopan_time = obj.caopan_time.substring(0, 10)
            this.currentProduct = res.obj
            var list = res.obj.product_list
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
              this.hasData = false
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
      // 表单提交
      formSubmit() {
        var that = this
        const param = this.purchaseAmt
        if (this.checkPurchase(that, param)) {
          showDialog(this.tip5, `${this.tip6}${param}${this.tip7}?`, this.confirm, this.cancel, this.confirmFn, this.cancelFn)
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
      // 校验预约金额
      checkPurchase: (that, param) => {
        var amt = param
        var curPlan = that.currentPlan
        var min = curPlan.min_money / 10000
        var step = curPlan.step_money / 10000
        if (!amt) {
          showAlert(that.tip, that.tip1, that.confirm)
          return false
        } else if (amt < min) {
          showAlert(that.tip, `${that.tip2}${min}${that.tip7}`, that.confirm)
          return false
        } else if (amt > 100000) {
          showAlert(that.tip, that.tip3, that.confirm)
          return false
        } else if (amt % step !== 0) {
          showAlert(that.tip, `${that.tip4}${step}${that.tip8}`, that.confirm)
          return false
        } else {
          return true
        }
      },
      /**
       * 提交预约金额
      */
      mySubmit: (that, param) => {
        var product_id = that.currentPlan.id
        var purchaseAmt = parseInt(param)
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/deduct/apply4Vip',
          data: {
            product_id: product_id,
            user_id: that.user_id,
            deduct_money: purchaseAmt * 10000,
            money_type: that.type
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
                if (that.moneyType === '1') {
                  parent.window.location.href = parent.path + '/common/myCenter.html?code=zhzx&no=0'
                } else {
                  parent.window.location.href = parent.path + '/common/myCenter.html?code=zhzx&no=1'
                }
              } else if (that.$i18n.locale === 'tw') {
                if (that.moneyType === '1') {
                  parent.window.location.href = parent.path + '/common/ft_myCenter.html?code=zhzx&no=0'
                } else {
                  parent.window.location.href = parent.path + '/common/ft_myCenter.html?code=zhzx&no=1'
                }
              } else if (that.$i18n.locale === 'en') {
                if (that.moneyType === '1') {
                  parent.window.location.href = parent.path + '/common/en_myCenter.html?code=zhzx&no=0'
                } else {
                  parent.window.location.href = parent.path + '/common/en_myCenter.html?code=zhzx&no=1'
                }
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

<style lang="scss">
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
  padding:100px 15px 5px;
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
  line-height: 2;
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
  color: #ffac2a;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.item_foot{
  color: #333333;
  line-height: 2;
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
  color: #ffac2a;
  z-index: 0;
}
.select_type input {
  width: 100%;
  flex: 1;
  height: 40px;
  font-size: 18px;
  border-radius: 0;
  border-bottom: 1px solid #ffac2a;
  box-sizing: border-box;
  position: relative;
  background: transparent;
  cursor: pointer;
}
.type_title, .input_title {
  flex: 0 1 auto;
  font-size: 14px;
}
.input_con {
  display:flex;
  box-sizing:border-box;
  height:40px;
  flex:1;
  align-items:center;
}
.input_con .unit {
  flex:0 1 auto;
  color:#ffac2a;
}
.input_con input {
  position:relative;
  width: 100%;
  height:40px;
  flex:1;
  border-radius: 0;
  box-sizing: border-box;
  outline: none;
  border-bottom: 1px solid #ffac2a;
}
.btn_area{
  margin-top: 15px;
}
.cube-btn{
  background: #ffac2a!important;
}
.cube-btn.cube-btn_disabled, .cube-btn.cube-btn_disabled.cube-btn_active, .cube-btn.cube-btn_disabled:active{
  background: #ccc!important;
}
.zy_select{
  border: none;
  border-bottom: 1px solid #ffac2a;
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
.explain {
  padding: 15px 0;
}
.explain>h6{
  line-height: 2;
  font-size: 14px;
  color: #222;
}
.explain>p{
  font-size: 14px;
  line-height: 1.5;
  color: #666;
}
.money_type{
  display: flex;
  align-items: center;
  .title{
    font-size: 14px;
  }
  .con{
    flex: 1;
  }
}
.border-right-1px:after{
  border-right: none;
}
.cube-radio-group[data-horz="true"]::after{
  border: none!important;
}
.cube-radio-group[data-horz="true"] .cube-radio-wrap{
  justify-content: flex-start!important;
}
.cube-radio-label{margin-bottom: -2px;}
</style>
