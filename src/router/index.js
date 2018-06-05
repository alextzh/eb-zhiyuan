import Vue from 'vue'
import Router from 'vue-router'

// 懒加载路由模块导入
const ProductDetail = () => import('components/product-detail/product-detail')
const MProductDetail = () => import('components/product-detail/m-product-detail')
const PurchaseRecord = () => import('components/purchase-record/purchase-record')
const MPurchaseRecord = () => import('components/purchase-record/m-purchase-record')
const ApointRecord = () => import('components/apoint-record/apoint-record')
const MApointRecord = () => import('components/apoint-record/m-apoint-record')
const AddApply = () => import('components/add-apply/add-apply')
const MAddApply = () => import('components/add-apply/m-add-apply')
const RedeemRecord = () => import('components/redeem-record/redeem-record')
const MRedeemRecord = () => import('components/redeem-record/m-redeem-record')
const Redeem = () => import('components/redeem/redeem')
const MRedeem = () => import('components/redeem/m-redeem')
const ProductPlan = () => import('components/product-plan/product-plan')
const MProductPlan = () => import('components/product-plan/m-product-plan')
const ModifyPlan = () => import('components/modify-plan/modify-plan')
const MModifyPlan = () => import('components/modify-plan/m-modify-plan')
const Management = () => import('components/management/management')
const MManagement = () => import('components/management/m-management')
const ClimbingProject = () => import('components/climbing-project/climbing-project')
const MClimbingProject = () => import('components/climbing-project/m-climbing-project')
const BtnPage = () => import('components/btnPage/btnPage')
const MBtnPage = () => import('components/btnPage/m-btnPage')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/product-detail/:lang',
      component: ProductDetail
    },
    {
      path: '/m-product-detail/:lang',
      component: MProductDetail
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
      path: '/m-apoint-record/:lang',
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
      path: '/redeem-record/:lang',
      component: RedeemRecord
    },
    {
      path: '/m-redeem-record/:lang',
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
      path: '/management/:lang',
      component: Management
    },
    {
      path: '/m-management/:lang',
      component: MManagement
    },
    {
      path: '/climbing-project/:lang',
      component: ClimbingProject
    },
    {
      path: '/m-climbing-project/:lang',
      component: MClimbingProject
    },
    {
      path: '/btnPage/:lang',
      component: BtnPage
    },
    {
      path: '/m-btnPage/:lang',
      component: MBtnPage
    }
  ]
})

export default router
