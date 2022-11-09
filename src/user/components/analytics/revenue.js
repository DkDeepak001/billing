import React, { Component } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';




export class branchWiseRevenue extends Component {
    constructor() {
        super();
        this.state = {
            getData: [],
            copyData: [],
            todayBill: [],
            todayBillTotal: null,
            todayFormatedTotal: null,
            weekBill: [],
            weekBillTotal: null,
            weekFormatedTotal: null,
            monthlyBill: [],
            monthlyBillTotal: null,
            monthFormatedTotal: null,
            branchList: [],
            datevlaue: [null, null],
        }

    }
    componentDidMount() {
        //get all data
        axios.get('https://gnindiamart.com/api/getBillDateBranchWise.php/?all=' + 1 + '&branchId=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ getData: Object.values(response.data) }, function () {
                    console.log(this.state.getData);
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })

        //get todays bill
        axios.get('https://gnindiamart.com/api/getBillDateBranchWise.php/?today=' + 1 + '&branchId=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ todayBill: Object.values(response.data) }, function () {
                    console.log(this.state.todayBill);
                    const t = this.state.todayBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0);
                    const formatTodayTotal = Math.abs(t) > 9999999 ? Math.sign(t) * ((Math.abs(t) / 10000000).toFixed(2)) + 'Cr' : Math.abs(t) > 99999 ? Math.sign(t) * ((Math.abs(t) / 100000).toFixed(2)) + 'L' : (Math.abs(t) > 999 ? Math.sign(t) * ((Math.abs(t) / 1000).toFixed(1)) + 'k' : Math.sign(t) * Math.abs(t));
                    this.setState({ todayBillTotal: t }, function () {
                        this.setState({ todayFormatedTotal: formatTodayTotal });
                        //getting branch list of todays bill
                        const branch = this.state.todayBill.map(x => x.branchId);
                        const branchList = (branch.filter((value, index, arr) => arr.indexOf(value) == index));
                        this.setState({ branchList: branchList }, function () {
                            //getting total no of bill in todays bill
                            console.log((this.state.todayBill.filter(x => (x.branchId === (this.state.branchList[0])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0));
                            console.log(this.state.todayBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0));
                        });

                    });
                }
                );
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })

        //get last 7 days bill
        axios.get('https://gnindiamart.com/api/getBillDateBranchWise.php/?week=' + 1 + '&branchId=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ weekBill: Object.values(response.data) }, function () {
                    const t = this.state.weekBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0);
                    const formatTodayTotal = Math.abs(t) > 9999999 ? Math.sign(t) * ((Math.abs(t) / 10000000).toFixed(2)) + 'Cr' : Math.abs(t) > 99999 ? Math.sign(t) * ((Math.abs(t) / 100000).toFixed(2)) + 'L' : (Math.abs(t) > 999 ? Math.sign(t) * ((Math.abs(t) / 1000).toFixed(1)) + 'k' : Math.sign(t) * Math.abs(t));
                    this.setState({ weekBillTotal: t }, function () {
                        this.setState({ weekFormatedTotal: formatTodayTotal });
                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
        //get last 30 days bill
        axios.get('https://gnindiamart.com/api/getBillDateBranchWise.php/?month=' + 1 + '&branchId=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ monthlyBill: Object.values(response.data) }, function () {
                    const t = this.state.monthlyBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0);
                    const formatTodayTotal = Math.abs(t) > 9999999 ? Math.sign(t) * ((Math.abs(t) / 10000000).toFixed(2)) + 'Cr' : Math.abs(t) > 99999 ? Math.sign(t) * ((Math.abs(t) / 100000).toFixed(2)) + 'L' : (Math.abs(t) > 999 ? Math.sign(t) * ((Math.abs(t) / 1000).toFixed(1)) + 'k' : Math.sign(t) * Math.abs(t));
                    this.setState({ monthlyBillTotal: t }, function () {
                        this.setState({ monthFormatedTotal: formatTodayTotal });
                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })

    }


    render() {
        return (
            <div className="Rev_container">
                <div className='analytics_top'>
                    <div className='analytics_revenue'>
                        <div className='analytics_revenue_top'>
                            <h2>Revenue </h2>
                        </div>
                        <div className='analytics_revenue_menu'>
                            <div className='menu1 analytics_box'>
                                <h3>Today sales</h3>
                                <h2 className='revenue_h2'> {this.state.todayFormatedTotal} </h2>
                            </div>
                            <div className='menu2 analytics_box'>
                                <h3>Last 7 days sales</h3>
                                <h2 className='revenue_h2'>{this.state.weekFormatedTotal}</h2>
                            </div>
                            <div className='menu3 analytics_box'>
                                <h3>Last 30 days sales</h3>
                                <h2 className='revenue_h2'>{this.state.monthFormatedTotal}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Rev_bottom'>
                    <div className='Rev_bottom_container'>
                        <div className='Rev_bottom_top'>
                            <h3>Today's Bill</h3>

                        </div>
                        <div className='Rev_bottom_table'>
                            <table className='table'>
                                <thead className='table_head'>
                                    <tr>
                                        <th className='table_head' >SI no</th>
                                        <th className='table_head' >Bill no</th>
                                        <th className='table_head' >Company name</th>
                                        <th className='table_head' >Todays Price</th>
                                        <th className='table_head' >Date 	&#38; time</th>
                                        <th className='table_head' >Action</th>
                                    </tr>
                                </thead>
                                <tbody id='container_table_body' >
                                    {this.state.todayBill.length === 0 ? <td>No Bill from this branch</td> :
                                        this.state.todayBill.map((x, index) => (
                                            <tr >
                                                <td >{index + 1}</td>
                                                <td >{x.billNo}</td>
                                                <td >{x.company_name}</td>
                                                <td >{x.totalPrice}</td>
                                                <td >{x.time}</td>
                                                <td >
                                                    <Link to={`/user/viewBill/${x.billNo}`}><button className='css-button-rounded--blue'>view</button>
                                                    </Link>
                                                </td>

                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default branchWiseRevenue
