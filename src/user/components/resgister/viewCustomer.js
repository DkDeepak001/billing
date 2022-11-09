import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    BiSearchAlt as Search,
        MdDelete as DeleteIcon,
        BiUpArrowAlt as Up,
        BiDownArrowAlt as Down,
        MdModeEditOutline as Editicon,
        IoAnalyticsOutline as Analytics
    
} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export class product extends Component {
    constructor() {
        super();
        this.state = {
            branchList:[],
            sortValueId: false,
            sortvalueName: false,
            sortTotalBill: false,
        }
        this.getData();
    }
    getData=()=> {
         axios.get('https://gnindiamart.com/api/getCompanyName.php/?bName='+localStorage.getItem('branchId'))
            .then((response) => {
               this.setState({branchList: response.data})
            })

 }

    searchBar = (event) => {

        var output = this.state.copyData.filter(x => x.company_name.startsWith(event.target.value))
        this.setState({ listData: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })
        this.getData();


    }
    onKeyDown = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.company_name.includes(e.target.value))
            this.setState({ listData: output });
       }
       this.getData();
    
    }


    render() {

        return (
            <div className='company_sales_container'>
                <div className='company_sales_top'>
                    <h2>Companys List</h2>
                   
                </div>
                <div className='company_sales_bottom'>
                    <table className='table'>
                        <thead className='table_head'>
                            <tr>
                                <th className='table_head'>Si No</th>
                                <th className='table_head'>Company Name</th>
                                <th className='table_head'>Gst No </th>
                                <th className='table_head'>Email</th>
                                <th className='table_head'>Phone no</th>
                                <th className='table_head'>Date &#38; time</th>
                                <th className='table_head'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.branchList.length===0?<td>No Data Found</td>:
                                this.state.branchList.map((x, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{x.company_name}</td>
                                    <td>{x.Gst_no}</td>
                                    <td>{x.email}</td>
                                    <td>{x.phone_no}</td>
                                    <td>{x.time}</td>
                                    <td><Link to={`/user/editCustomer/${x.cid}`}><button className='css-button-rounded--blue'>Edit</button></Link></td>
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
