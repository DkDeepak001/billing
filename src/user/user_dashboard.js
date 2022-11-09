import React, { Component } from 'react';
import {
    IoIosSettings as Setting,
    IoIosNotifications as Notification,
    BiPrinter as Billingicon,
    IoAnalyticsSharp as Analyticsicon,
    MdOutlineUpgrade as Deliveryicon,
    FiEdit as Editicon,
    MdProductionQuantityLimits as Addicon,
    AiOutlineDelete as WasteIcon,
    FiUsers as NewUserIcon,
    RiMenu3Line as Hamburger,
    BsXLg as Cancel,
    CgLogOut as Logout,
} from 'react-icons/all'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import './user.css';
import IconButton from '@mui/material/IconButton';
import Billing from './components/billing/billing';
import BillingName from './components/billing/billingName';
import Analytics from './components/analytics/analytics';
import Update_product from './components/updateproduct/updateproduct';
import reciveProduct from './components/updateproduct/reciveProduct';
import New_order from './components/neworder/neworder';
import productAnalytics from './components/neworder/product';
import billNo from './components/editBill/billNo';
import Editpage from './components/editBill/editBill';
import WasteAge from './components/wasteAge/wasteAge';
import NewCompany from './components/resgister/resgister'
import Login from './userLogin';
import axios from 'axios';
import { deepPurple } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Swal from 'sweetalert2';
import revenue from './components/analytics/revenue';
import barGraph from './components/analytics/barGraph';
import companywise, { product } from './components/analytics/companywise';
import billCopyofCompany from './components/analytics/billCopyofCompany';
import viewBill from './components/updateproduct/viewBill';
import pageNotFound from '../404';
import viewCustomer from './components/resgister/viewCustomer';
import editCustomer from './components/resgister/editCustomer';

export default class admin_home extends Component {

