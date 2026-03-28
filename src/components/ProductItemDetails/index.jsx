import {useState, useEffect, use} from 'react'
import {Link, useParams} from 'react-router'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import CartContext from '../../context/CartContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const ProductItemDetails = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })
  const [quantity, setQuantity] = useState(1)
  const {id} = useParams()
  const value = use(CartContext)
  const {addCartItem} = value
  const onClickAddToCart = () => {
    const {data} = apiResponse
    const {productDetails} = data
    addCartItem({...productDetails, quantity})
  }

  const getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  useEffect(() => {
    const getProductData = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = `https://apis.ccbp.in/products/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const formattedProductDetails = getFormattedData(fetchedData)
        const formattedSimilarProductsData = fetchedData.similar_products.map(
          eachSimilarProduct => getFormattedData(eachSimilarProduct),
        )
        setApiResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.success,
          data: {
            productDetails: formattedProductDetails,
            similarProductsData: formattedSimilarProductsData,
          },
        }))
      } else {
        setApiResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.failure,
        }))
      }
    }
    getProductData()
  }, [id])

  const onDecrementQuantity = () => {
    setQuantity(prevQuantity =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity,
    )
  }

  const onIncrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  const renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <BeatLoader color="#7032a5" />
    </div>
  )

  const renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  const renderProductDetailsView = () => {
    const {data} = apiResponse
    const {productDetails, similarProductsData} = data
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {price}/-</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onDecrementQuantity}
                data-testid="minus"
              >
                <BsDashSquare
                  className="quantity-controller-icon"
                  aria-label="minus"
                />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onIncrementQuantity}
                data-testid="plus"
              >
                <BsPlusSquare
                  className="quantity-controller-icon"
                  aria-label="plus"
                />
              </button>
            </div>
            <button
              type="button"
              className="button add-to-cart-btn"
              onClick={onClickAddToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  const renderProductDetails = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.success:
        return renderProductDetailsView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="product-item-details-container">
        {renderProductDetails()}
      </div>
    </>
  )
}

export default ProductItemDetails
