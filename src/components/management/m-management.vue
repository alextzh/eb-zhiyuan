<template>
  <transition name="fade">
    <div class="m-container">
      <div class="list">
        <cube-scroll  ref="scroll"
                      v-if="contractList.length > 0"
                      :options="options"
                      @pulling-down="onPullingDown">
          <li class="item-box" v-for="(item, index) in contractList" :key="index">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-agreement"></i>
                <span class="title">{{item.contract_type}}</span>
                <span class="item_state" style='color: #652D92;' v-if="item.status === 'DQ'">{{$t('management.toBeSigned')}}</span>
                <span class="item_state" style='color: #09B3CD;' v-if="item.status === 'QYWC'">{{$t('management.signCompleted')}}</span>
                <span class="item_state" style='color: #92278F;' v-if="item.status === 'GD'">{{$t('management.archive')}}</span>
                <span class="item_state" style='color: #41123C;' v-if="item.status === 'WQ'">{{$t('management.unSigned')}}</span>
                <span class="item_state" style='color: #2E3094;' v-if="item.status === 'KHYQ'">{{$t('management.signed')}}</span>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('management.contractName')}}：</span>
                  <span class="new_data">{{item.doc_title}}</span>
                </div>
              </div>
              <div class="item_action" v-if="item.sign_url && item.status === 'DQ'">
                <div style="flex: 1;">
                  <cube-button @click="toSign(item.sign_url)">{{$t('management.signContract')}}</cube-button>
                </div>
              </div>
              <div class="item_action" v-else>
                <div style="flex: 1;margin-right:10px;" v-if="device === 'Android' || device === 'WindowsPhone'">
                  <a class="cube-btn" :href="item.download_url">{{$t('management.download')}}</a>
                </div>
                <div style="flex: 1;margin-right:10px;" v-if="device === 'iPhone'">
                  <cube-button @click="toDownload">{{$t('management.download')}}</cube-button>
                </div>
                <div style="flex: 1;">
                  <cube-button @click="toView(item.viewpdf_url)">{{$t('management.view')}}</cube-button>
                </div>
              </div>
            </div>
          </li>
        </cube-scroll>
        <div v-if="hasData">
          <div class="no_data">
            <img src="./no_data.png" alt="">
            <p>{{$t('purchase.tip24')}}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import * as API from 'common/js/http'
  import {getMd5, getBJDate} from 'common/js/tool'
  import {showToast, showAlert} from 'common/js/cubeTool'
  import { mapMutations } from 'vuex'

  const u = navigator.userAgent

  export default {
    data() {
      return {
        loading: null,
        contractList: [],
        customer_id: '',
        options: {
          pullDownRefresh: {
            threshold: 90,
            stop: 40,
            txt: '刷新成功'
          },
          scrollbar: {
            fade: true
          }
        },
        hasData: false,
        device: ''
      }
    },
    computed: {
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      netWork() {
        return this.$i18n.t('common.network')
      },
      downloadTip() {
        return this.$i18n.t('common.downloadTip')
      },
      tip() {
        return this.$i18n.t('management.tip')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
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
      this.customer_id = parent.localStorage.getItem('zyId')
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
        this.device = 'Android'
      } else if (u.indexOf('iPhone') > -1) { // 苹果手机
        this.device = 'iPhone'
      } else if (u.indexOf('Windows Phone') > -1) { // winphone手机
        this.device = 'WindowsPhone'
      }
    },
    mounted() {
      setTimeout(() => {
        this.getContractList()
      }, 20)
    },
    methods: {
      getContractList() {
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/contract/myContract',
          data: {
            customer_id: this.customer_id
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
            this.contractList = list
            this.hasData = false
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          },
          error: (err) => {
            console.log(err)
            this.loading.hide()
            showToast(this.netWork, 'error')
          }
        })
      },
      onPullingDown() {
        // 更新数据
        this.getContractList()
      },
      toSign(url) {
        this.setSignUrl(url)
        localStorage.setItem('cUrl', url)
        if (this.$i18n.locale === 'zh') {
          parent.window.location.href = parent.path + '/common/m-signContract.html'
        } else if (this.$i18n.locale === 'tw') {
          parent.window.location.href = parent.path + '/common/m-ft-signContract.html'
        } else if (this.$i18n.locale === 'en') {
          parent.window.location.href = parent.path + '/common/m-en-signContract.html'
        }
      },
      toView(url) {
        this.setViewUrl(url)
        localStorage.setItem('cUrl', url)
        if (this.$i18n.locale === 'zh') {
          parent.window.location.href = parent.path + '/common/m-previewContract.html'
        } else if (this.$i18n.locale === 'tw') {
          parent.window.location.href = parent.path + '/common/m-ft-previewContract.html'
        } else if (this.$i18n.locale === 'en') {
          parent.window.location.href = parent.path + '/common/m-en-previewContract.html'
        }
      },
      toDownload() {
        showAlert(this.downloadTip, `${this.tip}`, this.confirm)
      },
      ...mapMutations({
        setViewUrl: 'SET_VIEW_URL',
        setSignUrl: 'SET_SIGN_URL'
      })
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
    padding:0 10px;
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
