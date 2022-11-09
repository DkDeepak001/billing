import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
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
            listData: [],
            ProductName: null,
            ProductTotalQuantitySale: null,
            ProductBalanceQuantity: null,
            ProductTotalRevenue: null,
            selectDate: "1W",
            DataBetween: [],
            dateArray: [],
            label: [],
            barValue: []
        }
    }


    componentDidMount() {
        //get all bill
        axios.get('https://gnindiamart.com/api/fetchBillCopy.php/?bName=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ getData: Object.values(response.data) }, function () {
                    const d1 = new Date();
                    const year = d1.getFullYear();
                    const month = (d1.getMonth() + 1).toString().padStart(2, "0");
                    const day = d1.getDate().toString().padStart(2, "0");
                    const finalDate1 = year + '-' + month + '-' + day;
                    var d2 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() - 7);
                    const d2year = d2.getFullYear();
                    const d2month = (d2.getMonth() + 1).toString().padStart(2, "0");
                    const d2day = d2.getDate().toString().padStart(2, "0");
                    const finalDate2 = d2year + '-' + d2month + '-' + d2day;
                    this.getData(finalDate1, finalDate2);
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })

        //get todays bill
        axios.get('https://gnindiamart.com/api/getBillDateBranchWise.php/?today=' + 1 + '&branchId=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ todayBill: Object.values(response.data) }, function () {
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
                });
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

        //getting  top companies
        axios.get('https://gnindiamart.com/api/fetchBillCopy.php/?bName=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ topCompany: Object.values(response.data) }, function () {
                    const companyName = this.state.topCompany.map(x => x.company_name);
                    const companyList = (companyName.filter((value, index, arr) => arr.indexOf(value) == index));
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

    getData = (date1, date2) => {
        console.log(date1, date2)
        axios.get('https://gnindiamart.com/api/getBillDateWise.php/?startDate=' + date1 + "&endDate=" + date2 + "&branchId=" + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ DataBetween: response.data }, () => {
                    let dates = [];
                    let stringDate = [];
                    let instringDate = [];
                    const startDate = new Date(date2)
                    const endDate = new Date(date1)
                    while (startDate < endDate) {
                        const year = startDate.getFullYear();
                        const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
                        const day = startDate.getDate().toString().padStart(2, "0");
                        const finalDate = year + '-' + month + '-' + day;
                        stringDate.push(finalDate);
                        dates = [...dates, new Date(startDate)]
                        startDate.setDate(startDate.getDate() + 1)
                    }
                    const orArr = [];
                    let dupData = [];
                    for (let i = 0; i < stringDate.length; i++) {
                        dupData.push(stringDate[i])
                        if (this.state.selectDate == "3M") {
                            if (dupData.length >= 7) {
                                orArr.push(dupData)
                                dupData = [];
                            }
                        } else if (this.state.selectDate == "6M") {
                            if (dupData.length >= 14) {
                                orArr.push(dupData)
                                dupData = [];
                            }
                        } else if ((this.state.selectDate == "1Y")) {
                            if (dupData.length >= 30) {
                                orArr.push(dupData)
                                dupData = [];
                            }
                        } else if (this.state.selectDate == "2Y") {
                            if (dupData.length >= 60) {
                                orArr.push(dupData)
                                dupData = [];
                            }
                        } else if (this.state.selectDate == "3Y") {
                            if (dupData.length >= 90) {
                                orArr.push(dupData)
                                dupData = [];
                            }
                        } else if (this.state.selectDate == "4Y") {
                            if (dupData.length >= 120) {
                                orArr.push(dupData)
                                dupData = [];
                            }
                        } else if (this.state.selectDate == "5Y") {
                            if (dupData.length >= 150) {
                                orArr.push(dupData)
                                dupData = [];
                            }
                        }

                    }
                    orArr.push(dupData)
                    this.setState({ dateArray: stringDate }, () => {
                        let emp = [];
                        let abc = [];
                        let xyz = [];
                        for (let i = 0; i < orArr.length; i++) {

                            for (let j = 0; j < orArr[i].length; j++) {
                                const date = (this.state.getData.filter(x => (x.time.includes(orArr[i][j]))))
                                abc.push(date);
                            }
                            xyz.push(abc)
                            abc = [];
                        }
                        const copy = Object.assign({}, { "date": orArr, "data": xyz });
                        if (this.state.selectDate === "1W" || this.state.selectDate === "1M") {
                            const barValue = [];
                            for (let i = 0; i < copy.date[0].length; i++) {
                                const v = (copy.data[0][i].map(x => parseFloat(x.totalPrice)).reduce((a, b) => a + b, 0))
                                barValue.push(v)
                            }
                            this.setState({ label: copy.date[0] })
                            this.setState({ barValue: barValue })

                        } else if (this.state.selectDate === "3M" || this.state.selectDate === "6M" || this.state.selectDate === "1Y" || this.state.selectDate === "2Y" || this.state.selectDate === "3Y" || this.state.selectDate === "4Y" || this.state.selectDate === "5Y") {
                            const date = [];
                            const a = [];
                            const b = [];
                            const c = [];
                            let d = [];
                            for (let i = 0; i < copy.date.length; i++) {
                                const a1 = (copy.date[i].length)
                                date.push(copy.date[i][0] + " to " + copy.date[i][a1 - 1])
                                for (let j = 0; j < copy.data[i].length; j++) {
                                    const x = (copy.data[i][j].map(x => parseFloat(x.totalPrice)).reduce((a, b) => a + b, 0))
                                    d.push(x)
                                }
                                c.push(d)
                                d = [];

                                const a2 = (c[i].reduce((a, b) => a + b, 0))
                                b.push(a2)
                            }
                            this.setState({ label: date })
                            this.setState({ barValue: b })
                        }
                    });
                })
            })

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
                                <h3>Overall Sales</h3>
                                <Link to="/user/analytics/revenue">
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
                        <div className='analytics_bar'>
                            <div className='analytics_bar_top'>
                                <h3>Bar Graph</h3>
                                <Link to="/user/analytics/barGraph">
                                    <button className='css-button-sliding-to-left--sky'>View detial</button>
                                </Link>
                            </div>
                            <div className='bar_menu_bottom'>
                                {this.state.getData.length === 0 ? <>NO Bill yet</> : <Bar data={{
                                    labels: this.state.label,
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
                                            borderColor: ["#000"],
                                            data: this.state.barValue,
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
                        </div>
                        <div className='analytics_sales'>
                            <div className='analytics_sales_top'>
                                <h3>Customer Sales</h3>
                                <Link to="/user/analytics/companyWise">
                                    <button className='css-button-sliding-to-left--sky'>View detial</button>
                                </Link>
                            </div>
                            <div className='analytics_sales_bottom'>
                                <table className='analytics_table'>
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
