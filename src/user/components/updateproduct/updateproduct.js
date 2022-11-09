import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import {
    IoMdAddCircleOutline as Addicon,
    MdDelete as DeleteIcon,
    BiUpArrowAlt as Up,
    BiDownArrowAlt as Down
} from 'react-icons/all';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './updateStock.css';
import { saveAs } from 'file-saver';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";



export class updateproduct extends Component {

    constructor() {
        super()
        this.state = {
            fetchData: [],
            copyData: [],
            balanceProduct: [],
            selectedValues: '',
            Quantity: '',
            arrow: 0,


        }
        this.getData();
    }

    getData = () => {
        axios.get('https://gnindiamart.com/api/fetch.php')
            .then(result => {
                this.setState({ copyData: result.data })
            })
        axios.get('https://gnindiamart.com/api/fetchBalanceProduct.php/?branchId=' + localStorage.getItem('userName'))
            .then(result => {
                this.setState({ balanceProduct: result.data })
            })
    }


    searchBar = (event) => {
        var output = this.state.copyData.filter(x => x.productName.includes(event.target.value));
        this.setState({ fetchData: output }, function () {
            const h = this.state.fetchData.length;
            if (h <= 3) {
                searchResult.style.height = "120px";
            }
            if (h <= 2) {
                searchResult.style.height = "80px";
            }
            if (h <= 1) {
                searchResult.style.height = "40px";
            }
            if (h >= 4) {
                searchResult.style.height = "160px";
            }
        }
        );
        this.setState({ selectedValues: event.target.value });
        const searchBar = document.getElementById('searchBar');
        const searchResult = document.getElementById('searchResult');
        if (event.target.value != '') {
            searchResult.style.display = "block";
        } else {
            searchResult.style.display = "none";
        }
        this.getData();
        this.setState({ arrow: 0 })


    }
    onKeyDown = (e) => {
        const searchResult = document.getElementById('searchResult');
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.productName.includes(e.target.value));
            this.setState({ fetchData: output }, function () {
                const h = this.state.fetchData.length;
                if (h <= 3) {
                    searchResult.style.height = "120px";
                }
                if (h <= 2) {
                    searchResult.style.height = "80px";
                }
                if (h <= 1) {
                    searchResult.style.height = "40px";
                }
                if (h >= 4) {
                    searchResult.style.height = "160px";
                }
            }
            );
        }
        if (e.keyCode === 38) {
            if (this.state.arrow > 0) {
                this.setState({ arrow: this.state.arrow - 1 }, () => {
                    searchResult.scrollTo(0, searchResult.scrollTop - 40);
                })
            }
        }
        if (e.keyCode === 40) {
            if (this.state.arrow < (this.state.fetchData.length - 1)) {
                if (searchResult.scrollTop >= 3) {
                    searchResult.scrollTo(0, searchResult.scrollTop + 40);
                } else {
                    searchResult.scrollTo(0, searchResult.scrollTop + 2);
                }
                this.setState({ arrow: this.state.arrow + 1 }, () => {
                })
            }
        }
        if (e.keyCode === 13) {
            var output = this.state.fetchData[this.state.arrow];
            if (output !== undefined) {
                this.selectData(this.state.arrow, (output.productName));
            }
        }


    }
    selectData(id, productName) {
        var output = this.state.copyData.filter(x => x.productName.includes(productName));
        this.setState({ fetchData: output });
        this.setState({ selectedValues: productName });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";

    }
    onChangeValue = (event) => {
        this.setState({ Quantity: event.target.value })
    }
    addProduct = () => {

        let balProduct = [];
        const FName = this.state.fetchData[0].productName;
        const Fpid = this.state.fetchData[0].id;
        const Funit = this.state.fetchData[0].units;
        const BName = this.state.balanceProduct.map(x => x.productName);
        const index = BName.indexOf(FName);
        const quantity = this.state.Quantity;
        if (index === -1) {

            let allData = new FormData();
            allData.append('Pid', Fpid);
            allData.append('branchId', localStorage.getItem('userName'));
            allData.append('productName', FName);
            allData.append('quantity', quantity);
            allData.append('units', Funit);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function (response) { })
            balProduct.push(allData);
            this.getData();
            this.setState({ Quantity: '' });
            this.setState({ selectedValues: '' });
            this.setState({ fetchData: [] });

        } else if (index >= 0) {
            const data = this.state.balanceProduct[index];
            const totalQ = (parseFloat(data.quantity) + parseFloat(quantity));
            data.quantity = totalQ;
            let allData = new FormData();
            allData.append('id', data.id);
            allData.append('quantity', data.quantity);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function (response) { })
            balProduct.push(allData);
            this.getData();
            this.setState({ Quantity: '' });
            this.setState({ selectedValues: '' });
            this.setState({ fetchData: [] });
        }
        localStorage.setItem('balProduct', balProduct)
        document.getElementById("searchBar").value = '';
        document.getElementById("quantityInput").value = '';


    }

    render() {
        return (
            <div className="b_container">
                <div className="b_name_header" style={{display:"flex",justifyContent:"space-between"}}>
                    <h2>Update Product</h2>
                    <Link to='/user/update_product/receiveProduct'><button className='css-button-rounded--blue'>Receive Product</button></Link>
                </div>
                {/* <div className="b_header" style={{ width: "60%", marginTop: "3%" }}>
                    <div className="b_subheader">
                        <h3>Product Name</h3>
                        <div>
                            <TextField id="searchBar" variant="outlined" size='small' onChange={this.searchBar} onKeyDown={this.onKeyDown} value={this.state.selectedValues} />
                            <div className='searchResult' id="searchResult" >
                                {this.state.fetchData.length === 0 ? <p className="items">No Data Found</p> :
                                    this.state.fetchData.map((x, index) => (
                                        <p className='items' id={(`items${index}` === `items${this.state.arrow}`) ? 'active' : ''} key={x.id} onClick={() => this.selectData(x.id, x.productName)}>{x.productName}</p>

                                    ))}


                            </div>
                        </div>
                    </div>
                    <div className="b_subheader">
                        <h3>Quantity</h3>
                        <div>
                            <OutlinedInput

                                id="quantityInput"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                    'aria-label': 'weight',
                                }}
                                size='small'
                                type='number'
                                inputProps={{ min: "0",step: "1" }}
                                style={{ width: 100 }}
                                onChange={this.onChangeValue}
                                disabled={this.state.selectedValues === '' ? true : false}
                            />
                        </div>
                    </div>
                    <div className="b_subheader">
                        <div>
                            {this.state.fetchData.length === 1 && this.state.Quantity !== "" ?
                                <button className='css-button-rounded--blue' onClick={this.addProduct} >
                                    <Addicon />Add
                                </button> : <button disabled className='css-button-rounded--blue' onClick={this.addProduct} >
                                    <Addicon />Add
                                </button>}

                        </div>
                    </div>
                </div> */}
                <div style={{ overflowX: "auto" }}>
                    <table className="table">
                        <thead className='table_head'>
                            <tr>

                                <th className='table_head' >Si No</th>
                                <th className='table_head'  >Product Id</th>
                                <th className='table_head'  >Product Name</th>
                                <th className='table_head'  >Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.balanceProduct.length===0?<td>No Data Found</td>:
                                this.state.balanceProduct.map((row, index) => (
                                <tr
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <td component="th" scope="row">
                                        {index + 1}
                                    </td>
                                    <td >PID{row.Pid}</td>
                                    <td >{row.productName}</td>
                                    <td >{row.quantity}{row.units}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default updateproduct
