import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import {BiSearchAlt as Search,} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';


export class stockUpdate extends Component {

    constructor() {
        super()
        this.state = {
            stockDetails: [],
            BranchArray: [],
            filterData: [],
            getData: [],
            copyData:[]
        }
        this.getData();
    }
    getData = () => {
        axios.get('http://billing-software.dkdeepak.com/api/fetchBalanceProduct.php')
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ stockDetails: result.data });
            })
        axios.get('http://billing-software.dkdeepak.com/api/getAllBranch.php')
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ copyData: (result.data) });
                this.setState({ BranchArray: result.data }, () => {
                    console.log()
                });
            })
        axios.get('http://billing-software.dkdeepak.com/api/fetchBillCopy.php')
            .then((response) => {
                this.setState({ getData: Object.values(response.data) });

            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })
    }

    searchBar = (event) => {

        var output = this.state.copyData.filter(x => x.BrachId.includes(event.target.value))
        this.setState({ BranchArray: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })


    }
    onKeyDown = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.BrachId.includes(e.target.value))
            this.setState({ BranchArray: output });
       }
    }
    render() {
        return (
            <div className='bp_container'>
                <div className='bp_header'>
                    <h2>Update Stock </h2>
                    <TextField
                                label="Search"
                                id="Search"
                                sx={{ m: 1, width: '35ch' }}
                                placeholder='Search for Branch'
                                onChange={this.searchBar}
                                onKeyDown={this.onKeyDown}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                            />
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table className='table'>
                        <thead className='table_head'>
                            <tr>
                                <th className='table_head' >ID</th>
                                <th className='table_head'>BranchId</th>
                                <th className='table_head'>Total Product</th>
                                <th className='table_head'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.BranchArray.length === 0 ?
                                (<h3>
                                    No Data Available
                                </h3>)
                                :
                                (this.state.BranchArray.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td >{row.BrachId}</td>
                                        <td >{this.state.stockDetails.filter(x => (x.branchId === row.BrachId)).length} Products</td>
                                        <td ><Link to={`/Admin/updateStock/${row.BrachId}`} ><button className='css-button-rounded--blue'>View Detail</button></Link></td>


                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default stockUpdate
