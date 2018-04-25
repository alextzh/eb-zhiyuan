import Vue from 'vue'
import Router from 'vue-router'

// 懒加载路由模块导入
const Login = () => import('components/login/login')
const Mine = () => import('components/mine/mine')
const Notice = () => import('components/notice/notice')
const NoticeItem = () => import('components/notice-item/notice-item')
const NoticeDetail = () => import('components/notice-detail/notice-detail')
const Purchase = () => import('components/purchase/purchase')
const ProductDetail = () => import('components/product-detail/product-detail')
const MProductDetail = () => import('components/product-detail/m-product-detail')
const TransferApply = () => import('components/transfer-apply/transfer-apply')
const TransferRecord = () => import('components/transfer-record/transfer-record')
const PurchaseRecord = () => import('components/purchase-record/purchase-record')
const MPurchaseRecord = () => import('components/purchase-record/m-purchase-record')
const ApointRecord = () => import('components/apoint-record/apoint-record')
const MApointRecord = () => import('components/apoint-record/M-apoint-record')
const AddApply = () => import('components/add-apply/add-apply')
const MAddApply = () => import('components/add-apply/m-add-apply')
const EditApply = () => import('components/edit-apply/edit-apply')
const ModifyAdditional = () => import('components/modify-additional/modify-additional')
const RedeemRecord = () => import('components/redeem-record/redeem-record')
const MRedeemRecord = () => import('components/redeem-record/M-redeem-record')
const Redeem = () => import('components/redeem/redeem')
const MRedeem = () => import('components/redeem/m-redeem')
const ProductPlan = () => import('components/product-plan/product-plan')
const MProductPlan = () => import('components/product-plan/m-product-plan')
const ModifyPlan = () => import('components/modify-plan/modify-plan')
const MModifyPlan = () => import('components/modify-plan/m-modify-plan')
const Question = () => import('components/question/question')
const QuestionDetail = () => import('components/question-detail/question-detail')
const Setting = () => import('components/setting/setting')
const ModifyPwd = () => import('components/modify-pwd/modify-pwd')
const Management = () => import('components/management/management')
const MManagement = () => import('components/management/m-management')
const PreviewContract = () => import('components/preview-contract/preview-contract')
const MPreviewContract = () => import('components/preview-contract/m-preview-contract')
const SignContract = () => import('components/sign-contract/sign-contract')
const MSignContract = () => import('components/sign-contract/M-sign-contract')
const Weixin = () => import('components/weixin/weixin')
const NoFound = () => import('components/no-found/no-found')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      meta: {
        requireAuth: true
      },
      component: Mine
    },
    {
      path: '/login/:lang',
      component: Login
    },
    {
      path: '/:lang',
      component: Mine
    },
    {
      path: '/notice/:lang',
      component: Notice
    },
    {
      path: '/notice-item/:id/:lang',
      component: NoticeItem
    },
    {
      path: '/notice-detail/:lang',
      component: NoticeDetail
    },
    {
      path: '/purchase/:lang',
      component: Purchase
    },
    {
      path: '/product-detail/:lang',
      component: ProductDetail
    },
    {
      path: '/m-product-detail/:lang',
      component: MProductDetail
    },
    {
      path: '/transfer-apply/:lang',
      component: TransferApply
    },
    {
      path: '/transfer-record/:lang',
      component: TransferRecord
    },
    {
      path: '/purchase-record/:lang',
      component: PurchaseRecord
    },
    {
      path: '/m-purchase-record/:lang',
      component: MPurchaseRecord
    },
    {
      path: '/apoint-record/:lang',
      component: ApointRecord
    },
    {
      path: '/M-apoint-record/:lang',
      component: MApointRecord
    },
    {
      path: '/add-apply/:lang',
      component: AddApply
    },
    {
      path: '/m-add-apply/:lang',
      component: MAddApply
    },
    {
      path: '/edit-apply/:lang',
      component: EditApply
    },
    {
      path: '/modify-additional/:lang',
      component: ModifyAdditional
    },
    {
      path: '/redeem-record/:lang',
      component: RedeemRecord
    },
    {
      path: '/M-redeem-record/:lang',
      component: MRedeemRecord
    },
    {
      path: '/redeem/:lang',
      component: Redeem
    },
    {
      path: '/m-redeem/:lang',
      component: MRedeem
    },
    {
      path: '/product-plan/:lang',
      component: ProductPlan
    },
    {
      path: '/m-product-plan/:lang',
      component: MProductPlan
    },
    {
      path: '/modify-plan/:lang',
      component: ModifyPlan
    },
    {
      path: '/m-modify-plan/:lang',
      component: MModifyPlan
    },
    {
      path: '/question/:lang',
      component: Question
    },
    {
      path: '/question-detail/:lang',
      name: 'questionDetail',
      component: QuestionDetail
    },
    {
      path: '/setting/:lang',
      component: Setting
    },
    {
      path: '/modify-pwd/:lang',
      component: ModifyPwd
    },
    {
      path: '/management/:lang',
      component: Management
    },
    {
      path: '/m-management/:lang',
      component: MManagement
    },
    {
      path: '/preview-contract/:lang',
      component: PreviewContract
    },
    {
      path: '/m-preview-contract/:lang',
      component: MPreviewContract
    },
    {
      path: '/sign-contract/:lang',
      component: SignContract
    },
    {
      path: '/m-sign-contract/:lang',
      component: MSignContract
    },
    {
      path: '/weixin/:lang',
      component: Weixin
    },
    {
      path: '*',
      component: NoFound
    }
  ]
})

export default router
