<template>
  <transition name="fade">
    <div class="m-container">
      <div class="list">
        <cube-scroll  ref="scroll"
                      v-if="apointRecord.length > 0"
                      :options="options"
                      @pulling-down="onPullingDown">
          <li class="item-box" v-for="(item, index) in apointRecord" :key="index">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-item"></i>
                <span class="title">{{item.product_name}}</span>
                <span class="item_state" style='color: #652D92;' v-if="item.status === 'DSH'">{{$t('apointRecord.pendingReview')}}</span>
                <span class="item_state" style='color: #EB1C22;' v-if="item.status === 'SHJJ'">{{$t('apointRecord.reviewReject')}}</span>
                <span class="item_state" style='color: #09B3CD;' v-if="item.status === 'SHTG'">{{$t('apointRecord.reviewPassed')}}</span>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('purchase.bidShare')}}：</span>
                  <span class="new_data">{{item.deduct_money}}{{$t('apointRecord.tenThousandYuan')}}</span>
                </div>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('purchase.purchaseTime')}}：</span>
                  <span class="all_data">{{item.create_time}}</span>
                </div>
              </div>
            </div>
          </li>
        </cube-scroll>
        <div v-if="hasData">
          <div class="no_data">
            <img src="./no_data.png" alt="">
            <p>{{$t('purchase.tip22')}}</p>
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
  import {showToast} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        loading: null,
        apointRecord: [],
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
      this.user_id = parent.userId // parent.userId
    },
    mounted() {
      setTimeout(() => {
        this._getApointRecord()
      }, 20)
    },
    methods: {
      _getApointRecord() {
        const time_stamp = getBJDate()
        const secret_key = getMd5()
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/deduct/myDeducts4Vip',
          data: {
            user_id: this.user_id
          },
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
            const list = res.rows
            this.apointRecord = this._normalizeList(list)
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
        this._getApointRecord()
      },
      _normalizeList(list) {
        if (list === []) {
          return []
        } else {
          for (let i = 0; i < list.length; i++) {
            list[i].deduct_money = rendererZhMoneyWan(list[i].deduct_money)
          }
          return list
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .m-container {
    position: absolute;
    top: 70px;
    bottom: 0;
    width: 100%;
  }
  .list{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
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
    color: #212832;
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
    color:#212832;
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
    color: #212832;
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
    background: #ffa127!important;
  }
  .cube-btn.cube-btn_disabled, .cube-btn.cube-btn_disabled.cube-btn_active, .cube-btn.cube-btn_disabled:active{
    background: #ccc!important;
  }
</style>
