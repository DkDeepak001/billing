import React, { Component } from 'react'
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { Link } from 'react-router-dom';
import {
    BiSearchAlt as Search,
} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export class stockBranchWise extends Component {
    constructor() {
        super();
        this.state = {
            stockDetails: [],
            copyDataStockDetails:[],
            getData: [],
            rawData: [],
            dupData: [],
            copyData: [],
        }
    }
    componentDidMount() {
        axios.get('https://gnindiamart.com/api/fetchBalanceProduct.php/?branchId=' + localStorage.getItem('branchId'))
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ stockDetails: result.data });
                this.setState({ copyDataStockDetails: result.data });
            })
        axios.get('https://gnindiamart.com/api/fetchBillCopy.php/?bName=' + localStorage.getItem('branchId'))
            .then((response) => {
                this.setState({ getData: Object.values(response.data) });
                this.setState({ dupData: Object.values(response.data) });
                this.setState({ copyData: Object.values(response.data) });
                this.setState({ rawData: response.data });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
    }

    searchBarBill = (event) => {

        var output = this.state.copyData.filter(x => x.billNo.startsWith(event.target.value))
        this.setState({ dupData: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })


    }
    onKeyDownBill = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.billNo.startsWith(e.target.value))
             this.setState({ dupData: output });
       }
    }

    
    searchBarProduct = (event) => {

        var output = this.state.copyDataStockDetails.filter(x => x.productName.startsWith(event.target.value))
        this.setState({ stockDetails: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })


    }
    onKeyDownProduct = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyDataStockDetails.filter(x => x.productName.startsWith(e.target.value))
            this.setState({ stockDetails: output });
       }
    }
    render() {
        return (
            <div className='bcpa_container'>
                <div className='bcpa_header'>
                    <h2>Bill copy &#38; Product Analytics</h2>
                </div>
                <div className='bcpa_main'>
                    <div className='bcpa_left'>
                        <div className='bcpa_left_main'>
                            <div className='bcpa_left_mainHead'>
                                <h3>Bill Copy</h3>
                                <TextField
                                label="Search"
                                id="Search"
                                sx={{ m: 1, width: '25ch' }}
                                placeholder='Search Bill No'
                                inputProps={{ min: "0",step: "1" }}
                                type="number"
                                onChange={this.searchBarBill}
                                onKeyDown={this.onKeyDownBill}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                            />
                            </div>
                            <div  >
                                <table className='table' >
                                    <thead className='table1_head' >
                                        <tr>
                                            <th className='table1_head'  >SI no</th>
                                            <th className='table1_head' >Bill No</th>
                                            <th className='table1_head' >Company Name</th>
                                            <th className='table1_head' >Total Price</th>
                                            <th className='table1_head' >Date &amp; Time</th>
                                            <th className='table1_head' >Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id='container_table_body' >
                                        {this.state.dupData.length===0?<td>No Data Found</td>:
                                            (this.state.dupData).map((x, index) =>
                                            <tr>
                                                <td className='table1_data' >{index + 1}</td>
                                                <td className='table1_data' >{x.billNo}</td>
                                                <td className='table1_data' >{x.company_name}</td>
                                                <td className='table1_data' >{x.totalPrice}</td>
                                                <td className='table1_data' >{x.time}</td>
                                                <Link to={`/user/viewBill/${x.billNo}`}>
                                                    <td className='table1_data' ><button className='css-button-rounded--blue' style={{ minWidth: 80, minHeight: 40 }}>View Bill</button></td>
                                                </Link>

                                            </tr>

                                        )}

                                    </tbody>
                                </table>
                            </div >
                        </div>
                    </div>
                    <div className='bcpa_right'>
                        <div className='bcpa_right_main'>
                            <div className='bcpa_right_mainHead'>
                                <h3>Product Analytics</h3>
                                <TextField
                                label="Search"
                                id="Search"
                                sx={{ m: 1, width: '20ch' }}
                                placeholder='Search product'
                                onChange={this.searchBarProduct}
                                onKeyDown={this.onKeyDownProduct}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                            />
                            </div>
                            <div style={{ overflowX: 'auto' }} >
                                <table className='table'>
                                    <thead className='table1_head'>
                                        <tr>
                                            <th className='table1_head' >SI no</th>
                                            <th className='table1_head' >Product Name</th>
                                            <th className='table1_head' >Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id='table_body' >
                                        {this.state.stockDetails.length===0?<td>No Data Found</td>:
                                            this.state.stockDetails.map((x, index) =>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{x.productName}</td>
                                                <Link to={`/user/product/${localStorage.getItem('branchId')}/${x.Pid}`}>
                                                    <td><button className='css-button-rounded--blue' style={{ minHeight: 0, minWidth: 0 }}>Analytics</button></td>
                                                </Link>

                                            </tr>

                                        )}

                                    </tbody>
                                </table>
                            </div >
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default stockBranchWise
