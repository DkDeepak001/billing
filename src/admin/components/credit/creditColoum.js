import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {BiSearchAlt as Search,BiUpArrowAlt as Up,BiDownArrowAlt as Down,} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import Swal from 'sweetalert2';

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
            tmpId:"",
            tmpCompanyName:"",
            tmpBalancePayment:"",
            finishedBalancePayment:"",
            tmpadvancepayment:"",
            newAdvancePayment:"",
            tmpTotalPrice:"",
            maxValue:""


        }
    }
    componentDidMount() {
        axios.get('http://billing-software.dkdeepak.com/api/fetchAdminBillCopy.php').then((response) => {
            this.setState({ adminBilling: Object.values(response.data) },()=>{
                this.setState(this.state.adminBilling.sort(function (a, b) {
                    return parseInt(b.balancePayment) - parseInt( a.balancePayment);
                }))
            });
            this.setState({adminBilling:(this.state.adminBilling.filter(x=> parseInt(x.balancePayment) > 0))})
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
    clearPay=(id,company_name,balancePayment,advancePayment,totalPrice)=>{
        this.setState({tmpId:id})
        this.setState({tmpCompanyName:company_name})
        this.setState({tmpBalancePayment:balancePayment})
        this.setState({finishedBalancePayment:balancePayment})
        this.setState({maxValue:balancePayment})
        this.setState({tmpadvancepayment:advancePayment})
        this.setState({newAdvancePayment:advancePayment})
        this.setState({tmpTotalPrice:totalPrice})
        document.getElementById('hide-container').style.display="none";
        document.getElementById('show-updatepayment').style.display="flex";
    }
    inputPay=(event)=>{
        if(parseInt(event.target.value)> parseInt(this.state.maxValue)){
             Swal.fire(
            'Error',
            'Amount should not more than Pending payment',
            'error'
            )
            document.getElementById('payBox').value = this.state.tmpBalancePayment;
        }else{
        if(event.target.value==="" || event.target.value=== NaN){
            this.setState({tmpBalancePayment:0},()=>{
                this.setState({finishedBalancePayment:parseInt(this.state.tmpTotalPrice) - (parseInt(this.state.tmpadvancepayment) + parseInt(this.state.tmpBalancePayment))},()=>{
                    this.setState({newAdvancePayment:parseInt(this.state.tmpTotalPrice) - parseInt(this.state.finishedBalancePayment)}) 

                })
            }) 
        }else{
        this.setState({tmpBalancePayment:parseInt(event.target.value)},()=>{
            this.setState({finishedBalancePayment:parseInt(this.state.tmpTotalPrice) - (parseInt(this.state.tmpadvancepayment) + parseInt(this.state.tmpBalancePayment))},()=>{
                this.setState({newAdvancePayment:parseInt(this.state.tmpTotalPrice) - parseInt(this.state.finishedBalancePayment)}) 

            })
        })
    }
}
      

    }
    updatedPay=(e)=>{
        // e.preventDefault();
        axios.get('http://billing-software.dkdeepak.com/api/updateBalPay.php/?id='+this.state.tmpId+'&balancePay='+this.state.finishedBalancePayment+'&advancePay='+this.state.newAdvancePayment)
        document.getElementById('hide-container').style.display="block";
        document.getElementById('show-updatepayment').style.display="none";
    }
    hidePopUp=(e)=>{        
        e.preventDefault();
        document.getElementById('hide-container').style.display="block";
        document.getElementById('show-updatepayment').style.display="none";
    }

    render() {
        const a =this.state.sortValueId ;
        const b =this.state.sortvalueName ;
        const c =this.state.sortTotalPrice ;
        const d =this.state.sortAdvancePrice ;
        const e =this.state.sortBalancePrice ;
        return (
            <div className='bp_container'>
                <div className='hide-container' id="hide-container">
                <div className='bp_header'>
                    <h2>Pending Payment</h2>
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
                                <th className='table_head'>Edit</th>
                                <th className='table_head'>View</th>
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
                                    <td><button className='css-button-rounded--green' onClick={()=>{this.clearPay(x.id,x.company_name,x.balancePayment,x.advancePayment,x.totalPrice)}} >Update Payment</button></td>
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
                <div className='show-updatepayment' id="show-updatepayment"  >
                    <div className='show-updatepayment-bg'>
                        <button onClick={this.hidePopUp} className='css-button-rounded--red' style={{padding:".5%",minWidth:0,minHeight:0,position:"relative"}}>X</button>
                        <form id="updatePay-form" className='updatePay-form'>
                            <h2 style={{padding:"10px 30px"}}>You are updating Payment for {this.state.tmpCompanyName} and Bill No is {this.state.tmpId}</h2>
                            <h3 style={{padding:"10px 0px"}}> Total : {this.state.tmpTotalPrice}</h3>
                            <h3 style={{padding:"10px 0px"}}>Recived Payment : {this.state.newAdvancePayment}</h3>
                            <h3 style={{padding:"10px 0px"}}>pending Payment : {this.state.finishedBalancePayment}</h3>
                            <TextField 
                                    id="payBox" 
                                    type='number' 
                                    label="Pending Payment" 
                                    variant="outlined" 
                                    size='small' 
                                    name="Another_paymeny"
                                    style={{margin:"10px 0px",width:250}}
                                    inputProps={{ min: "0", max:this.state.tmpBalancePayment,step: "1" }}
                                    onChange={this.inputPay} 
                                    placeholder={`Pending payment is ${this.state.tmpBalancePayment}`}
                                    />
                            {/* <input type="number" max={this.state.tmpBalancePayment} value={this.state.tmpBalancePayment} placeholder={this.state.tmpBalancePayment} onChange={this.inputPay}></input> */}
                            <button onClick={this.updatedPay} className='css-button-rounded--green'>Update Pay</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default adminBillCopy
