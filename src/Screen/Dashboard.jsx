import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>
            <p className="text-gray-600 mb-4">Add a new product to the store.</p>
            <Link to="/admin/create" className="btn btn-dark">Add Product</Link>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">List Products</h2>
            <p className="text-gray-600 mb-4">View and manage existing products.</p>
            <Link to="/admin/products" className="btn btn-dark">List Products</Link>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            <p className="text-gray-600 mb-4">View and manage orders.</p>
            <Link to="/admin/orders" className="btn btn-dark">View Orders</Link>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Sales Report</h2>
            <p className="text-gray-600 mb-4">View sales report.</p>
            <Link to="/admin/sales" className="btn btn-dark">Sales Report</Link>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <p className="text-gray-600 mb-4">View and manage users.</p>
            <Link to="/admin/users" className="btn btn-dark">Users</Link>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;

