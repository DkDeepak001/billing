import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class CompanyWiseSales extends Component {
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
        axios.get('https://gnindiamart.com/api/getBillCompanyWise.php/?company_name=' + this.props.match.params.company_name)
            .then((response) => {
                this.setState({ getData: response.data })
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
        //last 3 month
        axios.get('https://gnindiamart.com/api/getDateWiseCompanyBill.php/?today=' + 1 + '&company_name=' + this.props.match.params.company_name)
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
        axios.get('https://gnindiamart.com/api/getDateWiseCompanyBill.php/?week=' + 1 + '&company_name=' + this.props.match.params.company_name)
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
        axios.get('https://gnindiamart.com/api/getDateWiseCompanyBill.php/?month=' + 1 + '&company_name=' + this.props.match.params.company_name)
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
            <div className='cws_container'>
                <div className='analytics_top'>
                    <div className='analytics_revenue'>
                        <div className='analytics_revenue_top' style={{ margin: "1.2%  0%" }}>
                            <h3>Revenue by {this.props.match.params.company_name}</h3>
                        </div>
                        <div className='analytics_revenue_menu'>
                            <div className='menu1 analytics_box'>
                                <h3>Last 3 months sales</h3>
                                <h2 className='revenue_h2'> {this.state.todayFormatedTotal} </h2>
                            </div>
                            <div className='menu2 analytics_box'>
                                <h3>Last 6 months sales</h3>
                                <h2 className='revenue_h2'>{this.state.weekFormatedTotal}</h2>
                            </div>
                            <div className='menu3 analytics_box'>
                                <h3>Last 1 year sales</h3>
                                <h2 className='revenue_h2'>{this.state.monthFormatedTotal}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Rev_bottom'>
                    <div className='Rev_bottom_container'>
                        <div className='Rev_bottom_top'>
                            <h3>Total bill by {this.props.match.params.company_name}</h3>
                        </div>
                        <div className='Rev_bottom_table'>
                            <table className='table'>
                                <thead className='table_head'>
                                    <tr>
                                        <th className='table_head'>Si No</th>
                                        <th className='table_head'>Bill no</th>
                                        <th className='table_head'>Company Name</th>
                                        <th className='table_head'>Branch Name</th>
                                        <th className='table_head'>Amount</th>
                                        <th className='table_head'>Date &#38; time</th>
                                        <th className='table_head'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.getData.length===0?<td>No Data Found</td>:
                                        this.state.getData.map((x, index) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{x.billNo}</td>
                                            <td>{x.company_name}</td>
                                            <td>{x.branchId}</td>
                                            <td>{x.totalPrice}</td>
                                            <td>{x.time}</td>
                                            <td><Link to={`/user/viewBill/${x.billNo}`}><button className='css-button-rounded--blue'>View Detail</button></Link></td>
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

export default CompanyWiseSales
