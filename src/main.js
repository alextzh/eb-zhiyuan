import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {
  /* eslint-disable no-unused-vars */
  Style,
  Button,
  Radio,
  Textarea,
  Switch,
  Toast,
  Picker,
  Dialog,
  Scroll,
  createAPI
} from 'cube-ui'
import fastclick from 'fastclick'
import i18n from './language'

import 'common/css/index.css'

Vue.use(Button)
Vue.use(Radio)
Vue.use(Textarea)
Vue.use(Switch)
Vue.use(Toast)
Vue.use(Picker)
Vue.use(Dialog)
Vue.use(Scroll)

fastclick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
