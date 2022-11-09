import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    BiSearchAlt as Search,
} from 'react-icons/all';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
export class product extends Component {
    constructor() {
        super();
        this.state = {
            getData: [],
            copyData: [],
            companyList: [],
            listData: []
        }

    }
    componentDidMount() {
        axios.get('https://gnindiamart.com/api/fetchBillCopy.php/?bName=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ getData: Object.values(response.data) }, function () {
                    const companyName = this.state.getData.map(x => x.company_name);
                    const companyList = (companyName.filter((value, index, arr) => arr.indexOf(value) == index));
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
    render() {
        return (
            <div className='company_sales_container'>
                <div className='company_sales_top'>
                    <h2>Top Company</h2>
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
                                <th className='table_head'>Company Name</th>
                                <th className='table_head'>Branch Name</th>
                                <th className='table_head'>Total Sales</th>
                                <th className='table_head'>Total Bill</th>
                                <th className='table_head'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listData.length===0?<td>No Data Found</td>:
                                this.state.listData.map((x, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{x.company_name}</td>
                                    <td>{x.branchId}</td>
                                    <td>{x.total}</td>
                                    <td>{x.totalBill}</td>
                                    <td><Link to={`/user/analytics/companyWise/${x.company_name}`}><button className='css-button-rounded--blue'>View Detail</button></Link></td>
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
