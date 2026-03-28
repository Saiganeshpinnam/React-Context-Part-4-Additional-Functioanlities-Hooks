import Header from '../Header'
import CartListView from '../CartListView'
import {useContext} from 'react'
import CartContext from '../../context/CartContext'
import EmptyCartView from '../EmptyCartView'

import './index.css'

const Cart = () => {
  const data = useContext(CartContext)
  const {cartList} = data
  const showEmptyCartView = cartList.length === 0
  return (
    <>
      <Header />
      <div className="cart-container">
        <div className="cart-content-container">
          <h1 className="cart-heading">My Cart</h1>
          {showEmptyCartView ? <EmptyCartView /> : <CartListView />}
        </div>
      </div>
    </>
  )
}

export default Cart
