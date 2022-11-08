import React, { Component } from 'react'
import axios from 'axios';
import { Pie, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './viewAdminBill.css';
import { Link } from 'react-router-dom';
import { FiDownload as Download, FiMail as Mail } from 'react-icons/all';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';




export class billlCopy extends Component {

    constructor() {
        super();
        this.state = {
            parsedData: [],
            getData: [],
            billNo: '',
            branchId: '',
            company_name: '',
            pageTotal: '',
            advancePayment: '',
            balancePayment: '',
            time: '',
            tandc: '',
            desc: ''
        }
    }
    componentDidMount() {
        axios.get('http://billing-software.dkdeepak.com/api/ViewAdminBillCopy.php/?id=' + this.props.match.params.id)
            .then((response) => {
                this.setState({ getData: response.data });
                // this.setState({ parsedData: response.data.map(x => JSON.parse(x.billedProducts)) });
                this.setState({ billNo: Object.entries(response.data)[1][1] });
                this.setState({ branchId: Object.entries(response.data)[2][1] });
                this.setState({ company_name: Object.entries(response.data)[3][1] });
                this.setState({ parsedData: JSON.parse((Object.entries(response.data))[4][1]) });
                this.setState({ pageTotal: Object.entries(response.data)[5][1] });
                this.setState({ advancePayment: Object.entries(response.data)[6][1] });
                this.setState({ balancePayment: Object.entries(response.data)[7][1] });
                this.setState({ desc: Object.entries(response.data)[8][1] });
                this.setState({ tandc: Object.entries(response.data)[9][1] });
                this.setState({ time: Object.entries(response.data)[10][1] });
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
    }
    productAnalytics = (e, legendItem, legend) => {
        axios.get('http://billing-software.dkdeepak.com/api/fetchProductData.php/?pName=' + legendItem.text).
            then((response) => {
                // this.setState({ getData: response.data });
                this.props.history.push('/admin/allProduct/' + response.data[0].id)
            })
    }
    downloadPDF = () => {
        axios.get('http://billing-software.dkdeepak.com/api/mailBill.php/?billNo=' + this.state.billNo + "&Admin=" + 1 + '&download=1')
            .then(response => {
                if (response.data[0].includes(".pdf")) {
                    var name = ((response.data)[0]);
                    var durl = "http://billing-software.dkdeepak.com/api/" + name;
                    console.log(durl);
                    console.log(name);
                    saveAs(
                        durl,
                        response.data + ".pdf"
                    );
                }
            })
    }



    mail = () => {

        var timerInterval
        Swal.fire({
            title: 'Mail sending',
            html: 'Please wait until Mail sent succesfull',
            timer: 20000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                // timerInterval = setInterval(() => {
                //     b.textContent = Swal.getTimerLeft()
                // }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
            }
        })


        axios.get('http://billing-software.dkdeepak.com/api/mailBill.php/?billNo=' + this.state.billNo + "&Admin=" + 1 + '&mail=1').
            then((response) => {

                Swal.fire(
                    'Mail succesfully sent!',
                    `Bill copy has sucessFully sent to ${this.state.company_name}`,
                    'success'
                )
            })
    }
    render() {
        return (
            <div className='edit_bill_container'>
                <div className='edit_bill_head'>
                    <div className="edit_bill_head_left">
                        <div className='bill_style_row'>
                            <h4 style={{ padding: "1.5% 0%" }}>Bill No : {this.state.billNo}</h4>
                            <Link to={`/Admin/adminEditBillNo/${this.state.billNo}`}><button className='css-button-rounded--green' style={{ minWidth: 80, height: 30 }}> Edit </button></Link>
                        </div>
                        
                        <div className='bill_style_row'>
                            <h4 style={{ padding: "1.5% 0%" }}>Date & Time : {this.state.time}</h4>
                        </div>
                        <div className='bill_style_row'>
                            <h4 style={{ padding: "1.5% 0%" }}>Company name : {this.state.company_name}</h4>
                            <Link to={`/Admin/analytics/companySales/${this.state.company_name}`}><button className='css-button-rounded--rose' style={{ minWidth: 80, height: 30 }}> Statistic </button></Link>
                        </div>
                        <div className='bill_style_row'>
                            <h4 style={{ padding: "1.5% 0%" }}>Total : {this.state.pageTotal}</h4>
                        </div>
                        <div className='bill_style_row'>
                            <h4 style={{ padding: "1.5% 0%" }}>Advance Payment : {this.state.advancePayment}</h4>
                        </div>
                        <div className='bill_style_row'>
                            <h4 style={{ padding: "1.5% 0%" }}>Balance Payment : {this.state.balancePayment}</h4>
                        </div>
                        
                    </div>
                    <div className='edit_bill_head_right '>
                        <Doughnut data={{
                            labels: this.state.parsedData.map(x => x.billProductName),
                            datasets: [
                                {
                                    label: 'Product List',
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
                                    data: this.state.parsedData.map(x => ((x.billUnits === 'g' || x.billUnits === 'ml') ? x.billQuantity / 1000 : x.billQuantity))
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
                                        position: 'right',
                                        align: 'center',
                                        // onClick: this.productAnalytics,

                                    },
                                    title: {
                                        display: true,
                                        text: 'Product Quantity',
                                        align: 'center',
                                        position: 'top',
                                        font: {
                                            size: 16
                                        }
                                    }
                                },
                            }} />
                    </div>
                </div>
                    <div className="edit_bill_menu">
                    <table className='table'>
                        <thead className='table_head'>
                            <tr>
                                <th className='table_head'>Si No</th>
                                <th className='table_head'>Product Id</th>
                                <th className='table_head'>Product Name</th>
                                <th className='table_head'>Product Price</th>
                                <th className='table_head'>Gst</th>
                                <th className='table_head'>Quantity</th>
                                <th className='table_head'>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.parsedData.map((row, index) => (
                                <tr
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <td>{index + 1}</td>
                                    <td>PID{row.billProductId}</td>
                                    <td>{row.billProductName}</td>
                                    <td>{row.billProductPrice}</td>
                                    <td>{row.billProductGst}
                                    </td>
                                    <td >{row.billQuantity}{row.billUnits}</td>
                                    <td>{row.billTotalPrice}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
            </div>

        )
    }
}

export default billlCopy
