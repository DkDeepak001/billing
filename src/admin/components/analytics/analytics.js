import React, { Component } from 'react';
import './analytics.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';



export class analytics extends Component {
    constructor() {

        super();
        this.state = {
            getData: [],
            topCompany: [],
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
            listData: []
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

        //getting  top companies
        axios.get('http://billing-software.dkdeepak.com/api/fetchBillCopy.php')
            .then((response) => {
                this.setState({ topCompany: Object.values(response.data) }, function () {
                    const companyName = this.state.topCompany.map(x => x.company_name);
                    const companyList = (companyName.filter((value, index, arr) => arr.indexOf(value) === index));
                    this.setState({ companyList: companyList }, function () {
                        //getting total no of bill in todays bill
                        // console.log(this.state.todayBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0));
                        const branchList = (this.state.companyList.map((x, index) => ((this.state.topCompany.filter(x => (x.company_name === (this.state.companyList[index])))).map((x) => ((x.branchId))))));
                        const company_name = this.state.companyList;
                        const total_bill = (this.state.companyList.map((x, index) => ((this.state.topCompany.filter(x => (x.company_name === (this.state.companyList[index])))).length)))
                        const branch_name = (branchList.map(x => (x).filter((val, id, array) => (array.indexOf(val) === id)))).map((x) => (x[0]));
                        const total = (this.state.companyList.map((x, index) => ((this.state.topCompany.filter(x => (x.company_name === (this.state.companyList[index])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0))));
                        var result = Object.assign.apply({}, [this.state.companyList.map((v, i, index) => ({ "company_name": company_name[i], "total": total[i], "branchId": branch_name[i], "totalBill": total_bill[i] }))]);
                        result.sort((a, b) => (b.total - a.total))
                        const slice = (result.slice(0, 7))
                        this.setState({ listData: slice })
                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })

    }
    render() {
        return (
            <div className='analytics_container'>
                <div className='analytics_header'>
                    <h1> Analytics</h1>
                </div>
                <div className='analytics_menu'>
                    <div className='analytics_top'>
                        <div className='analytics_revenue'>
                            <div className='analytics_revenue_top'>
                                <h3>Overall Sales </h3>
                                <Link to="/Admin/analytics/reveue/Admin">
                                    <button className='css-button-sliding-to-left--sky'>View detial</button>
                                </Link>
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
                    <div className='analytics_bottom'>
                        {/* <div className='analytics_bar'>
                            <div className='analytics_bar_top'>
                                <h3>Bar Graph of Today's</h3>
                                <Link to="/Admin/analytics/barGaraph">
                                    <button className='css-button-sliding-to-left--sky'>View detial</button>
                                </Link>
                            </div>
                            <div className='bar_menu_bottom'>
                                {this.state.branchList.length <= 1 ? <div className='errorContainer'><h4 className='errorMsg'>No Bills yet</h4></div> : <Bar data={{
                                    labels: this.state.branchList,
                                    datasets: [
                                        {
                                            backgroundColor: [
                                                '#B21F00', '#C9DE00', '#2FDE00', '#00A6B4', '#6800B4',
                                                '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                                                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                                                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                                                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                                                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                                                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                                                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                                                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                                                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                                                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
                                            ],
                                            data: this.state.branchList.map((x, index) => ((this.state.todayBill.filter(x => (x.branchId === (this.state.branchList[index])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0)))
                                        }
                                    ]
                                }}

                                    options={{
                                        layout: {
                                            padding: 30
                                        },
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                                align: 'center',
                                                display: false

                                            },

                                        },



                                    }} />}</div>
                        </div> */}
                        <div className='analytics_sales'>
                            <div className='analytics_sales_top'>
                                <h3>Customer Sales</h3>
                                <Link to="/Admin/analytics/companySales">
                                    <button className='css-button-sliding-to-left--sky'>View detial</button>
                                </Link>
                            </div>
                            <div className='analytics_sales_bottom'>
                                <table className='analytics_table' >
                                    <thead >
                                        <tr>
                                            <th className='analytics_tablehead' >Si No</th>
                                            <th className='analytics_tablehead'>Company Name</th>
                                            <th className='analytics_tablehead'>Total Sales</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.listData.map((x, index) => (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{x.company_name}</td>
                                                <td>{x.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table></div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default analytics
