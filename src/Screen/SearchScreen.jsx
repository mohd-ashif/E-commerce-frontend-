import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../component/Rating';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MeassageBox';
import Button from 'react-bootstrap/Button';
import Product from '../component/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products || [],
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};


const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // search?category=Shirts 
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}products/categories`);
        if (data.categories) {
          setCategories(data.categories);
        } else {
          console.error('Categories data is not an array:', data.categories);
        }
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${skipPathname ? '' : '/search?'
      }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <button
            onClick={() => window.history.back()}
            className="bg-slate-800 hover:bg-slate-600 text-white py-2 px-4 rounded-md mb-4">
            Back
          </button>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <input
                  type="checkbox"
                  id="anyPriceCheckbox"
                  checked={'all' === price}
                  onChange={() => navigate(getFilterUrl({ price: 'all' }))}
                />
                <label htmlFor="anyPriceCheckbox" className={'all' === price ? 'text-bold' : ''}>
                  Any
                </label>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <input
                    type="checkbox"
                    id={`priceCheckbox_${p.value}`}
                    checked={p.value === price}
                    onChange={() => navigate(getFilterUrl({ price: p.value }))}
                  />
                  <label htmlFor={`priceCheckbox_${p.value}`} className={p.value === price ? 'text-bold' : ''}>
                    {p.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Rating </h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <input
                    type="checkbox"
                    id={`ratingCheckbox_${r.rating}`}
                    checked={`${r.rating}` === `${rating}`}
                    onChange={() => navigate(getFilterUrl({ rating: r.rating }))} />

                  <label htmlFor={`ratingCheckbox_${r.rating}`} className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}>
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </label>
                </li>
              ))}
              <li>
                <input
                  type="checkbox"
                  id="allRatingsCheckbox"
                  checked={rating === 'all'}
                  onChange={() => navigate(getFilterUrl({ rating: 'all' }))}
                />
                <label htmlFor="allRatingsCheckbox" className={rating === 'all' ? 'text-bold' : ''}>
                  <Rating caption={' & up'} rating={0}></Rating>
                </label>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}

                    {query !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')} >

                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option className="text-gray-900" value="newest">Newest Arrivals</option>
                    <option className="text-gray-900" value="lowest">Price: Low to High</option>
                    <option className="text-gray-900" value="highest">Price: High to Low</option>
                    <option className="text-gray-900" value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>

              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>

              <div className='pb-3'>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: '/search',
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

