import React, { useContext, useReducer, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MeassageBox';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import { Pie } from 'react-chartjs-2'; 
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';



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

const SalesReport = () => { 
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: []
  });

  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}orders/mine`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  useEffect(() => {
    let receivedCount = 0;
    let pendingCount = 0;
    orders.forEach(order => {
      order.isPaid ? receivedCount++ : pendingCount++;
    });
    setTotalReceived(receivedCount);
    setTotalPending(pendingCount);
  }, [orders]);

  const totalReceivedAmount = orders.filter(order => order.isPaid)
                                    .reduce((total, order) => total + order.totalPrice, 0);

  const totalPendingAmount = orders.filter(order => !order.isPaid)
                                   .reduce((total, order) => total + order.totalPrice, 0);

  const totalOrdersAmount = orders.reduce((total, order) => total + order.totalPrice, 0);

  const chartD = {
    labels: ['Total Received', 'Total Pending', 'Total Orders'],
    datasets: [
      {
        data: [totalReceived, totalPending, orders.length],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A3EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  const chartData = {
    labels: ['Total Received Money', 'Total Pending Money ', 'Total order Price'],
    datasets: [
      {
        data: [totalReceivedAmount, totalPendingAmount, totalOrdersAmount],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <div className="mt-8">
              <h2 className="text-center">Orders:</h2> 
              <div className="w-96 mx-auto">
                <Bar data={chartD} />
              </div>
              <hr />

              <h2 className="text-center">Amount :</h2> 
              <div className="w-96 mx-auto">
                <Pie data={chartData} /> 
              </div> 
              <hr /> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
