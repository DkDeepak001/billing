import React, { Component } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Link } from "react-router-dom";


export class productAnalytics extends Component {
    constructor() {
        super();

        this.state = {
            getData: [],
            rawData: [],
            parsedData: [],
            dupData: [],
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
        axios.get('https://gnindiamart.com/api/fetchBillCopy.php/?bName=' + this.props.match.params.branchId)
            .then((response) => {
                this.setState({ getData: Object.values(response.data) });
                this.setState({ dupData: Object.values(response.data) });
                this.setState({ rawData: response.data });
                this.setState({ parsedData: response.data.map(x => JSON.parse(x.billedProducts)) },
                    () => {
                        const productQuantityArr = [];
                        const productPriceArr = [];

                        for (let i = 0; i <= this.state.parsedData.length - 1; i++) {
                            const list = (this.state.parsedData[i].filter((x) => (x.billProductId === this.props.match.params.pid)))
                            if (list.map(x => (x.billQuantity).length) == 0) {
                            } else if (list.map(x => (x.billQuantity).length) !== 0) {
                                console.log()
                                productQuantityArr.push(list.map(x => (x.billUnits === 'g' || x.billUnits === 'ml') ? parseFloat(x.billQuantity) / 1000 : parseFloat(x.billQuantity)).reduce((a, b) => a + b, 0));
                                productPriceArr.push(list.map(x => ((x.billTotalPrice))).reduce((a, b) => a + b, 0));
                            }
                        }
                        const totalQuantitySale = (productQuantityArr.reduce((a, b) => a + b, 0))
                        const totalQuantityPrice = (productPriceArr.reduce((a, b) => a + b, 0))
                        this.setState({ ProductTotalQuantitySale: totalQuantitySale })
                        this.setState({ ProductTotalRevenue: totalQuantityPrice })

                    });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
        axios.get('https://gnindiamart.com/api/fetchbalanceProduct.php/?branchId=' + this.props.match.params.branchId + '&pid=' + this.props.match.params.pid)
            .then((response) => {
                this.setState({ ProductBalanceQuantity: response.data.map(x => x.quantity) });
                this.setState({ ProductName: response.data.map(x => x.productName) });
            })
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
        this.getData(finalDate1, finalDate2)
    }
    getData = (date1, date2) => {
        console.log(date1, date2)
        axios.get('https://gnindiamart.com/api/getBillDateWise.php/?startDate=' + date1 + "&endDate=" + date2 + "&branchId=" + this.props.match.params.branchId)
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
                        console.log(copy.data[0][4])
                        if (this.state.selectDate === "1W" || this.state.selectDate === "1M") {
                            const barValue = [];
                            for (let i = 0; i < copy.date[0].length; i++) {
                                const v = (copy.data[0][i].map(x => JSON.parse(x.billedProducts).filter(x => (x.billProductId === this.props.match.params.pid)).map(x => parseFloat((x.billUnits === "g" || x.billUnits === "ml") ? x.billQuantity / 1000 : x.billQuantity)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0))
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
                                    const x = (copy.data[i][j].map(x => JSON.parse(x.billedProducts).filter(x => (x.billProductId === this.props.match.params.pid)).map(x => parseFloat((x.billUnits === "g" || x.billUnits === "ml") ? x.billQuantity / 1000 : x.billQuantity)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0))
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

    changeDate = (event) => {
        this.setState({ selectDate: event.target.value }, function () {
            const d1 = new Date();
            const year = d1.getFullYear();
            const month = (d1.getMonth() + 1).toString().padStart(2, "0");
            const day = d1.getDate().toString().padStart(2, "0");
            const finalDate1 = year + '-' + month + '-' + day;
            if (this.state.selectDate == "1W") {
                var d2 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() - 7);
            } else if (this.state.selectDate == "1M") {
                var d2 = new Date(d1.getFullYear(), d1.getMonth() - 1, d1.getDate());
            } else if (this.state.selectDate == "3M") {
                var d2 = new Date(d1.getFullYear(), d1.getMonth() - 3, d1.getDate());

            } else if (this.state.selectDate == "6M") {
                var d2 = new Date(d1.getFullYear(), d1.getMonth() - 6, d1.getDate());

            } else if (this.state.selectDate == "1Y") {
                var d2 = new Date(d1.getFullYear() - 1, d1.getMonth(), d1.getDate());

            } else if (this.state.selectDate == "2Y") {
                var d2 = new Date(d1.getFullYear() - 2, d1.getMonth(), d1.getDate());

            } else if (this.state.selectDate == "3Y") {
                var d2 = new Date(d1.getFullYear() - 3, d1.getMonth(), d1.getDate());

            } else if (this.state.selectDate == "4Y") {
                var d2 = new Date(d1.getFullYear() - 4, d1.getMonth(), d1.getDate());

            } else if (this.state.selectDate == "5Y") {
                var d2 = new Date(d1.getFullYear() - 5, d1.getMonth(), d1.getDate());

            }
            const d2year = d2.getFullYear();
            const d2month = (d2.getMonth() + 1).toString().padStart(2, "0");
            const d2day = d2.getDate().toString().padStart(2, "0");
            const finalDate2 = d2year + '-' + d2month + '-' + d2day;
            this.getData(finalDate1, finalDate2);
        })

    }

    render() {
        return (
            <div className='pa_analytics'>
                <div className='pa_header'>
                    <div className='pa_header_heading'>
                        <h2>Product Analytics of {this.state.ProductName} </h2>
                    </div>
                    <div className='pa_header_menu'>
                        <div className='box_menu' style={{ backgroundColor: "#A0E7E5", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1% 2%" }}><h4>Total sales of {this.state.ProductName} in {this.props.match.params.branchId}</h4><h2 style={{ marginTop: "5px" }}>{this.state.ProductTotalQuantitySale} Kg</h2></div>
                        <div className='box_menu' style={{ backgroundColor: "#FFAEBC", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1% 2%" }}><h4>Total Revenue made by {this.state.ProductName} in {this.props.match.params.branchId}</h4><h2 style={{ marginTop: "5px" }}>{this.state.ProductTotalRevenue} Rs</h2></div>
                        <div className='box_menu' style={{ backgroundColor: "#B4F8C8", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1% 2%" }}><h4>Balance {this.state.ProductName} left in {this.props.match.params.branchId}</h4><h2 style={{ marginTop: "5px" }}>{this.state.ProductBalanceQuantity} kg</h2></div>
                    </div>
                </div>
                <div className='pa_menu'>
                    <div className='pa_menu_header'>
                        <ToggleButtonGroup
                            value={this.state.selectDate}
                            exclusive
                            onChange={this.changeDate}
                        >
                            <ToggleButton value="1W" >
                                1W
                            </ToggleButton>
                            <ToggleButton value="1M" >
                                1M
                            </ToggleButton>
                            <ToggleButton value="3M" >
                                3M
                            </ToggleButton>
                            <ToggleButton value="6M" >
                                6M
                            </ToggleButton>
                            <ToggleButton value="1Y" >
                                1Y
                            </ToggleButton>
                            <ToggleButton value="2Y" >
                                2Y
                            </ToggleButton>
                            <ToggleButton value="3Y" >
                                3Y
                            </ToggleButton>
                            <ToggleButton value="4Y" >
                                4Y
                            </ToggleButton>
                            <ToggleButton value="5Y" >
                                5Y
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className='pa_meanu_bottom'>
                        {this.state.getData.length === 0 ? <td>NO Data yet</td> : <Bar data={{
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



                            }} />}

                    </div>
                </div>

            </div >
        )
    }
}

export default productAnalytics
