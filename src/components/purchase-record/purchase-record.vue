<template>
  <transition name="fade">
    <div class="m-container">
      <div class="list">
        <cube-scroll  ref="scroll"
                      v-if="purchaseList.length > 0"
                      :options="options"
                      @pulling-down="onPullingDown">
          <li class="item-box" v-for="(item, index) in purchaseList" :key="index">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-item"></i>
                <span class="title">{{item.name}}</span>
                <span class="item_state" style='color: #652D92;' v-if="item.sub_status === 'DSH'">{{$t('apointRecord.pendingReview')}}</span>
                <span class="item_state" style='color: #09B3CD;' v-if="item.sub_status === 'SHTG'">{{$t('apointRecord.reviewPassed')}}</span>
                <span class="item_state" style='color: #EB1C22;' v-if="item.sub_status === 'SHJJ'">{{$t('apointRecord.reviewReject')}}</span>
                <span class="item_state" style='color: #92278F;' v-if="item.sub_status === 'ZJDSH'">{{$t('apointRecord.addPendingReview')}}</span>
                <span class="item_state" style='color: #41123C;' v-if="item.sub_status === 'XGDSH'">{{$t('apointRecord.modifyPendingReview')}}</span>
                <span class="item_state" style='color: #262163;' v-if="item.sub_status === 'SHSHZ'">{{$t('apointRecord.redeemPendingReview')}}</span>
                <span class="item_state" style='color: #2E3094;' v-if="item.sub_status === 'YSH'">{{$t('apointRecord.redeemed')}}</span>
              </div>
              <div class="item_body">
                <div class="item__left" style="width:44%;">
                  <span>{{$t('purchase.purchaseAmt')}}：</span>
                  <span class="new_data">{{item.subscribe_money}}{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
                <div class="item__right" style="width:56%;text-align:right;">
                  <span style="flex:1;">{{$t('redeemRecord.applyTime')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{item.subscribe_time}}</span>
                </div>
              </div>
              <div class="item_body" v-if="item.recast_money">
                <div class="item__left">
                  <span>{{$t('purchaseRecord.addShare')}}：</span>
                  <span class="new_data">{{item.recast_money / 10000}}{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
              </div>
              <div class="item_body" v-if="item.redeem_money">
                <div class="item__left">
                  <span>{{$t('purchaseRecord.redeemShare')}}：</span>
                  <span class="new_data">{{item.redeem_money / 10000}}{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
              </div>
              <div class="item_foot" v-if="item.recast_start_time">
                <span>{{$t('purchaseRecord.addStart')}}：</span>
                <span>{{item.recast_start_time}}</span>
              </div>
              <div class="item_foot" v-if="item.recast_end_time">
                <span>{{$t('purchaseRecord.addEnd')}}：</span>
                <span>{{item.recast_end_time}}</span>
              </div>
              <div class="item_foot" style="display: flex;">
                <span>{{$t('purchase.settlementTime')}}：</span>
                <div style="flex:1;display:flex;flex-wrap:wrap;">
                  <div style="display:flex;width:50%;" v-for="(t, i) in item.settlement_time" :key="i">
                    <span style='flex:1'>{{t}}</span>
                  </div>
                </div>
              </div>
              <div class="item_action" v-if="item.isRedeem && item.isRecast">
                <div style="flex: 1;margin-right: 10px;">
                  <cube-button @click="redeemAction(item)">{{$t('purchaseRecord.applyRedeem')}}</cube-button>
                </div>
                <div style="flex: 1;">
                  <cube-button @click="addAction(item)">{{$t('purchaseRecord.applyAdd')}}</cube-button>
                </div>
              </div>
              <div class="item_action" v-if="item.isRedeem && !item.isRecast">
                <div style="flex: 1;" v-if="item.isRedeem">
                  <cube-button @click="redeemAction(item)">{{$t('purchaseRecord.applyRedeem')}}</cube-button>
                </div>
              </div>
              <div class="item_action" v-if="!item.isRedeem && item.isRecast">
                <div style="flex: 1;">
                  <cube-button @click="addAction(item)">{{$t('purchaseRecord.applyAdd')}}</cube-button>
                </div>
              </div>
            </div>
          </li>
        </cube-scroll>
        <div v-if="hasData">
          <div class="no_data">
            <img src="./no_data.png" alt="">
            <p>{{$t('purchase.tip21')}}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import {rendererZhMoneyWan, getMd5, getBJDate} from 'common/js/tool'
  import * as API from 'common/js/http'
  import {setProduct} from 'common/js/storage'
  import {showToast} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        loading: null,
        purchaseList: [],
        pageData: {
          customer_id: ''
        },
        options: {
          pullDownRefresh: {
            threshold: 90,
            stop: 40,
            txt: this.$i18n.t('scroll.defaultRefreshTxt')
          },
          scrollbar: {
            fade: true
          }
        },
        hasData: false
      }
    },
    computed: {
      netWork() {
        return this.$i18n.t('common.network')
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      cancelTip() {
        return this.$i18n.t('common.cancelTip')
      },
      tip1() {
        return this.$i18n.t('purchaseRecord.tip1')
      },
      tip2() {
        return this.$i18n.t('purchaseRecord.tip2')
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
      this.pageData.customer_id = parent.sessionStorage.getItem('zyCid') // parent.sessionStorage.getItem('zyCid')
    },
    mounted() {
      setTimeout(() => {
        this._getPurchaseList()
      }, 20)
    },
    methods: {
      _getPurchaseList() {
        const time_stamp = getBJDate()
        const secret_key = getMd5()
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/subscribe/allByCustomerId',
          data: this.pageData,
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
            const list = res.obj
            this.purchaseList = this._normalizeList(list)
            this.hasData = false
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          },
          error: (err) => {
            this.loading.hide()
            console.log(err)
            showToast(this.netWork, 'error')
          }
        })
      },
      onPullingDown() {
        // 更新数据
        this._getPurchaseList()
      },
      _normalizeList(list) {
        if (list === []) {
          return []
        } else {
          for (let i = 0; i < list.length; i++) {
            list[i].subscribe_money = rendererZhMoneyWan(list[i].subscribe_money)
            list[i].settlement_time = this._normalizeStr(list[i].settlement_time)
          }
          return list
        }
      },
      _normalizeStr(str) {
        str = str || ''
        const arr = str.split(',')
        const newArr = arr.map(item => {
          return item
        })
        return newArr
      },
      // 申请赎回操作
      redeemAction(e) {
        setProduct(e)
        if (this.$i18n.locale === 'zh') {
          parent.window.location.href = parent.path + '/common/redeem.html'
        } else if (this.$i18n.locale === 'tw') {
          parent.window.location.href = parent.path + '/common/ft_redeem.html'
        } else if (this.$i18n.locale === 'en') {
          parent.window.location.href = parent.path + '/common/en_redeem.html'
        }
      },
      // 追加份额
      addAction(e) {
        setProduct(e)
        if (this.$i18n.locale === 'zh') {
          parent.window.location.href = parent.path + '/common/addApply.html'
        } else if (this.$i18n.locale === 'tw') {
          parent.window.location.href = parent.path + '/common/ft_addApply.html'
        } else if (this.$i18n.locale === 'en') {
          parent.window.location.href = parent.path + '/common/en_addApply.html'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .m-container {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 800px;
    left: 50%;
    margin-left: -400px;
  }
  .list{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .scroll_list {
    height: 100%;
    overflow: hidden;
  }
  .item-box {
    padding-bottom: 10px;
  }
  .item{
    position:relative;
    padding: 10px;
    box-sizing:border-box;
    background:#fff;
    transition:all .3s;
    border-radius:4px;
    box-shadow:0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
  }
  .item:active{
    box-shadow: 0 1px 3px 0 rgba(244,67,54,.2), 0 1px 1px 0 rgba(244,67,54,.14), 0 2px 1px -1px rgba(244,67,54,.12);
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
  .item_state{
    float: right;
    padding:0;
    background:#fff;
    color:#ffac2a;
  }
  .item_body{
    display: flex;
    line-height: 1.5;
  }
  .item__left,.item__right{
    flex: 1;
    color: #333;
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
    color: #333;
    line-height: 1.5;
    font-size: 14px;
    display: flex;
  }
  .item_action{
    position: relative;
    margin-top:10px;
    padding-top:10px;
    border-top:1px dashed #BDBDBD;
    display: flex;
  }
  span {
    font-size: 14px;
  }
  .cube-btn{
    background: #ffac2a!important;
  }
  .cube-btn.cube-btn_disabled, .cube-btn.cube-btn_disabled.cube-btn_active, .cube-btn.cube-btn_disabled:active{
    background: #ccc!important;
  }
</style>
