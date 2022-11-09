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
        axios.get('https://gnindiamart.com/api/waitingstock.php/?branchId='+localStorage.getItem('branchId'))
            .then(result => {
                this.setState({copyData:result.data},()=>{console.log(this.state.copyData)})
            })
       
    }
 


 
    // addProduct = () => {

    //     let balProduct = [];
    //     const FName = this.state.fetchData[0].productName;
    //     const Fpid = this.state.fetchData[0].id;
    //     const Funit = this.state.fetchData[0].units;
    //     const BName = this.state.balanceProduct.map(x => x.productName);
    //     const index = BName.indexOf(FName);
    //     const quantity = this.state.Quantity;
    //     if (index === -1) {

    //         let allData = new FormData();
    //         allData.append('Pid', Fpid);
    //         allData.append('branchId', localStorage.getItem('userName'));
    //         allData.append('productName', FName);
    //         allData.append('quantity', quantity);
    //         allData.append('units', Funit);
    //         axios({
    //             method: 'post',
    //             url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
    //             data: allData,
    //             config: { headers: { 'Content-Type': 'multipart/form-data' } }
    //         }).then(function (response) { })
    //         balProduct.push(allData);
    //         this.getData();
    //         this.setState({ Quantity: '' });
    //         this.setState({ selectedValues: '' });
    //         this.setState({ fetchData: [] });

    //     } else if (index >= 0) {
    //         const data = this.state.balanceProduct[index];
    //         const totalQ = (parseFloat(data.quantity) + parseFloat(quantity));
    //         data.quantity = totalQ;
    //         let allData = new FormData();
    //         allData.append('id', data.id);
    //         allData.append('quantity', data.quantity);
    //         axios({
    //             method: 'post',
    //             url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
    //             data: allData,
    //             config: { headers: { 'Content-Type': 'multipart/form-data' } }
    //         }).then(function (response) { })
    //         balProduct.push(allData);
    //         this.getData();
    //         this.setState({ Quantity: '' });
    //         this.setState({ selectedValues: '' });
    //         this.setState({ fetchData: [] });
    //     }
    //     localStorage.setItem('balProduct', balProduct)
    //     document.getElementById("searchBar").value = '';
    //     document.getElementById("quantityInput").value = '';


    // }
    addDb =(id)=>{
      axios.get('https://gnindiamart.com/api/addstocktostore.php/?id='+id)
      this.getData();
      window.location.reload(false);
}
    
    
    render() {
        return (
            <div className="b_container">
                <div className="b_name_header" style={{display:"flex",justifyContent:"space-between"}}>
                    <h2>Accept Order</h2>
                </div>
  
                <div style={{ overflowX: "auto" }}>
                    <table className="table">
                        <thead className='table_head'>
                            <tr>

                                <th className='table_head' >Si No</th>
                                <th className='table_head'  >Product Id</th>
                                <th className='table_head'  >Product Name</th>
                                <th className='table_head'  >Quantity</th>
                                <th className='table_head'  >Accept</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.copyData.length===0?<td>No Data Found</td>:
                                this.state.copyData.map((row, index) => (
                                <tr
                                    key={index + 1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <td component="th" scope="row">
                                        {index + 1}
                                    </td>
                                    <td >PID{row.Pid}</td>
                                    <td >{row.ProductName}</td>
                                    <td >{row.ProductQuantity} {row.ProductUnits}</td>
                                    <td ><button className='css-button-rounded--green'style={{minHeight:0,minWidth:40}} onClick={()=>{this.addDb(row.id)}}>Accept</button></td>

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
