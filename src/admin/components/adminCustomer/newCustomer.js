import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Swal from 'sweetalert2';
import './newCustomer.css';
import { Link } from 'react-router-dom';


export class resgister extends Component {
    constructor() {
        super();
        this.state = {
            company_name: "",
            phone_no: "",
            email: "",
            address: "",
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
            var allData = new FormData();
            allData.append('branchId', localStorage.getItem('adminName'));
            allData.append('company_name', this.state.company_name);
            allData.append('phone_no', this.state.phone_no);
            allData.append('email', this.state.email);
            allData.append('address', this.state.address);
            allData.append('Gst_no', this.state.Gst_no);
            axios({
                method: 'post',
                url: 'http://billing-software.dkdeepak.com/api/addNewAdminCustome.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(function (response) {
                    //handle success
                    const responsedata = response.data
                    if (responsedata.includes('Duplicate entry') === true) {
                        Swal.fire({
                            title: 'Company already Exists',
                            icon: 'error'
                        })
                    } else {

                        Swal.fire({
                            title: 'User Added',
                            icon: 'success',
                            showConfirmButton: true,
                            confirmButtonText: 'Ok'

                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        })
                    }
                })
            this.setState({ company_name: '' })
            this.setState({ phone_no: '' })
            this.setState({ email: '' })
            this.setState({ address: '' })
            this.setState({ Gst_no: '' })
        }
    }

    render() {
        return (
            <div className='Areg_container' id="Areg_container">
                <div className='Areg_background' id="Areg_background">
                    <div className='Areg_header_name'>
                        <h2>Register new company</h2>
                    </div>
                    <div>
                        <form className='Areg_form'>
                            <div className='Areg_grp'>
                                <TextField id="company_name" value={this.state.company_name} name="company_name" label="company name" variant="outlined" required onChange={this.changeValue} />
                            </div>
                            <div className='Areg_grp'>
                                <TextField id="phone_no" value={this.state.phone_no} name="phone_no" label="Phone number" variant="outlined" required onChange={this.changeValue} type="number" inputProps={{ min: "0", step: "1" }}
                                />
                            </div>
                            <div className='Areg_grp'>
                                <TextField id="email" value={this.state.email} name="email" label="email" variant="outlined" required onChange={this.changeValue} />
                            </div>
                            <div className='Areg_grp'>
                                <TextField id="address" value={this.state.address} name="address" label="Address" variant="outlined" multiline maxRows={4} onChange={this.changeValue} />
                            </div>
                            <div className='Areg_grp'>
                                <TextField id="Gst_no" value={this.state.Gst_no} name="Gst_no" label="Gst no" variant="outlined" onChange={this.changeValue} />
                            </div>
                            <div className='Areg_grp_button'>
                                <button type="submit" className='css-button-rounded--blue' onClick={this.submitValues} >Add Customer</button>
                            </div>
                            <div className='Areg_grp_button'>
                                <Link to="/Admin/viewCustomer">
                                <button className='css-button-rounded--green'  >View Customer</button>
                                </Link>
                            </div>
                        </form>
                    </div ></div>
            </div >
        )
    }
}

export default resgister
