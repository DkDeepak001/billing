import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {BiSearchAlt as Search,MdDelete as DeleteIcon,BiUpArrowAlt as Up,BiDownArrowAlt as Down,MdModeEditOutline as Editicon,IoAnalyticsOutline as Analytics} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';


export class adminBillCopy extends Component {
    constructor() {
        super()
        this.state = {
            adminBilling: [],
            copyData:[],
            sortValueId: false,
            sortvalueName: false,
            sortTotalPrice: false,
            sortAdvancePrice: false,
            sortBalancePrice: false,
        }
    }
    componentDidMount() {
        axios.get('http://billing-software.dkdeepak.com/api/fetchAdminBillCopy.php').then((response) => {
            this.setState({ adminBilling: Object.values(response.data) });
            this.setState({ copyData: Object.values(response.data) });
        })
    }

    searchBar = (event) => {

        var output = this.state.copyData.filter(x => x.id.startsWith(event.target.value))
        this.setState({ adminBilling: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })
        
        
    }
    onKeyDown = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.id.startsWith(e.target.value))
            this.setState({ adminBilling: output });
        }
    }
    sortId = () => {
        this.setState({ sortValueId: !this.state.sortValueId })
        if (this.state.sortValueId === true) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt( a.id) - parseInt(b.id);
            }))
        } else if (this.state.sortValueId === false) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt(b.id) - parseInt( a.id);
            }))
        }
        
    }
    sortName = () => {
        this.setState({ sortvalueName: !this.state.sortvalueName });
        if (this.state.sortvalueName === true) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return a.company_name.localeCompare(b.company_name)
            }))
        } else if (this.state.sortvalueName === false) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return b.company_name.localeCompare(a.company_name)
            }))
        }
    }
    sortTotalPrice = () => {
        this.setState({ sortTotalPrice: !this.state.sortTotalPrice })
        if (this.state.sortTotalPrice === true) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt( a.totalPrice) - parseInt(b.totalPrice);
            }))
        } else if (this.state.sortTotalPrice === false) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt(b.totalPrice) - parseInt( a.totalPrice);
            }))
        }

    }
    sortAdvancePrice = () => {
        this.setState({ sortAdvancePrice: !this.state.sortAdvancePrice })
        if (this.state.sortAdvancePrice === true) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt( a.advancePayment) - parseInt(b.advancePayment);
            }))
        } else if (this.state.sortAdvancePrice === false) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt(b.advancePayment) - parseInt( a.advancePayment);
            }))
        }

    }
    sortBalancePrice = () => {
        this.setState({ sortBalancePrice: !this.state.sortBalancePrice })
        if (this.state.sortBalancePrice === true) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt( a.balancePayment) - parseInt(b.balancePayment);
            }))
        } else if (this.state.sortBalancePrice === false) {
            this.setState(this.state.adminBilling.sort(function (a, b) {
                return parseInt(b.balancePayment) - parseInt( a.balancePayment);
            }))
        }

    }

    render() {
        const a =this.state.sortValueId ;
        const b =this.state.sortvalueName ;
        const c =this.state.sortTotalPrice ;
        const d =this.state.sortAdvancePrice ;
        const e =this.state.sortBalancePrice ;
        return (
            <div className='bp_container'>
                <div className='bp_header'>
                    <h2>Admin Bill Copy </h2>
                    <TextField
                                label="Search"
                                id="Search"
                                sx={{ m: 1, width: '35ch' }}
                                placeholder='Search Bill No'
                                type='number'
                                onChange={this.searchBar}
                                onKeyDown={this.onKeyDown}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                            />
                </div>
                <div className='adminBillcopy_menu' style={{overflow:"auto"}}>
                    <table className='table'>
                        <thead className='table_head'>
                            <tr>
                                <th className='table_head' onClick={this.sortId} >{a? <Up size={15} /> : <Down size={15} />}Bill No</th>
                                <th className='table_head' onClick={this.sortName} >{b ? <Up size={15} /> : <Down size={15} />}Company name</th>
                                <th className='table_head' onClick={this.sortTotalPrice} >{c ? <Up size={15} /> : <Down size={15} />}Total Price</th>
                                <th className='table_head' onClick={this.sortAdvancePrice} >{d ? <Up size={15} /> : <Down size={15} />}Advance Payment</th>
                                <th className='table_head' onClick={this.sortBalancePrice} >{e ? <Up size={15} /> : <Down size={15} />}Balance Payment</th>
                                <th className='table_head'>Date &amp; Time</th>
                                <th className='table_head'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(this.state.adminBilling).length === 0 ?<td>No Data Found</td>
                            :
                            Object.values(this.state.adminBilling).map(((x, index) => (
                                <tr >
                                    <td>{x.id}</td>
                                    <td>{x.company_name}</td>
                                    <td>{x.totalPrice}</td>
                                    <td>{x.advancePayment}</td>
                                    <td>{x.balancePayment}</td>
                                    <td>{x.time}</td>
                                    <td>
                                        <Link to={`/Admin/AdminBillCopy/viewBill/${x.id}`}>
                                            <button className='css-button-rounded--blue' style={{ minWidth: 70 }}>View</button>
                                        </Link>
                                    </td>
                                </tr>
                            )))}

                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default adminBillCopy
