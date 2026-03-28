import Header from '../Header'
import CartListView from '../CartListView'
import {useContext} from 'react'
import CartContext from '../../context/CartContext'
import EmptyCartView from '../EmptyCartView'

import './index.css'

const Cart = () => {
  const data = useContext(CartContext)
  const {cartList, removeAllCartItems} = data
  const showEmptyCartView = cartList.length === 0
  const onClickingRemoveAllBtn = () => {
    removeAllCartItems()
  }

  const renderCartListView = () => {
    return (
      <>
        <div className="my-cart-remove-all-container">
          <h1 className="cart-heading">My Cart</h1>
          <button
            type="button"
            className="remove-all-btn"
            onClick={onClickingRemoveAllBtn}
          >
            Remove all
          </button>
        </div>
        <CartListView />
      </>
    )
  }
  return (
    <>
      <Header />
      <div className="cart-container">
        <div className="cart-content-container">
          {showEmptyCartView ? <EmptyCartView /> : renderCartListView()}
        </div>
      </div>
    </>
  )
}

export default Cart
