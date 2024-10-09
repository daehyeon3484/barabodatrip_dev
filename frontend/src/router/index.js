import { createRouter, createWebHistory } from 'vue-router'

// import TripMain from '../views/TripMain.vue'
// import TripLogin from '../views/front/login/TripLogin.vue'
import TripJoin from '../views/front/login/TripJoin.vue'
import ProductList from '../views/front/product/ProductList.vue'
import ThemeList from '../views/front/product/ThemeList.vue'
import EnterTainMent from '../views/front/product/EnterTainMent.vue'
import EnterTainMentDetail from '../views/front/product/EnterTainMentDetail.vue'
import ProductDetail from '../views/front/product/ProductDetail.vue'
import MycartList from '../views/front/mycart/MycartList.vue'
import ReservInfo from '../views/front/reservInfo/ReservInfo.vue'
import OrderConfirm from '../views/front/order/OrderConfirm.vue'
import OrderIcbResult from '../views/front/order/OrderIcbResult.vue'
import OrderIcbResultFail from '../views/front/order/OrderIcbResultFail.vue'
import OrderResult from '../views/front/order/OrderResult.vue'
import OrderUnionPayResult from '../views/front/order/OrderUnionPayResult.vue'
import PaymentInfo from '../views/front/order/PaymentInfo.vue'
import KpopInfoDetail from '../views/front/kpopinfo/KpopInfoDetail.vue'
import KpopInfo from '../views/front/kpopinfo/KpopInfo.vue'
import EventDetail from '../views/front/event/EventDetail.vue'
import EventInfo from '../views/front/event/EventInfo.vue'
import EventReserv from '../views/front/event/EventReserv.vue'

import CommunityList from '../views/front/community/CommunityList.vue'
import CommunityDetail from '../views/front/community/CommunityDetail.vue'
import QnaList from '../views/front/qna/QnaList.vue'
// import QnaDetail from '../views/front/qna/QnaDetail.vue'
import QnaCreate from '../views/front/qna/QnaCreate.vue'
import CustomTravel from '../views/front/custom/CustomTravel.vue'


import PolicyInfo from '../views/privacy/PolicyInfo.vue'
import TermsInfo from '../views/privacy/TermsInfo.vue'
import MyInfo from '../views/front/myinfo/MyInfo.vue'
import MyInfoFileList from '../views/front/myinfo/MyInfoFileList.vue'
import LoginPage from '../views/front/login/LoginPage.vue'
import LoginResult from '../views/front/login/LoginResult.vue'
import LoginOutResult from '../views/front/login/LoginOutResult.vue'
// import FaceBookLogin from '../views/front/login/facebook/FaceBookLogin.vue'
// import FaceBookCallBack from '../views/front/login/facebook/FaceBookCallBack.vue'
import JsonParse from '../views/front/JsonParse.vue'
import QrInfo from '../views/front/etc/QrInfo.vue'
import CompanyInfo from '../views/front/info/CompanyInfo.vue'




const routes = [
  {
    path: '/qrInfo',
    name: 'QrInfo',
    component: QrInfo
  },
  {
    path: '/json',
    name: 'JsonParse',
    component: JsonParse
  },
  {
    path: '/',
    name: 'TripMain',
    component : () =>
      import(/* webpackChunkName : ""  */ "../views/TripMain.vue"),
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/loginResult',
    name: 'LoginResult',
    component: LoginResult
  },
  {
    path: '/loginout',
    name: 'LoginOutResult',
    component: LoginOutResult
  },
  // {
  //   path: '/faceBookCallBack',
  //   name: 'FaceBookCallBack',
  //   component: FaceBookCallBack
  // },
  // {
  //   path: '/faceBookLogin',
  //   name: 'FaceBookLogin',
  //   component: FaceBookLogin
  // },
  {
    path: '/join',
    name: 'TripJoin',
    component: TripJoin
  },
  {
    path: '/productList',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/themeList',
    name: 'ThemeList',
    component: ThemeList
  },
  {
    path: '/enterList',
    name: 'EnterTainMent',
    component: EnterTainMent
  },
  {
    path: '/productDetail',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/enterProgram',
    name: 'EnterTainMentDetail',
    component: EnterTainMentDetail
  },
 
  {
    path: '/policyInfo',
    name: 'PolicyInfo',
    component: PolicyInfo
  },
  {
    path: '/termsInfo',
    name: 'TermsInfo',
    component: TermsInfo
  },
  {
    path: '/mycart',
    name: 'MycartList',
    component: MycartList
  },
  {
    path: '/reservInfo',
    name: 'ReservInfo',
    component: ReservInfo
  },
  {
    path: '/order',
    name: 'OrderConfirm',
    component: OrderConfirm
  },
  {
    path: '/orderResult',
    name: 'OrderResult',
    component: OrderResult
  },
  {
    path: '/orderIcbResult',
    name: 'OrderIcbResult',
    component: OrderIcbResult
  },
  {
    path: '/orderIcbResultFail',
    name: 'OrderIcbResultFail',
    component: OrderIcbResultFail
  },
  {
    path: '/orderUnionPayResult',
    name: 'OrderUnionPayResult',
    component: OrderUnionPayResult
  },
  {
    path: '/myInfo',
    name: 'MyInfo',
    component: MyInfo
  },
  {
    path: '/myinfoFileList',
    name: 'MyInfoFileList',
    component: MyInfoFileList
  },
  {
    path: '/paymentInfo',
    name: 'PaymentInfo',
    component: PaymentInfo
  },
  {
    path: '/kpopInfo',
    name: 'KpopInfo',
    component: KpopInfo
  },
  {
    path: '/kpopInfoDetail',
    name: 'KpopInfoDetail',
    component: KpopInfoDetail
  },
  {
    path: '/eventInfo',
    name: 'EventInfo',
    component: EventInfo
  },
  {
    path: '/eventDetail',
    name: 'EventDetail',
    component: EventDetail
  },
  {
    path: '/communityList',
    name: 'CommunityList',
    component: CommunityList
  },
  {
    path: '/communityDetail',
    name: 'CommunityDetail',
    component: CommunityDetail
  },
  {
    path: '/eventReserv',
    name: 'EventReserv',
    component: EventReserv
  },
  {
    path: '/qna',
    name: 'QnaList',
    component: QnaList
  },
  // {
  //   path: '/qnaDetail',
  //   name: 'QnaDetail',
  //   component: QnaDetail
  // },
  {
    path: '/qnaCreate',
    name: 'QnaCreate',
    component: QnaCreate
  },
  {
    path: '/customTravel',
    name: 'CustomTravel',
    component: CustomTravel
  },
  {
    path: '/companyInfo',
    name: 'CompanyInfo',
    component: CompanyInfo
  },
  
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

