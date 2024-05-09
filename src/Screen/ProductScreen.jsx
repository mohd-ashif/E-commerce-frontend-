import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Rating from '../component/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MeassageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { Col } from 'react-bootstrap';
import ImageMagnifier from '../component/ImageMagnifire';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };

    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1; 

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    } 
    try {
      const { data } = await axios.post(
        `http://localhost:5000/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      
      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });

    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const offerPercentage = ((product.price - product.offerPrice) / product.price) * 100 ;
  const offer = offerPercentage.toFixed(0)

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
     
    <div className="container mx-auto px-4">
          <div className="container mx-auto px-4">
          <button
  onClick={() => window.history.back()}
  className="bg-slate-800 hover:bg-slate-600 text-white py-2 px-4 rounded-md mb-4"
>
  Back
</button>

    </div> 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
        <ImageMagnifier src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${product.image}`} alt={product.name} height={'auto'} width={'100%'} />
          
        </div>
        <div className="md:col-span-1">
          <div className="mb-4">
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>
          <div className="mb-4">
            <Rating rating={product.rating} numReviews={product.numReviews} />
          </div>
          <hr />
          <div className="mb-4">
  <div className="flex justify-between">
    <div className="flex justify-center"> 
      <span className="mr-2"> Special Price:</span> 
      <span className='text-xl '>${product.offerPrice}</span> <span className="line-through ml-5 pt-1 text-slate-500">${product.price}  </span> <span className='ml-5 pt-1 text-orange-500'> {offerPercentage.toFixed(0)}% off</span> 
    </div>
    <div className="flex items-center "> 
     
    
    </div>
  </div>
</div>

          <hr />
          <div className="mb-4">
            <div className="mb-4"> Brand :   {product.brand}</div>
            <hr />

            <div className="mb-4"> Category :  {product.category}</div>
          </div>
          <hr />
          <div className="mb-4">Description: <p>{product.description}</p></div>
        </div>
        <div>
          <div className="mb-4">
            <div className="flex justify-between">
              <div>Special Price:</div>
              <div>${product.offerPrice}</div>
            </div>
            <hr />
            <div className="flex justify-between">
              <div>Offer :</div>
              <div>{offer}% </div>
            </div>
               
          </div>
          <hr />
          <div className="mb-4">
            <div className="flex justify-between">
              <div>Status:</div>
              <div>{product.countInStock > 0 ? <span className="bg-green-500 text-white px-2 py-1 rounded">In Stock</span> : <span className="bg-red-500 text-white px-2 py-1 rounded">Unavailable</span>}</div>
            </div>
          </div>
          {product.countInStock > 0 ? (
            <div className="mb-4">
              <button onClick={addToCartHandler} className="w-full bg-slate-800 hover:bg-slate-600 text-white rounded-md py-2">
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <button className="w-full bg-red-400 400 text-white rounded-md py-2 cursor-not-allowed" disabled>
                Out of Stock
              </button>
            </div>
          )}

        </div>
      </div>
      <div className="my-4">
        <h2 ref={reviewsRef}>Reviews</h2>
        {product.reviews && product.reviews.length === 0 ? (
          <MessageBox>There is no review</MessageBox>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.reviews && product.reviews.map((review) => (
              <li key={review._id} className="border border-gray-200 p-4 rounded-md">
                <div className="font-bold mb-2">{review.name}</div>
                <hr />
                <Rating rating={review.rating} caption=" " />
                <p className="text-gray-500">{review.createdAt.substring(0, 10)}</p>
                <hr />
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )} 
        <div className="my-4">
          {userInfo ? (
            <form onSubmit={submitHandler} className="space-y-4">
              <h2>Write a customer review</h2>
              <div>
                <label htmlFor="rating" className="block">Rating</label>

                <select
                  id="rating"
                  className="block w-full border border-gray-300 rounded-md p-2"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excellent</option>
                </select>
              </div>
              <div>
                <label htmlFor="comment" className="block">Comments</label>
                <textarea
                  id="comment"
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

              </div>
              <div>
                <button disabled={loadingCreateReview} type="submit" className="bg-slate-800 hover:bg-slate-600 text-white py-2 px-4 rounded-md">
                  Submit
                </button>
                {loadingCreateReview && <LoadingBox />}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;