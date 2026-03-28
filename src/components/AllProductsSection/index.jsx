import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'

import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import './index.css'
import FiltersGroup from '../FiltersGroup'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://s3.ap-south-1.amazonaws.com/new-assets.ccbp.in/frontend/loading-data/niat_react_js/niat_coding_questions/rating-4.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://s3.ap-south-1.amazonaws.com/new-assets.ccbp.in/frontend/loading-data/niat_react_js/niat_coding_questions/rating-3.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://s3.ap-south-1.amazonaws.com/new-assets.ccbp.in/frontend/loading-data/niat_react_js/niat_coding_questions/rating-2.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://s3.ap-south-1.amazonaws.com/new-assets.ccbp.in/frontend/loading-data/niat_react_js/niat_coding_questions/rating-1.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AllProductsSection = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })
  const [activeOptionId, setActiveOptionId] = useState(
    sortbyOptions[0].optionId,
  )
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeRatingId, setActiveRatingId] = useState('')

  useEffect(() => {
    const getProducts = async () => {
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })
      const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
      const jwtToken = Cookies.get('jwt_token')
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok === true) {
        const fetchedData = await response.json()
        const formattedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        setApiResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.success,
          data: formattedData,
        }))
      } else {
        setApiResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.failure,
        }))
      }
    }
    getProducts()
  }, [activeOptionId, activeCategoryId, searchInput, activeRatingId])

  const renderProductsListView = () => {
    const {data} = apiResponse
    const shouldShowProductsList = data.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={changeSortby}
        />
        <ul className="products-list">
          {data.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <BeatLoader color="#7032a5" />
    </div>
  )

  const renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )
  const renderAllProducts = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.success:
        return renderProductsListView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }
  const clearFilters = () => {
    setSearchInput('')
    setActiveCategoryId('')
    setActiveRatingId('')
  }

  const changeSortby = optionId => {
    setActiveOptionId(optionId)
  }

  const changeRating = ratingId => {
    setActiveRatingId(ratingId)
  }

  const changeCategory = categoryId => {
    setActiveCategoryId(categoryId)
  }

  const changeSearchInput = input => {
    setSearchInput(input)
  }
  const enterSearchInput = input => {
    setSearchInput(input)
  }

  return (
    <div className="all-products-section">
      <FiltersGroup
        searchInput={searchInput}
        categoryOptions={categoryOptions}
        ratingsList={ratingsList}
        changeSearchInput={changeSearchInput}
        enterSearchInput={enterSearchInput}
        activeCategoryId={activeCategoryId}
        activeRatingId={activeRatingId}
        changeCategory={changeCategory}
        changeRating={changeRating}
        clearFilters={clearFilters}
      />
      {renderAllProducts()}
    </div>
  )
}

export default AllProductsSection
