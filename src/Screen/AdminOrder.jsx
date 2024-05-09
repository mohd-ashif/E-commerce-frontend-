import React, { useContext, useReducer, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MeassageBox';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { BiCheck, BiX } from 'react-icons/bi';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Admin() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: []
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}orders/mine`,
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



  const acceptOrder = async (orderId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}orders/${orderId}/accept`,  { withCredentials: true }, null, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.status === 200) {
        toast('Order accepted successfully.');
        fetchData();
      }
    } catch (error) {
      toast('Failed to accept order.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}orders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (!response.data) {
        throw new Error('Failed to delete order');
      } else {
        toast('Order deleted successfully');
        fetchData();
      }
    } catch (error) {
      toast('Failed to delete order.');
    }
  };


  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center mt-8 mb-4">Order History</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
         
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">DATE</th>
                  <th className="px-4 py-2">TOTAL</th>
                  <th className="px-4 py-2">PAID</th>
                  <th className="px-4 py-2">DELIVERED</th>
                  <th className="px-4 py-2">ACTIONS</th>
                  <th className="px-4 py-2">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-300">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.createdAt.substring(0, 10)}</td>
                    <td className="px-4 py-2">{order.totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">{order.isPaid ? <BiCheck className="text-green-500" /> : <BiX className="text-red-500" />}</td>
                    <td className="px-4 py-2">{order.isDelivered ? <BiCheck className="text-green-500" /> : <BiX className="text-red-500" />}</td>
                    <td className="px-4 py-2">
                      {order.isPaid ? (
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => acceptOrder(order._id)}
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer"
                          disabled
                        >
                          Pending
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-1">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
           
          </div>
        </div>
      )}
    </div>
  );
}
