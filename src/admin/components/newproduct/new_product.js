import React, { Component } from 'react';
import './new_products.css';
import {BiSearchAlt as Search,MdDelete as DeleteIcon,BiUpArrowAlt as Up,BiDownArrowAlt as Down} from 'react-icons/all';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';


class new_product extends Component {

    constructor() {
        super();
        this.state = {
            fetchData: [],
            copyData: [],
            sortValueId: false,
            sortvalueName: false,
            sortvaluePrice: false,
            sortvalueUnits: false,
            sortvaluegst: false,
            arrow: 0,

        }
        this.getData();
    }

    getData = () => {
        axios.get('http://billing-software.dkdeepak.com/api/fetch.php')
            .then(result => {
                this.setState({ fetchData: result.data });
                this.setState({ copyData: result.data });
            })


    }
    // this.getData();


    searchBar = (event) => {

        var output = this.state.copyData.filter(x => x.productName.startsWith(event.target.value))
        this.setState({ fetchData: output });
        if (event.target.value === '') {
            this.getData();
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })


    }
    onKeyDown = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.productName.includes(e.target.value))
            this.setState({ fetchData: output });
            this.getData();

        }



    }

    deleteRow = (id) => {
        axios({
            method: 'post',
            url: 'http://billing-software.dkdeepak.com/api/delete.php/?delete=' + id
        })
            .then(function (response) {
                //handle success
                if (response.status === 200) {
                }
            })
        this.setState({ arrow: 0 }, () => {

            this.getData();
        })

    }



    alertMsg = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to Delete this Product!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                this.deleteRow(id);
            }
        })
    }
    sortId = () => {
        this.setState({ sortValueId: !this.state.sortValueId })
        if (this.state.sortValueId === true) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return a.id - b.id;
            }))
        } else if (this.state.sortValueId === false) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return b.id - a.id;
            }))
        }

    }
    sortName = () => {
        this.setState({ sortvalueName: !this.state.sortvalueName });
        if (this.state.sortvalueName === true) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return a.productName.localeCompare(b.productName)
            }))
        } else if (this.state.sortvalueName === false) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return b.productName.localeCompare(a.productName)
            }))
        }
    }
    sortPrice = () => {
        this.setState({ sortvaluePrice: !this.state.sortvaluePrice });
        if (this.state.sortvaluePrice === true) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return a.totalPrice - b.totalPrice;
            }))
        } else if (this.state.sortvaluePrice === false) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return b.totalPrice - a.totalPrice;
            }))
        }
    }
    sortUnits = () => {
        this.setState({ sortvalueUnits: !this.state.sortvalueUnits });
        if (this.state.sortvalueUnits === true) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return a.units.localeCompare(b.units)
            }))
        } else if (this.state.sortvalueUnits === false) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return b.units.localeCompare(a.units)
            }))
        }
    }
    sortgst = () => {
        this.setState({ sortvaluegst: !this.state.sortvaluegst });
        if (this.state.sortvaluegst === true) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return a.gst - b.gst;
            }))
        } else if (this.state.sortvaluegst === false) {
            this.setState(this.state.fetchData.sort(function (a, b) {
                return b.gst - a.gst;
            }))
        }
    }

    render() {
        const x = this.state.sortValueId;
        const y = this.state.sortvalueName;
        const z = this.state.sortvaluePrice;
        const a = this.state.sortvalueUnits;
        const b = this.state.sortvaluegst;

        return (
            <div className="np_container">
                <div className="np_header">
                    <div className="np_left">
                        <h1>Products</h1>
                    </div>
                    <div className="np_right">
                        <div className="np_right_search">
                            <TextField
                                label="Search"
                                id="Search"
                                sx={{ m: 1, width: '35ch' }}
                                placeholder='Search for product'
                                onChange={this.searchBar}
                                onKeyDown={this.onKeyDown}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                            />
                        </div>
                        <Link to="/Admin/new_products/addnew">
                            <button className='css-button-rounded--blue' > Add Product</button>
                        </Link>

                    </div>
                </div>
                <div className="np_mainwrap">
                    {this.state.fetchData.length === 0 ?
                        <div style={{ margin: "3% 0%" }}>
                            <h3>No Products found</h3>
                        </div>
                        :
                        <div style={{ overflowX: 'auto' }}>
                            <table className='table'>
                                <thead className='table_head'>
                                    <tr>
                                        <th className='table_head' onClick={this.sortId} >{x ? <Up size={15} /> : <Down size={15} />}ID</th>
                                        <th className='table_head' onClick={this.sortName} >{y ? <Up size={15} /> : <Down size={15} />}Product Name</th>
                                        <th className='table_head' onClick={this.sortPrice} >{z ? <Up size={15} /> : <Down size={15} />}Price</th>
                                        <th className='table_head' onClick={this.sortUnits} >{a ? <Up size={15} /> : <Down size={15} />}Units</th>
                                        <th className='table_head' onClick={this.sortgst} >{b ? <Up size={15} /> : <Down size={15} />}Gst %</th>
                                        <th className='table_head' >Delete</th>
                                        <th className='table_head' >Edit</th>
                                        {/* <th className='table_head' >Analytics</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.fetchData.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <td >
                                                PID{row.id}
                                            </td>
                                            <td>{row.productName}</td>
                                            <td>{row.totalPrice}</td>
                                            <td>{row.units}</td>
                                            <td>{row.gst}%</td>
                                            <td sx={{ width: 100 }}><IconButton variant="contained" size='small' color='error' onClick={() => this.alertMsg(row.id)} ><DeleteIcon /></IconButton></td>
                                            <td sx={{ width: 100 }}>
                                                <Link to={`/Admin/update_price/edit/${row.id}`}>
                                                    <button className='css-button-rounded--green' style={{ minWidth: 80, height: 40, }} >
                                                        Edit
                                                    </button>
                                                </Link>
                                            </td>
                                            {/* <td sx={{ width: 100 }}>
                                                <Link to={`/Admin/allProduct/${row.id}`}>
                                                    <button className='css-button-rounded--blue' style={{ minWidth: 100, height: 40, }} >
                                                        Analytics
                                                    </button>
                                                </Link>
                                            </td> */}

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }



                </div>
            </div >


        )
    }
}

export default new_product
