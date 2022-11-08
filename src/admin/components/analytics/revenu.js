import React, { Component } from 'react';
import axios from 'axios';
import './revenue.css';
import { Link } from 'react-router-dom';


export class revenu extends Component {

    constructor() {

        super();
        this.state = {
            getData: [],
            copyData: [],
            todayBill: [],
            todayBillTotal: 0,
            todayFormatedTotal: 0,
            weekBill: [],
            weekBillTotal: 0,
            weekFormatedTotal: 0,
            monthlyBill: [],
            monthlyBillTotal: 0,
            monthFormatedTotal: 0,
            branchList: [],
        }
    }


    componentDidMount() {
        //get all bill
        axios.get('http://billing-software.dkdeepak.com/api/fetchBillCopy.php')
            .then((response) => {
                this.setState({ getData: Object.values(response.data) }, function () {

                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })

        //get todays bill
        axios.get('http://billing-software.dkdeepak.com/api/getBillDateWise.php/?today=' + 1)
            .then((response) => {
                this.setState({ todayBill: Object.values(response.data) }, function () {
                    const t = this.state.todayBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0);
                    const formatTodayTotal = Math.abs(t) > 9999999 ? Math.sign(t) * ((Math.abs(t) / 10000000).toFixed(2)) + 'Cr' : Math.abs(t) > 99999 ? Math.sign(t) * ((Math.abs(t) / 100000).toFixed(2)) + 'L' : (Math.abs(t) > 999 ? Math.sign(t) * ((Math.abs(t) / 1000).toFixed(1)) + 'k' : Math.sign(t) * Math.abs(t));
                    this.setState({ todayBillTotal: t }, function () {
                        this.setState({ todayFormatedTotal: formatTodayTotal });
                        //getting branch list of todays bill
                        const branch = this.state.todayBill.map(x => x.branchId);
                        const branchList = (branch.filter((value, index, arr) => arr.indexOf(value) === index));
                        this.setState({ branchList: branchList }, function () {
                            //getting total no of bill in todays bill
                            console.log((this.state.todayBill.filter(x => (x.branchId === (this.state.branchList[0])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0));
                            console.log(this.state.todayBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0));
                        });

                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
        //get last 7 days bill
        axios.get('http://billing-software.dkdeepak.com/api/getBillDateWise.php/?week=' + 1)
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
        axios.get('http://billing-software.dkdeepak.com/api/getBillDateWise.php/?month=' + 1)
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

        //getting today bill data

    }




    render() {
        return (
            <div className="Rev_container">

                <div className='analytics_top'>
                    <div className='analytics_revenue'>
                        <div className='analytics_revenue_top'>
                            <h2>Overall Sales in All Branch</h2>
                        </div>
                        <div className='analytics_revenue_menu'>
                            <div className='menu1 analytics_box'>
                                <h5>Today sales</h5>
                                <h2 className='revenue_h2'> {this.state.todayFormatedTotal} </h2>
                            </div>
                            <div className='menu2 analytics_box'>
                                <h5>Last 7 days sales</h5>
                                <h2 className='revenue_h2'>{this.state.weekFormatedTotal}</h2>
                            </div>
                            <div className='menu3 analytics_box'>
                                <h5>Last 30 days sales</h5>
                                <h2 className='revenue_h2'>{this.state.monthFormatedTotal}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Rev_bottom'>
                    <div className='Rev_bottom_container'>
                        <div className='Rev_bottom_top'>
                            <h3>Branch wise Sales</h3>
                        </div>
                        <div className='Rev_bottom_table'>
                            <table className='table'>
                                <thead className='table_head'>
                                    <tr>
                                        <th className='table_head'>SI no</th>
                                        <th className='table_head'>Branch Id</th>
                                        <th className='table_head'>Total no of Bill</th>
                                        <th className='table_head'>Todays Sale</th>
                                        <th className='table_head'>Action</th>
                                    </tr>
                                </thead>
                                <tbody  >
                                    {this.state.branchList.length === 0 ? <tr><td >No Bills Yet</td> </tr> :
                                        this.state.branchList.map((x, index) => (
                                            <tr >
                                                <td>{index + 1}</td>
                                                <td>{x}</td>
                                                <td>{(this.state.todayBill.filter(x => (x.branchId === (this.state.branchList[index])))).length}</td>
                                                <td>{(this.state.todayBill.filter(x => (x.branchId === (this.state.branchList[index])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0)}</td>
                                                <td>
                                                    <Link to={`/Admin/analytics/reveue/${x}`}><button className='css-button-rounded--blue' >view</button>
                                                    </Link>
                                                </td>

                                            </tr>
                                        ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default revenu
