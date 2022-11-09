import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import './resgister.css';
import {Link} from 'react-router-dom';

export class resgister extends Component {
    constructor() {
        super();
        this.state = {
            company_name: "",
            phone_no: "",
            email: "",
            Gst_no: "",
        }
    }

    changeValue = (event) => {
        this.setState({ [event.target.name]: [event.target.value] })
    }


    submitValues = (e) => {
        e.preventDefault();
        if (this.state.company_name === "" || this.state.phone_no === "" || this.state.email === "") {
            Swal.fire({
                title: 'please fill all the details',
                icon: 'error'
            })
        } else {
            let allData = new FormData();
            allData.append('branchId', localStorage.getItem('branchId'));
            allData.append('company_name', this.state.company_name);
            allData.append('phone_no', this.state.phone_no);
            allData.append('email', this.state.email);
            allData.append('Gst_no', this.state.Gst_no);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/addNewCompany.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(function (response) {
                    //handle success
                    const responsedata = response.data
                    if (responsedata.includes('Duplicate entry') == true) {
                        Swal.fire({
                            title: 'Company already Exists',
                            icon: 'error'
                        })
                    } else {

                        Swal.fire({
                            title: 'Company Added',
                            icon: 'success',


                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        })
                    }
                })
            this.setState({ company_name: '' })
            this.setState({ phone_no: '' })
            this.setState({ email: '' })
            this.setState({ Gst_no: '' })
        }
    }

    render() {
        return (
            <div className='reg_container' id="reg_container">
                <div className='reg_background' id="reg_background">
                    <div className='reg_header_name'>
                        <h2>Register new user</h2>
                    </div>
                    <div>
                        <form className='reg_form'>
                            <div className='reg_grp'>
                                <TextField id="company_name" value={this.state.company_name} name="company_name" label="company name" variant="outlined" required onChange={this.changeValue} />
                            </div>
                            <div className='reg_grp'>
                                <TextField id="phone_no" value={this.state.phone_no} name="phone_no" label="Phone number" variant="outlined" required onChange={this.changeValue} type="number" inputProps={{ min: "0", step: "1" }}
                                />
                            </div>
                            <div className='reg_grp'>
                                <TextField id="email" value={this.state.email} name="email" label="email" variant="outlined" required onChange={this.changeValue} />
                            </div>
                            <div className='reg_grp'>
                                <TextField id="Gst_no" value={this.state.Gst_no} name="Gst_no" label="Gst no" variant="outlined" onChange={this.changeValue} />
                            </div>
                            <div className='reg_grp'>
                                <button className='css-button-rounded--blue' type="submit" variant="contained" onClick={this.submitValues} >Add Customer</button>
                            </div>
                            <div className='reg_grp'>
                                <Link to="/user/viewCustomer">
                                <button className='css-button-rounded--green'  >View Customer</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        )
    }
}

export default resgister
