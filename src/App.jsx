import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Store } from './Store';
import NavDropdown from 'react-bootstrap/NavDropdown';
import HomeScreen from './Screen/HomeScreen';
import ProductScreen from './Screen/ProductScreen';
import CartScreen from './Screen/CartScreen';
import SigninScreen from "./Screen/SigninScreen";
import SignupScreen from "./Screen/SignupScreen";
import PlaceOrderScreen from "./Screen/PlaceOrderScreen";
import OrderScreen from './Screen/OrderSreen';
import OrderHistoryScreen from './Screen/OrderHistoryScreen';
import ShippingScreen from "./Screen/ShippingScreen";
import PaymentMethodScreen from './Screen/PaymentMethodScreen';
import ProfileScreen from './Screen/ProfileScreen';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './component/SearchBox';
import SearchScreen from './Screen/SearchScreen';
import AdminRoute from './component/AdminRoute';
import Dashboard from './Screen/Dashboard';
import ProtectedRoute from './component/ProtectRoute';
import ProductListScreen from './Screen/ProductListScreen';
import AddProducts from './Screen/AddProducts';
import Users from './Screen/Users';
import AdminOrder from './Screen/AdminOrder';
import EditScreen from './Screen/EditScreen';
import SalesReport from './Screen/SalesReport';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <BrowserRouter>
        <div
          className={
            sidebarIsOpen
              ? 'd-flex flex-column site-container active-cont'
              : 'd-flex flex-column site-container'
          }
        >
          <ToastContainer position='bottom-center' limit={1} />
          <header>
            <Navbar bg='dark' variant='dark' expand='lg'>
              <Container>

                <Button
                  variant="dark"
                  onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                >
                  <i className="fas fa-bars"></i>
                </Button>

                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>

                  <Nav className='me-auto w-100 justify-content-end'>
                    <LinkContainer to='/'>
                      <Navbar.Brand> Gentify  </Navbar.Brand>
                    </LinkContainer>

                    <Nav className='me-auto w-100 justify-content-end'>
                      <SearchBox />
                      <Link to='/cart' className='nav-link'>
                        <FontAwesomeIcon icon={faShoppingCart} className='text-white text-2xl' />
                        {cart.cartItems.length > 0 && (
                          <Badge pill bg='danger' className=''>
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )}
                      </Link>

                      {userInfo ? (
                        <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                          <LinkContainer to='/profile'>
                            <NavDropdown.Item>User Profile</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to='/orderhistory'>
                            <NavDropdown.Item>Order History</NavDropdown.Item>
                          </LinkContainer>

                          <NavDropdown.Divider />
                          <Link
                            className='dropdown-item'
                            to='#signout'
                            onClick={signoutHandler}
                          >
                            Sign Out
                          </Link>

                        </NavDropdown>
                      ) : (
                        <Link className='nav-link' to='/signin'>
                          Sign In
                        </Link>
                      )}
                      {userInfo && userInfo.isAdmin && (
                        <LinkContainer to='/admin/dashboard'>
                        <Nav.Link>Dashboard</Nav.Link>
                      </LinkContainer>
                      )}
                    </Nav>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </header>

          <div
            className={
              sidebarIsOpen
                ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
            }
          >
            <Nav className="flex-column text-white w-100 p-3">
              <Nav.Item>
                <strong>Categories</strong>
              </Nav.Item>
              {categories.map((category) => (
                <Nav.Item key={category}>
                  <LinkContainer className='text-slate-100'
                    to={{ pathname: '/search', search: `category=${category}` }}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link className="custom-link">{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
            </Nav>

          </div>

          <main>
            <Container className='mt-3  '>

              <Routes>
                <Route path="/product/:slug" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/search" element={<SearchScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/signup" element={<SignupScreen />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><Dashboard />
                </AdminRoute >}></Route>
                <Route path="/admin/sales" element={<AdminRoute><SalesReport /> </AdminRoute>} ></Route>
                <Route path="/admin/products" element={<AdminRoute><ProductListScreen /> </AdminRoute>} ></Route>
                <Route path="/admin/create" element={<AdminRoute><AddProducts /> </AdminRoute>} ></Route>
                <Route path="/admin/edit/:id" element={<AdminRoute><EditScreen /> </AdminRoute>} ></Route>
                <Route path="/admin/users" element={<AdminRoute><Users /> </AdminRoute>} ></Route>
                <Route path="/admin/orders" element={<AdminRoute><AdminOrder /> </AdminRoute>} ></Route>

                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/profile" element={<ProtectedRoute> <ProfileScreen /> </ProtectedRoute>} />
                <Route
                  path="/order/:id"
                  element={<ProtectedRoute><OrderScreen /> </ProtectedRoute>}></Route>
                <Route path="/orderhistory" element={<ProtectedRoute> <OrderHistoryScreen /> </ProtectedRoute>} />
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/payment" element={<PaymentMethodScreen />} />
                <Route path="/" element={<HomeScreen />} />
              </Routes>
            </Container>
          </main>
          <footer style={{ background: "#212529" }}>
            <div className="container mx-auto  items-center">
              <p className="mt-2">© 2024 All rights reserved</p>
            </div>
          </footer>
        </div >
      </BrowserRouter>
    </>
  );
}

export default App;
