import React from 'react'
import { Route,Routes } from 'react-router-dom'
import MyBuyList from './MyBuyList'
import MyBuyListChart from './MyBuyListChart'
import MyChatList from './MyChatList'
import MyInfo from './MyInfo'
import MyInsertReview from './MyInsertReview'
import MyMenu from './MyMenu'
import MyPay from './MyPay'
import MyReceiveReview from './MyReceiveReview'
import MySellList from './MySellList'
import MySellListChart from './MySellListChart'
import MyUpdatePass from './MyUpdatePass'

const MyPage = () => {
  return (
    <div>
      <Routes>
        <Route path="/my/info/:uid" component={MyInfo}/>
        <Route path="/my/chat" component={MyChatList} exact/>
        <Route path="/my/pay/:pcode" component={MyPay}/>
        <Route path="/my/menu" component={MyMenu}/>
        <Route path="/my/review" component={MyReceiveReview} exact/>
        <Route path="/my/review/insert/:paycode" component={MyInsertReview} />
        <Route path="/my/pass/update" component={MyUpdatePass}/>
        <Route path="/my/sell" component={MySellList}/>
        <Route path="/my/buy" component={MyBuyList}/>
        <Route path="/my/buychart" component={MyBuyListChart}/>
        <Route path="/my/sellchart" component={MySellListChart}/>
        </Routes>
    </div>
  )
}

export default MyPage