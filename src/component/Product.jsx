import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useContext } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';

function Product(props) {
  const { product } = props; 

  const { state, dispatch } = useContext(Store);
  const {  cart: { cartItems }, } = state;

  const addToCartHandler = () => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {  
      toast.warning('Sorry. Product is out of stock');
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/product/${product.slug}`}>
        <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${product.image}`}   style={{ height: '350px', objectFit: 'cover' }} className="w-full h-90 object-cover" alt={product.name} />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-gray-800 font-semibold mb-2">{product.name}</h3>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <p className="text-gray-700 font-semibold mt-2 line-through" >${product.price}</p>
        {product.countInStock === 0 ? (
          <button className="bg-red-500 text-white py-2 px-4 rounded cursor-not-allowed" disabled>
            Out of stock
          </button>
        ) : (
          <button className="bg-gray-800 hover:bg-slate-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out" onClick={addToCartHandler}>
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Product;
