import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import {
    IoMdAddCircleOutline as Addicon,
    MdDelete as DeleteIcon,
    BiUpArrowAlt as Up,
    BiDownArrowAlt as Down,
    AiOutlineCamera as PhotoCamera
} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Link } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './wastage.css';

const Input = styled('input')({
    display: 'none',
});

export class wasteAge extends Component {
    constructor() {
        super()
        this.state = {
            fetchData: [],
            copyData: [],
            selectedValues: '',
            Quantity: '',
            quanunit: 1,
            quantityPrice: 0,
            billingproducts: [],
            punit: '',
            stockDetial: [],
            dupData: [],
            image: null,
            wastage: [],
            arrow: 0,

        }
        this.getData();
        this.selectData = this.selectData.bind(this);

    }

    getData = () => {
        axios.get('https://gnindiamart.com/api/fetch.php')
            .then(result => {
                // this.setState({ fetchData: result.data });

                this.setState({ dupData: result.data });
            })
        axios.get('https://gnindiamart.com/api/fetchBalanceProduct.php/?branchId=' + localStorage.getItem('branchId'))
            .then(result => {
                this.setState({ stockDetial: result.data })
                const pid = (this.state.stockDetial.map(x => x.Pid));
                const matchedValues = (this.state.dupData.filter(x => pid.includes(x.id)));
                this.setState({ copyData: matchedValues });
            })
        axios.get('https://gnindiamart.com/api/getWastage.php/?bName=' + localStorage.getItem('branchId'))
            .then(result => {
                // this.setState({ fetchData: result.data });

                this.setState({ wastage: result.data });
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
    selectData(id, productName) {
        var output = this.state.copyData.filter(x => x.productName.includes(productName));
        this.setState({ fetchData: output });
        this.setState({ selectedValues: productName });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";

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
    uploadHandler = (event) => {
        this.setState({ image: event.target.files[0] });
    }
    calculatePrice = (event) => {
        this.setState({ Quantity: event.target.value })
    }
    gramPrice = (event) => {
        this.setState({ quanunit: event.target.value })
        if (this.state.quanunit === 1) {
            this.setState({ punit: 'kg' })
        } else if (this.state.quanunit === 2) {
            this.setState({ punit: 'liter' })
        } else if (this.state.quanunit === 3) {
            this.setState({ punit: 'g' });
        } else if (this.state.quanunit === 4) {
            this.setState({ punit: 'ml' });
        } else if (this.state.quanunit === 5) {
            this.setState({ punit: 'pkt' });
        }
    }

    addProduct = () => {
        if (this.state.Quantity === "") {
            Swal.fire({
                title: 'Empty Filed?',
                icon: 'warning'
            });
        } else {
            let allData = new FormData();
            allData.append('branchId', localStorage.getItem("branchId"));
            allData.append('productName', this.state.fetchData[0].productName);
            allData.append('id', this.state.fetchData[0].id);
            allData.append('quantity', this.state.Quantity);
            allData.append('punit', this.state.punit);
            allData.append('image', this.state.image);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/addWastage.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function (response) {
                Swal.fire({
                    title: 'Updated',
                    icon: 'success'
                });
            })
            this.setState({ fetchData: [] });
            this.setState({ selectedValues: '' });
            this.setState({ Quantity: '' });
            const quantityInput = document.getElementById('quantityInput');
            quantityInput.value = '';
            this.setState({ punit: '' });
            const punit = document.getElementById('punit');
            punit.defaultvalue = 1;
            this.setState({ image: null });
        }
    }
    render() {
        return (
            <div className="b_container">
                <div className='b_name_header'>
                    <h1>Wastage Update</h1>
                </div>
                <div className="b_header" style={{ marginTop: "5%" }}>
                    <div className="b_subheader">
                        <h3 className="w_sub_h3">Product Name</h3>
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
                    <div className='b_subheader'>
                        <h3 className="w_sub_h3">Image proof</h3>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={this.uploadHandler} />
                            <IconButton variant="contained" component="span" style={{ backgroundColor: "#516BEB", color: "black" }}>
                                <PhotoCamera />
                            </IconButton>
                            <p>{this.state.image === null ? "" : "image selected"}</p>

                        </label>
                    </div>
                    <div className="b_subheader">
                        <h3 className="w_sub_h3"> Wastage quantity</h3>
                        <div>
                            <OutlinedInput
                                id="quantityInput"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{ min: "0", max: "10", step: "1" }}
                                size='small'
                                type='number'
                                inputProps={{ min: "0",step: "1" }}
                                style={{ width: 100 }}
                                onChange={this.calculatePrice}
                                disabled={this.state.fetchData.length === 1 ? false : true}
                            />

                        </div>
                    </div>
                    <div className='b_subheader'>
                        <div>
                            <select
                                labelId="punit"
                                id="punit"
                                sx={{ height: 40, width: 140 }}
                                onChange={this.gramPrice}
                                disabled={this.state.Quantity === '' ? true : false}
                                className='select_unit'


                            >
                                {this.state.fetchData.map(x => (x.units) === "pkt" ? <option value={5} id="pkt">pkt</option> :
                                    this.state.fetchData.map(x => (x.units) === "kg" ? <option value={1} id="kg">kg</option> :
                                        <option value={2} id="liter">liter</option>))}
                                {this.state.fetchData.map(x => (x.units) === "pkt" ? <></> :
                                    this.state.fetchData.map(x => (x.units) === "kg" ? <option value={3} id="gram">gram</option> :
                                        <option value={4} id="ml">ml</option>))}

                            </select></div>
                    </div>

                    <div className="b_subheader">
                        <div>
                            {this.state.fetchData.length === 1 && this.state.Quantity !== "" ?
                                <button className='css-button-rounded--blue' onClick={this.addProduct} >
                                    <Addicon />upload
                                </button> : <button disabled className='css-button-rounded--blue' onClick={this.addProduct} >
                                    <Addicon />upload
                                </button>}
                        </div>
                    </div>
                </div>
                <div style={{overflow:"auto"}}>
                    <table className='table'>
                        <thead className='table_head'>
                            <tr>

                                <th className='table_head' >Si No</th>
                                <th className='table_head'   >Product Id</th>
                                <th className='table_head'   >Product Name</th>
                                <th className='table_head'   >Wastage Quantity</th>
                                <th className='table_head'  ></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.wastage.length <= 0 ? <tr><td>Nodata</td></tr> : <>
                                {this.state.wastage.map((row, index) => (
                                    <tr
                                        key={index + 1}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <td component="th" scope="row" >
                                            {index + 1}
                                        </td>
                                        <td  >PID{row.Pid}</td>
                                        <td  >{row.productName}</td>
                                        <td  >{row.quantity}{row.units}</td>

                                    </tr>
                                ))}</>}

                        </tbody>
                    </table>
                </div>

            </div >
        )
    }
}

export default wasteAge
