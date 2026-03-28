import {use} from 'react'

import CartContext from '../../context/CartContext'
import CartItem from '../CartItem'

import './index.css'

const CartListView = () => {
  const value = use(CartContext)
  const {cartList} = value
  const totalAmount = cartList.reduce(
    (acc, eachItem) => acc + eachItem.price * eachItem.quantity,
    0,
  )
  return (
    <>
      <ul className="cart-list">
        {cartList.map(eachCartItem => (
          <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
        ))}
      </ul>
      <div className="checkout-container">
        <p className="order-total">
          Order Total: <span className="total-amount"> Rs {totalAmount}/-</span>
        </p>
        <p className="items-in-cart">{cartList.length} Items in cart</p>
        <button className="checkout-btn" type="button">
          Checkout
        </button>
      </div>
    </>
  )
}

export default CartListView
