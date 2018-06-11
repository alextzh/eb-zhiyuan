<template>
  <transition name="fade">
    <div class="box">
      <div class="content" v-if="currentPlan">
        <div class="item_body">
          <div class="item__left">
            <span>账户余额：</span>
            <span style="color: #ffac2a;padding-right: 5px;">¥</span>
            <span class="new_data" style="font-size:24px;">8,975,579,773.67</span>
          </div>
        </div>
        <div class="item_body" style="line-height:30px;">
          <div class="item__left">
            <span>预约中项目：</span>
            <span class="new_data">{{currentPlan.loanName}}</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">金额：</span>
            <span class="all_data" style="flex:0 auto;">{{currentPlan.platformCharge / 10000}}万</span>
          </div>
        </div>
        <div class="item_body" style="line-height:30px;">
          <div class="item__left">
            <span>人数：</span>
            <span class="new_data">{{currentPlan.notrepayPerNo}}人</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">进度：</span>
            <span class="all_data" style="flex:0 auto;">{{currentPlan.percent}}%</span>
          </div>
        </div>
        <div class="item_body" style="line-height:30px;">
          <div class="item__left">
            <span>开始时间：</span>
            <span class="new_data">{{currentPlan.investStartTime}}</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">结束时间：</span>
            <span class="all_data" style="flex:0 auto;">{{currentPlan.financeEndTime}}</span>
          </div>
        </div>
      </div>
      <div class="content" v-else>
        <div class="item_body">
          <div class="item__left">
            <span>账户余额：</span>
            <span style="color: #ffac2a;padding-right: 5px;">¥</span>
            <span class="new_data" style="font-size:24px;">8,975,579,773.67</span>
          </div>
        </div>
        <div class="item_body" style="line-height:30px;">
          <div class="item__left">
            <span>预约中项目：</span>
            <span class="new_data">暂无预约项目</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">金额：</span>
            <span class="all_data" style="flex:0 auto;">0万</span>
          </div>
        </div>
        <div class="item_body" style="line-height:30px;">
          <div class="item__left">
            <span>人数：</span>
            <span class="new_data">0人</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">进度：</span>
            <span class="all_data" style="flex:0 auto;">0%</span>
          </div>
        </div>
        <div class="item_body" style="line-height:30px;">
          <div class="item__left">
            <span>开始时间：</span>
            <span class="new_data">- -</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">结束时间：</span>
            <span class="all_data" style="flex:0 auto;">- -</span>
          </div>
        </div>
      </div>
      <div style="padding: 0 10px;width: 100%;box-sizing: border-box;">
        <div class="form_box">
          <form class="form_area" method="post" @submit.prevent="formSubmit()">
            <div v-if="currentPlan">
              <div class="select_type">
                <i class="iconfont icon-unfold"></i>
                <span class="type_title">预约项目：</span>
                <select id="zySelect" class="zy_select" @change="selectPlan">
                  <option :value="o.text" v-for="(o, i) in pickerArr" :key="i">{{o.text}}</option>
                </select>
              </div>
            </div>
            <div v-else>
              <div class="select_type">
                <i class="iconfont icon-unfold"></i>
                <span class="type_title">预约项目：</span>
                <select id="zySelect" class="zy_select">
                  <option value="">暂无预约项目</option>
                </select>
              </div>
            </div>
            <div>
              <div class="money_type">
                <span class="title">{{$t('moneyType.title')}}：</span>
                <div class="con">
                  <cube-radio-group v-model="moneyType" :options="options" :horizontal="true" />
                </div>
              </div>
              <div class="input_area">
                <div class="input_title">预约金额：</div>
                <div class="input_con">
                  <input type="number" v-model="purchaseAmt" :placeholder="$t('purchase.tip1')" />
                  <span class='unit'>{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
              </div>
              <div v-if="currentPlan && currentPlan.loanProvince === '1'">
                <div class="select_type">
                  <i class="iconfont icon-unfold"></i>
                  <span class="type_title">使用红包：</span>
                  <select id="zySelect" class="zy_select" @change="selectCoupon">
                    <option value="">请选择红包</option>
                  </select>
                </div>
                <div class="item_body">
                  <div class="item__left">
                    <span>实际支付：</span>
                    <span class="new_data">0</span>
                  </div>
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
              <div class="btn_area" v-if="btnState === 4">
                <cube-button type="submit" :disabled="btnDisabled">{{purchaseBtnTxt}}</cube-button>
              </div>
            </div>
          </form>
        </div>
        <div class="explain">
          <h6>【风险提示】</h6>
          <p>攀岩项目是高波动率产品，建议谨慎选择，理性投资。</p>
        </div>
        <div class="explain">
          <h6>【攀岩项目说明】</h6>
          <p>1.攀岩项目是指对操盘手项目风险金的募集；</p>
          <p>2.投资门槛：投攀岩项目的投资人须满足10次以上（含10次）成功投资经验的；</p>
          <p>3.不限人数，额度满按时间排序入围；</p>
          <p>4.预约截止时间若未满标，平台垫付差额；</p>
        </div>
        <div class="explain">
          <h6>【网签合同下载步骤】</h6>
          <p>1.项目操盘后可以下载合同；</p>
          <p>2.预约列表页面,点击下载签名合同；</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getMd5, getBJDate} from 'common/js/tool'
  import {showToast, showAlert, showDialog} from 'common/js/cubeTool'
  import $ from 'jquery'
  import * as API from 'common/js/http'
  import Plan from 'common/js/plan'

  const msg = [
    {
      financeEndTime: '2018-05-30 12:00:00',
      investStartTime: '2018-02-24 08:00:00',
      isExchange: 0,
      loanAmt: 20000000,
      loanDays: 0,
      loanName: '银河战队V4期【T+10*6】',
      loanNo: '2017022373881679',
      loanProvince: '1',
      notrepayPerNo: 3,
      platformCharge: 38000,
      remainDays: 0
    },
    {
      financeEndTime: '2018-06-21 12:00:00',
      investStartTime: '2018-06-21 08:00:00',
      isExchange: 0,
      loanAmt: 10000000,
      loanDays: 0,
      loanName: '重仓V4期(增1)【T+9*1+10*4】',
      loanNo: '2017062019360256',
      loanProvince: '0',
      notrepayPerNo: 0,
      platformCharge: 0,
      remainDays: 0
    }
  ]

  export default {
    data() {
      return {
        loading: null,
        showArr: [],
        pickerArr: [],
        currentPlan: null,
        customer_id: '',
        purchaseAmt: '',
        btnState: 1,
        btnDisabled: false,
        moneyType: '1',
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
        this.getRockLoanList()
      })
    },
    watch: {
      moneyType(newVal) {
        console.log(newVal)
      }
    },
    methods: {
      /**
       * 获取预约项目列表
      */
      getRockLoanList() {
        this.loading.hide()
        if (!msg || msg.length === 0) {
          this.btnState = 4
          this.btnDisabled = true
          return
        }
        var showArr = msg
        var pickerArr = []
        if (showArr.length > 0) {
          showArr.forEach((item, index) => {
            pickerArr.push(new Plan({
              text: item.loanName,
              value: index
            }))
            item.percent = (item.platformCharge / item.loanAmt * 100).toFixed(2)
          })
          this.pickerArr = pickerArr
          this.showArr = showArr
          this.currentPlan = showArr[0]
          this.changeBtnState(showArr[0].investStartTime, showArr[0].financeEndTime)
        }
      },
      changeBtnState(startTime, endTime) {
        const time_stamp = getBJDate()
        // 开始时间的时间戳
        var start = new Date(startTime + '000').getTime()
        // 结束时间的时间戳
        var end = new Date(endTime + '000').getTime()
        if (time_stamp < start) {
          this.btnState = 0
          this.btnDisabled = true
        } else if (time_stamp > end) {
          this.btnState = 2
          this.btnDisabled = true
        } else {
          this.btnState = 1
          this.btnDisabled = false
        }
      },
      // 红包选择
      selectCoupon(e) {
        this.currentCoupon = this.CouponArr[e.target.options.selectedIndex]
      },
      // 方案选择
      selectPlan(e) {
        this.currentPlan = this.showArr[e.target.options.selectedIndex]
        this.changeBtnState(this.showArr[e.target.options.selectedIndex].investStartTime, this.showArr[e.target.options.selectedIndex].financeEndTime)
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
            deduct_money: purchaseAmt * 10000
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
                parent.window.location.href = parent.path + '/common/myCenter.html?code=zhzx&no=0'
              } else if (that.$i18n.locale === 'tw') {
                parent.window.location.href = parent.path + '/common/ft_myCenter.html?code=zhzx&no=0'
              } else if (that.$i18n.locale === 'en') {
                parent.window.location.href = parent.path + '/common/en_myCenter.html?code=zhzx&no=0'
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
  padding:100px 10px 0;
  box-sizing:border-box;
}
.item_body{
  display: flex;
  line-height: 50px;
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
.form_box {
  position:relative;
  flex: 1;
  background:#fff;
}
.form_area {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.select_type, .input_area {
  flex: 1;
  display:flex;
  align-items:center;
  height:50px;
  box-sizing:border-box;
}
.select_type {
  color: #333333;
  position: relative;
}
.select_type i {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  color: #ffac2a;
  z-index: 0;
}
.select_type input {
  width: 100%;
  flex: 1;
  height: 50px;
  font-size: 18px;
  border-radius: 0;
  border-bottom: 1px solid #ffac2a;
  box-sizing: border-box;
  position: relative;
  background: transparent;
  cursor: pointer;
  padding-right: 95px;
}
.type_title, .input_title {
  flex: 0 1 auto;
  font-size: 14px;
}
.input_con {
  display:flex;
  box-sizing:border-box;
  height:50px;
  flex:1;
  align-items:center;
}
.input_con .unit {
  position: absolute;
  line-height: 50px;
  right: 0;
  color:#ffac2a;
}
.input_con input {
  position:relative;
  width: 100%;
  height:50px;
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
  height: 50px;
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
  line-height: 50px;
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
