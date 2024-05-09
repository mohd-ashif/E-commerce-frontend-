import React, { useContext, useReducer, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MeassageBox';
import { Store } from '../Store';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { FaEdit, FaEye, FaTrash, FaBox, FaListAlt, FaExclamationCircle } from 'react-icons/fa'; // Import necessary icons

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: []
  });

  const [totals, setTotals] = useState({
    totalItems: 0,
    totalCategories: 0,
    outOfStock: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}products`, 
          { 
            headers: { Authorization: `Bearer ${userInfo.token}` }
          }
        ); 
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  useEffect(() => {
   
    const totalItems = products.length;
    const totalCategories = new Set(products.map(product => product.category)).size;
    const outOfStock = products.filter(product => product.countInStock === 0).length;
    setTotals({ totalItems, totalCategories, outOfStock });
  }, [products]);

  const productDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      if (!response.data) {
        throw new Error('Failed to delete order');
      } else {
        toast.success('Order deleted successfully');
        window.location.reload();
      }
    } catch (error) {
      toast('Failed to delete order.');
    }
  };

  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Products List</title>
      </Helmet>
      
   

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="overflow-x-auto">
             <h1 className="text-4xl font-bold text-center mt-8 mb-4">Products List</h1>

             <div className="flex flex-wrap justify-around mb-4">
       
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <div className="bg-blue-500 text-white rounded-md p-4 flex items-center">
            <FaBox className="mr-2" />
            <div>
              <p className="text-lg font-semibold">{totals.totalItems}</p>
              <p>Total Items</p>
            </div>
          </div>
        </div>
       
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <div className="bg-green-500 text-white rounded-md p-4 flex items-center">
            <FaListAlt className="mr-2" />
            <div>
              <p className="text-lg font-semibold">{totals.totalCategories}</p>
              <p>Total Categories</p>
            </div>
          </div>
        </div>
        
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <div className="bg-red-500 text-white rounded-md p-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <div>
              <p className="text-lg font-semibold">{totals.outOfStock}</p>
              <p>Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">View</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-300">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.brand}</td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-950 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/admin/edit/${product._id}`}>
                      <button className="bg-amber-500 hover:bg-amber-200 text-white font-bold py-2 px-4 rounded">
                        <FaEdit />
                      </button>
                    </Link> 
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                      onClick={() => productDelete(product._id)}
                    >
                      <FaTrash /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
        </div>
      )}
    </div>
  );
}
