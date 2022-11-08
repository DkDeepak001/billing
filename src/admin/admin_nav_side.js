import React, { Component } from 'react';
import './Admin.css';
import {
    IoAnalyticsSharp as Analyticsicon,
    MdOutlineProductionQuantityLimits as Addicon,
    FaRegCopy as Bill,
    BiPrinter as Billingicon,
    AiOutlineUsergroupAdd as CompanyRegIcon,
    RiMenu3Line as Hamburger,
    BsXLg as Cancel,
    CgLogOut as Logout,
    MdPendingActions as Pending,
    IoIosAddCircleOutline as NewStock,

} from 'react-icons/all'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import New_customer from './components/adminCustomer/newCustomer'
import BillingName from './components/wholesaleBilling/billingName'
import Analytics from './components/analytics/analytics';
import New_product from './components/newproduct/new_product';
import Insertproducts from './components/newproduct/insertproducts';
import Edit_price from './components/newproduct/edit_price';
import ViewBillCopy from './components/billCopy/viewBill';
import adminBilling from './components/wholesaleBilling/adminBilling';
import newUser from './components/newUser/newUser';
import viewUsers from './components/newUser/viewUsers';
import Login from './adminLogin';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2';
import AdminBillCopy from './components/adminBillCopy/adminBillCopy';
import ViewAdminBillCopy from './components/adminBillCopy/viewAdminBill';
import AnalyticsRevenue from './components/analytics/revenu';
import AnalyticsProduct from './components/analytics/companySales';
import branchWiseRevenue from './components/analytics/branchWiseRevenue';
import CompanyWiseSales from './components/analytics/CompanyWiseSales';
import allProduct from './components/newproduct/allProduct';
import pageNotFound from '../404';
import viewCustomer from './components/adminCustomer/viewCustomer';
import editCustomer from './components/adminCustomer/editCustomer';
import editAdminBIll from './components/wholesaleBilling/editAdminBIll';
import adminEditBillNo from './components/wholesaleBilling/adminEditBillNo';
import updateStock from './components/updateStock/updateStock';
import Addstock from './components/updateStock/addstock';
import creditColoum from './components/credit/creditColoum';
import EditCredit from './components/credit/EditCredit';





export default class admin_home extends Component {

