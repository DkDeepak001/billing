import React, { Component } from 'react';
import axios from 'axios';
import './companySales.css';
import { Link } from 'react-router-dom';
import {BiSearchAlt as Search,BiUpArrowAlt as Up,BiDownArrowAlt as Down} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export class product extends Component {
    constructor() {
        super();
        this.state = {
            getData: [],
            copyData: [],
            companyList: [],
            listData: [],
            sortValueId: false,
            sortvalueName: false,
            sortTotalBill: false,
        }

    }
    componentDidMount() {
        axios.get('http://billing-software.dkdeepak.com/api/fetchBillCopy.php')
            .then((response) => {
                this.setState({ getData: Object.values(response.data) }, function () {
                    const companyName = this.state.getData.map(x => x.company_name);
                    const companyList = (companyName.filter((value, index, arr) => arr.indexOf(value) === index));
                    this.setState({ companyList: companyList }, function () {
                        //getting total no of bill in todays bill
                        // console.log(this.state.todayBill.map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0));
                        const branchList = (this.state.companyList.map((x, index) => ((this.state.getData.filter(x => (x.company_name === (this.state.companyList[index])))).map((x) => ((x.branchId))))));
                        const company_name = this.state.companyList;
                        const total_bill = (this.state.companyList.map((x, index) => ((this.state.getData.filter(x => (x.company_name === (this.state.companyList[index])))).length)))
                        const branch_name = (branchList.map(x => (x).filter((val, id, array) => (array.indexOf(val) === id)))).map((x) => (x[0]));
                        const total = (this.state.companyList.map((x, index) => ((this.state.getData.filter(x => (x.company_name === (this.state.companyList[index])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0))));
                        var result = Object.assign.apply({}, [this.state.companyList.map((v, i, index) => ({ "company_name": company_name[i], "total": total[i], "branchId": branch_name[i], "totalBill": total_bill[i] }))]);
                        console.log(result.sort((a, b) => (b.total - a.total)))
                        this.setState({ listData: result })
                        this.setState({ copyData: result })
                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
    }

    searchBar = (event) => {

        var output = this.state.copyData.filter(x => x.company_name.startsWith(event.target.value))
        this.setState({ listData: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })


    }
    onKeyDown = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.company_name.includes(e.target.value))
            this.setState({ listData: output });
       }
    }
    sortId = () => {
        this.setState({ sortValueId: !this.state.sortValueId })
        if (this.state.sortValueId === true) {
            this.setState(this.state.listData.sort(function (a, b) {
                return parseInt( a.total) - parseInt(b.total);
            }))
        } else if (this.state.sortValueId === false) {
            this.setState(this.state.listData.sort(function (a, b) {
                return parseInt(b.total) - parseInt( a.total);
            }))
        }

    }
    sortTotalBill = () => {
        this.setState({ sortTotalBill: !this.state.sortTotalBill })
        if (this.state.sortTotalBill === true) {
            this.setState(this.state.listData.sort(function (a, b) {
                return parseInt( a.totalBill) - parseInt(b.totalBill);
            }))
        } else if (this.state.sortTotalBill === false) {
            this.setState(this.state.listData.sort(function (a, b) {
                return parseInt(b.totalBill) - parseInt( a.totalBill);
            }))
        }

    }
    sortName = () => {
        this.setState({ sortvalueName: !this.state.sortvalueName });
        if (this.state.sortvalueName === true) {
            this.setState(this.state.listData.sort(function (a, b) {
                return a.company_name.localeCompare(b.company_name)
            }))
        } else if (this.state.sortvalueName === false) {
            this.setState(this.state.listData.sort(function (a, b) {
                return b.company_name.localeCompare(a.company_name)
            }))
        }
    }

    render() {
        const x = this.state.sortValueId;
        const y = this.state.sortvalueName;
        const z = this.state.sortTotalBill;
        return (
            <div className='company_sales_container'>
                <div className='company_sales_top'>
                    <h2>Top Companys by sales</h2>
                    <TextField
                                label="Search"
                                id="Search"
                                sx={{ m: 1, width: '35ch' }}
                                placeholder='Search for Company'
                                onChange={this.searchBar}
                                onKeyDown={this.onKeyDown}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                            />
                </div>
                <div className='company_sales_bottom'>
                    <table className='table'>
                        <thead className='table_head'>
                            <tr>
                                <th className='table_head'>Si No</th>
                                <th className='table_head' onClick={this.sortName} >{y ? <Up size={15} /> : <Down size={15} />}Company Name</th>
                                <th className='table_head' onClick={this.sortId} >{x ? <Up size={15} /> : <Down size={15} />}Total Sales</th>
                                <th className='table_head'onClick={this.sortTotalBill} >{z ? <Up size={15} /> : <Down size={15} />}Total Bill</th>
                                <th className='table_head'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listData===0?<td> No Data found</td>:
                            this.state.listData.map((x, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{x.company_name}</td>
                                    <td>{x.total}</td>
                                    <td>{x.totalBill}</td>
                                    <td><Link to={`/Admin/analytics/companySales/${x.company_name}`}><button className='css-button-rounded--blue'>View Detail</button></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default product
