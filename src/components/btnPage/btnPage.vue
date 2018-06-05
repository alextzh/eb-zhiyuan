<template>
  <transition name="fade">
    <div class="box">
      <div style="margin-top: 40px;margin-left: 74px;">
        <cube-button @click="submitForm" :disabled="btnDisabled">{{purchaseBtnTxt}}</cube-button>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getMd5, getBJDate} from 'common/js/tool'
  import $ from 'jquery'
  import * as API from 'common/js/http'

  export default {
    data() {
      return {
        btnDisabled: false
      }
    },
    computed: {
      purchaseBtnTxt() {
        return this.$i18n.t('purchase.purchaseBtnTxt')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
      },
      cancel() {
        return this.$i18n.t('common.cancel')
      },
      pdText() {
        return this.$i18n.t('climb.text')
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
    },
    mounted() {
    },
    methods: {
      submitForm() {
        const flag = parent.bookLoanSub()
        this.formData = this.serializeObject(parent.$('#recharge_form'))
        this.formData.user_id = parent.siteUserId
        this.formData.loanName = parent.$('#loanName').find('option:selected').text()
        if (flag) {
          this.btnDisabled = true
          const time_stamp = getBJDate()
          const secret_key = getMd5(time_stamp)
          $.ajax({
            type: 'POST',
            url: API.zyapi + '/api/v1/captcha/getByLoanNo',
            data: {
              loan_no: this.formData.loan_no
            },
            dataType: 'json',
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'secret_key': secret_key,
              'time_stamp': time_stamp
            },
            success: (res) => {
              if (!res.ret) {
                parent.AlertDialog.tip(res.msg)
                this.btnDisabled = false
                return false
              }
              parent.$('#vBox').show()
              const code = res.obj
              var that = this
              parent.$('#code').text(`${code}`)
              parent.$('.vConfirm').one('click', function() {
                const name = parent.$('#vCode').val()
                if (name !== null && name !== '') {
                  parent.$('#vBox').hide()
                  parent.$('.vConfirm').unbind('click')
                  if (name !== code) {
                    parent.AlertDialog.tip(that.pdText)
                    parent.$('#vCode').val('')
                    that.btnDisabled = false
                    return false
                  }
                  parent.$('#loadingBox').show()
                  that.submit(name)
                }
              })
              parent.$('.vCancel').one('click', function() {
                parent.$('.vConfirm').unbind('click')
                parent.$('#vBox').hide()
                parent.$('#vCode').val('')
                that.btnDisabled = false
              })
              parent.$('.vClose').one('click', function() {
                parent.$('.vConfirm').unbind('click')
                parent.$('#vBox').hide()
                parent.$('#vCode').val('')
                that.btnDisabled = false
              })
            },
            error: (err) => {
              console.log(err)
              parent.AlertDialog.tip(err.statusText)
              this.btnDisabled = false
            }
          })
        }
      },
      submit(name) {
        const time_stamp = getBJDate()
        const secret_key = getMd5(time_stamp)
        this.formData.code = name
        $.ajax({
          type: 'POST',
          url: API.zyapi + '/api/v1/booked/panyan',
          data: this.formData,
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': secret_key,
            'time_stamp': time_stamp
          },
          success: (res) => {
            parent.$('#loadingBox').hide()
            this.btnDisabled = false
            if (!res.ret) {
              parent.AlertDialog.tip(res.msg)
              parent.$('#vCode').val('')
              return false
            }
            parent.AlertDialog.tip(res.msg)
            setTimeout(() => {
              if (this.$i18n.locale === 'zh') {
                parent.window.location.href = parent.path + '/common/bookLoanList.html?code=bookLoanList&no=2'
              } else if (this.$i18n.locale === 'tw') {
                parent.window.location.href = parent.path + '/common/ft_bookLoanList.html?code=bookLoanList&no=2'
              } else if (this.$i18n.locale === 'en') {
                parent.window.location.href = parent.path + '/common/en_bookLoanList.html?code=bookLoanList&no=2'
              }
            }, 500)
          },
          error: (err) => {
            parent.$('#loadingBox').hide()
            this.btnDisabled = false
            parent.AlertDialog.tip(err.statusText)
            parent.$('#vCode').val('')
          }
        })
      },
      serializeObject(form) {
        var o = {}
        var a = form.serializeArray()
        $.each(a, function() {
          if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
              o[this.name] = [o[this.name]]
            }
            o[this.name].push(this.value || '')
          } else {
            o[this.name] = this.value || ''
          }
        })
        return o
      }
    }
  }
</script>

<style lang="scss">
.box{
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.cube-btn{
  background: #ffac2a!important;
  padding: 13px 43px!important;
  font-size: 18px!important;
  border-radius: 5px!important;
}
.cube-btn:active{
  background: rgba(255, 172, 42, 0.7)!important;
}
.cube-btn.cube-btn_disabled, .cube-btn.cube-btn_disabled.cube-btn_active, .cube-btn.cube-btn_disabled:active{
  background: #ccc!important;
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