    constructor() {
        super();
        this.state = {
            hamburger: true,
            userName: localStorage.getItem('adminName'),
        }
    }
    Logout() {
        Swal.fire({
            title: 'Are you Want to Logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Logout!',
                    icon: 'success'
                })
                localStorage.removeItem('admin');
                localStorage.removeItem('adminName');
                localStorage.removeItem('branchId');
                window.location.reload(false);
            }
        })
    }
    hamburgerMenu = () => {
        this.setState({ hamburger: !this.state.hamburger });
    }

    render() {
        console.log(this.state.userName)
        console.log(window.location.pathname)
        return (
            < Router >
                {localStorage.getItem('admin') ?
                    <div className="admin_home">
                        <div className="admin_container">
                            {this.state.hamburger ? <div className="admin_sidewrap" id="admin_sidewrap">
                                <div className="admin_sideTop">
                                    <div className="nav_logo">
                                        <div className='mav_logo_name'>
                                            <h4> Billing </h4>
                                        </div>
                                    </div>
                                    <div className="Hamburger" >
                                        <IconButton onClick={this.hamburgerMenu} style={{ color: "white" }}>
                                            {this.state.hamburger ? <Hamburger size={28} /> : <Cancel />}
                                        </IconButton>
                                    </div>
                                </div>
                                <div className="admin_sidewrap_main">
                                    <ul>
                                        <Link to="/Admin">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Analyticsicon size={25} />
                                                    <p>Analytics</p>
                                                </div>
                                            </li>
                                        </Link>
                                        <Link to="/Admin/new_products">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Addicon size={25} />
                                                    <p>Product</p>
                                                </div>
                                            </li>
                                        </Link>
                                        <Link to="/Admin/billingName">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Billingicon size={25} />
                                                    <p> Billing</p>
                                                </div>
                                            </li>
                                        </Link>
                                   
                                        <Link to="/Admin/company_register">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <CompanyRegIcon size={25} />
                                                    <p>Resgister Customer</p>
                                                </div>
                                            </li>
                                        </Link>
                                        <Link to="/Admin/AdminBillCopy">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Bill size={25} />
                                                    <p>Bill Copy</p>
                                                </div>
                                            </li>
                                        </Link>
                                        
                                        <Link to="/Admin/creditColoum">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Pending size={25} />
                                                    <p>Credit</p>
                                                </div>
                                            </li>
                                        </Link>
                                    </ul>
                                </div>
                                <div className='admin_side_footer'>
                                    <IconButton onClick={this.Logout} size='small' style={{ color: "white", height: 30 }}><Logout /> <h4>Logout</h4>
                                    </IconButton>
                                </div>
                            </div> :
                                <div className='side_Nav' id="side_Nav">
                                    <div className='side_nav_top'>
                                        <div className="Hamburger">
                                            <IconButton color="primary" style={{ color: "white" }} aria-label="upload picture" component="span" onClick={this.hamburgerMenu}>
                                                {this.state.hamburger ? <Hamburger size={28} /> : <Cancel />}
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div className="admin_nav_main">
                                        <ul>
                                            <Link to="/Admin">
                                                <li>
                                                    <div className="nav_group">
                                                        <Analyticsicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            <Link to="/Admin/new_products">
                                                <li>
                                                    <div className="nav_group">
                                                        <Addicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            <Link to="/Admin/billingName">
                                                <li>
                                                    <div className="nav_group">
                                                        <Billingicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                          
                                            <Link to="/Admin/company_register">
                                                <li>
                                                    <div className="nav_group">
                                                        <CompanyRegIcon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            <Link to="/Admin/AdminBillCopy">
                                                <li>
                                                    <div className="sidewrap_group">
                                                        <Bill size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                           
                                            <Link to="/Admin/updateStock">
                                                <li>
                                                    <div className="sidewrap_group">
                                                        <NewStock size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            <Link to="/Admin/creditColoum">
                                                <li>
                                                    <div className="sidewrap_group">
                                                        <Pending size={25} />
                                                    </div>
                                                </li>
                                            </Link>

                                        </ul>
                                    </div>
                                    <div className='admin_nav_footer'>
                                        <IconButton onClick={this.Logout} size='small' style={{ color: "white", background: 'black', height: 30 }}><Logout /></IconButton>
                                    </div>
                                </div>
                            }

                            <div className="admin_mainwrap">
                                <Switch>
                                    <Route exact path="/Admin" component={Analytics}>
                                    </Route>
                                    <Route exact path="/Admin/analytics/revenue" component={AnalyticsRevenue}>
                                    </Route>
            
                                    <Route exact path="/Admin/analytics/companySales" component={AnalyticsProduct}>
                                    </Route>
                                    <Route exact path="/Admin/analytics/companySales/:company_name" component={CompanyWiseSales}>
                                    </Route>
                                    <Route exact path="/Admin/analytics/reveue/:branchId" component={branchWiseRevenue}>
                                    </Route>
                                    <Route exact path="/Admin/update_price/edit/:id" component={Edit_price}>
                                    </Route>
                                    <Route exact path="/Admin/new_products" component={New_product}>
                                    </Route>
                                    <Route exact path="/Admin/allProduct/:pid" component={allProduct}>
                                    </Route>
                                    <Route exact path="/Admin/new_products/addnew" component={Insertproducts}>
                                    </Route>
                                    <Route exact path="/Admin/billCopy/viewBill/:billNo" component={ViewBillCopy}>
                                    </Route>
                                    <Route exact path="/Admin/billingName/billing/:cmpName" component={adminBilling}>
                                    </Route>
                                    <Route exact path="/Admin/billingName" component={BillingName}>
                                    </Route>
                                    <Route exact path="/Admin/adminEditBillNo/:id" component={editAdminBIll}>
                                    </Route>
                                    <Route exact path="/Admin/adminEditBillNo" component={adminEditBillNo}>
                                    </Route>
                                    {/* <Route exact path="/Admin/stockUpdate" component={stockUpdate}>
                                    </Route>
                                    <Route exact path="/Admin/stockUpdate/:branchId" component={stockBranchWise}>
                                    </Route>
                                    <Route exact path="/Admin/stockUpdate/:branchId/:pid" component={productAnalytics}>
                                    </Route> */}
                                    <Route exact path="/Admin/newUser" component={newUser}>
                                    </Route>
                                    <Route exact path="/Admin/newUser/viewUsers" component={viewUsers}>
                                    </Route>
                                    <Route exact path="/Admin/company_register" component={New_customer}>
                                    </Route>
                                    <Route exact path="/Admin/viewCustomer" component={viewCustomer}>
                                    </Route>
                                    <Route exact path="/Admin/editCustomer/:id" component={editCustomer}>
                                    </Route>
                                    <Route exact path="/Admin/AdminBillCopy" component={AdminBillCopy}>
                                    </Route>
                                    <Route exact path="/Admin/AdminBillCopy/viewBill/:id" component={ViewAdminBillCopy}>
                                    </Route>
                                    <Route exact path="/Admin/creditColoum" component={creditColoum}>
                                    </Route>
                                    <Route exact path="/Admin/creditColoum/:billNo" component={EditCredit}>
                                    </Route>
                                    <Route component={pageNotFound} />

                                </Switch>
                            </div>
                        </div>
                    </div > : <Login />
                }

            </Router >
        )
    }
}