    constructor() {
        super()
        this.state = {
            branchId: '',
            hamburger: true,
            userName: localStorage.getItem('userName'),
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
                    icon: 'success',
                })
                localStorage.removeItem('user');
                localStorage.removeItem('userName');
                localStorage.removeItem('branchId');
                window.location.reload(false);
            }
        })

    }
    componentDidMount() {
        axios.get('https://gnindiamart.com/api/getBranchId.php/?bName=' + localStorage.getItem("userName"))
            .then((response) => {
                this.setState({ branchId: Object.entries(response.data)[0][1] });
                localStorage.setItem('branchId', this.state.branchId)
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
    }

    hamburgerMenu = () => {
        this.setState({ hamburger: !this.state.hamburger });
    }

    render() {
        return (
            <Router>
                {localStorage.getItem('user') ?
                    <div className="admin_home">
                        <div className="admin_container">
                            {this.state.hamburger ? <div className="admin_sidewrap">
                                <div className="admin_sideTop">
                                    <div className="nav_logo">
                                        <div className='mav_logo_name'>
                                            <h4>Billing</h4>
                                        </div>
                                    </div>
                                    <div className="Hamburger">
                                        <IconButton aria-label="upload picture" style={{ color: "white" }} component="span" onClick={this.hamburgerMenu}>
                                            {this.state.hamburger ? <Hamburger size={28} /> : <Cancel />}
                                        </IconButton>
                                    </div>
                                </div>
                                {/* <div className="admin_Details">
                                    <Avatar sx={{ bgcolor: deepPurple[500], height: 30, width: 30 }} >{this.state.userName.charAt(0)}</Avatar>
                                    // <h3>{localStorage.getItem('userName')}</h3>
                                </div> */}
                                <div className="admin_sidewrap_main">
                                    <ul>
                                        <Link to="/user">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Billingicon size={25} />
                                                    <p>Billing</p>
                                                </div>
                                            </li>
                                        </Link>

                                        <Link to="/user/billNo">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Editicon size={25} />
                                                    <p>Edit Bill</p>
                                                </div>
                                            </li>
                                        </Link>

                                        <Link to="/user/analytics">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Analyticsicon size={25} />
                                                    <p>Analytics</p>
                                                </div>
                                            </li>
                                        </Link>

                                        <Link to="/user/new_order">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Addicon size={25} />
                                                    <p>Branch Details</p>
                                                </div>
                                            </li>
                                        </Link>

                                        <Link to="/user/update_product">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <Deliveryicon size={25} />
                                                    <p>Update stock</p>
                                                </div>
                                            </li>
                                        </Link>

                                        <Link to="/user/wastage">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <WasteIcon size={25} />
                                                    <p> Wastage Update</p>
                                                </div>
                                            </li>
                                        </Link>
                                        <Link to="/user/NewCompany">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <NewUserIcon size={25} />
                                                    <p>Register Customer</p>
                                                </div>
                                            </li>
                                        </Link>
                                        {/* <Link to="/user/downloadData">
                                            <li>
                                                <div className="sidewrap_group">
                                                    <NewUserIcon size={25} />
                                                    <p>Download Data</p>
                                                </div>
                                            </li>
                                        </Link> */}
                                    </ul>
                                </div>
                                <div className='admin_side_footer'>
                                    <IconButton onClick={this.Logout} size='small' style={{ color: "white", height: 30 }}><Logout />
                                    <h4>Logout</h4>
                                    </IconButton>

                                </div>
                            </div> :
                                <div className='side_Nav'>
                                    <div className='side_nav_top'>
                                        <div className="Hamburger">
                                            <IconButton color="primary" style={{ color: "white" }} aria-label="upload picture" component="span" onClick={this.hamburgerMenu}>
                                                {this.state.hamburger ? <Hamburger size={28} /> : <Cancel />}
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div className="admin_nav_main">
                                        <ul>
                                            <Link to="/user">
                                                <li>
                                                    <div className="nav_group">
                                                        <Billingicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>

                                            <Link to="/user/billNo">
                                                <li>
                                                    <div className="nav_group">
                                                        <Editicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>

                                            <Link to="/user/analytics">
                                                <li>
                                                    <div className="nav_group">
                                                        <Analyticsicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>



                                            <Link to="/user/new_order">
                                                <li>
                                                    <div className="nav_group">
                                                        <Addicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            <Link to="/user/update_product">
                                                <li>
                                                    <div className="nav_group">
                                                        <Deliveryicon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            <Link to="/user/wastage">
                                                <li>
                                                    <div className="nav_group">
                                                        <WasteIcon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            <Link to="/user/NewCompany">
                                                <li>
                                                    <div className="sidewrap_group">
                                                        <NewUserIcon size={25} />
                                                    </div>
                                                </li>
                                            </Link>
                                            {/* <Link to="/user/downloadData">
                                                <li>
                                                    <div className="sidewrap_group">
                                                        <NewUserIcon size={25} />
                                                    </div>
                                                </li>
                                            </Link> */}
                                        </ul>
                                    </div>
                                    <div className='admin_nav_footer'>
                                        <IconButton onClick={this.Logout} size='small' style={{ color: "white", background: 'black', height: 30 }}><Logout /></IconButton>
                                    </div>
                                </div>
                            }
                            <div className="admin_mainwrap">
                                <Switch>
                                    <Route exact path="/user/billingName/billing/:cName" component={Billing}>
                                    </Route>
                                    <Route exact path="/user" component={BillingName}>
                                    </Route>
                                    <Route exact path="/user/billNo" component={billNo}>
                                    </Route>
                                    <Route exact path="/user/billNo/edit/:id" component={Editpage}>
                                    </Route>
                                    <Route exact path="/user/analytics" component={Analytics}>
                                    </Route>
                                    <Route exact path="/user/analytics/revenue" component={revenue}>
                                    </Route>
                                    <Route exact path="/user/analytics/barGraph" component={barGraph}>
                                    </Route>
                                    <Route exact path="/user/analytics/companyWise" component={companywise}>
                                    </Route>
                                    <Route exact path="/user/analytics/companyWise/:company_name" component={billCopyofCompany}>
                                    </Route>
                                    <Route exact path="/user/update_product" component={Update_product}>
                                    </Route>
                                    <Route exact path="/user/update_product/receiveProduct" component={reciveProduct}>
                                    </Route>
                                    <Route exact path="/user/viewBill/:billNo" component={viewBill}>
                                    </Route>
                                    <Route exact path="/user/product/:branchId/:pid" component={productAnalytics}>
                                    </Route>
                                    <Route exact path="/user/new_order" component={New_order}>
                                    </Route>
                                    <Route exact path="/user/wastage" component={WasteAge}>
                                    </Route>
                                    <Route exact path="/user/NewCompany" component={NewCompany}>
                                    </Route>
                                    <Route exact path="/user/viewCustomer" component={viewCustomer}>
                                    </Route>
                                    <Route exact path="/user/editCustomer/:id" component={editCustomer}>
                                    </Route>
                                    
                                    <Route component={pageNotFound} />
                                </Switch>
                            </div>
                        </div>
                    </div >
                    : <Login />}

            </Router >
        )
    }
}
