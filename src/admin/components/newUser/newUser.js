import React, { Component } from 'react';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import './newUser.css';
import Swal from 'sweetalert2';
import {
    HiOutlineUserCircle as UserName,
    HiOutlineIdentification as BillId,
    RiLockPasswordLine as Password,
    MdOutlineMailOutline as Email,
    BiPhone as Phone,
    GrLocation as Address,
} from 'react-icons/all';

export class newUser extends Component {
    constructor() {
        super()
        this.state = {
            branchId: '',
            userName: '',
            password: '',
            email: '',
            Gst_No:'',
            phoneNo: '',
            address: '',
        }
    }

    onChangeValues = (event) => {
        this.setState({ [event.target.name]: [event.target.value] });

    }

    submitvalues = (event) => {
        var formData = new FormData();
        formData.append('branchId', this.state.branchId)
        formData.append('userName', this.state.userName)
        formData.append('password', this.state.password)
        formData.append('email', this.state.email)
        formData.append('phoneNo', this.state.phoneNo)
        formData.append('address', this.state.address)
        formData.append('Gst_No', this.state.Gst_No)
        if (this.state.branchId === '' || this.state.userName === '' || this.state.password === '' || this.state.email === '' || this.state.phoneNo === '') {
            Swal.fire({
                title: 'Please fill all the details',
                icon: 'error'
            }
            )
        } else {
            axios({
                method: 'post',
                url: 'http://billing-software.dkdeepak.com/api/addUser.php',
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(function (response) {
                    //handle success
                    const responsedata = response.data
                    if (responsedata.includes('Duplicate entry') === true) {
                        Swal.fire({
                            title: 'User already Exists',
                            icon: 'error'
                        })
                    } else {
                        Swal.fire({
                            title: 'User added Successfull',
                            icon: 'success',
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        })
                    }
                })
                .catch(function (response) {
                    //handle error
                    Swal.fire({
                        title: 'Error inserting data',
                        icon: 'error'
                    })
                });
        }

    }


    render() {
        return (
            <div className="nu_container">
                <div className='nu_sub_conatiner'>
                    <div className="nu_subHeader">
                        <h2>Create New Branch Id</h2>
                    </div>
                    <div className="nu_main">
                        <form>
                            <div>
                                <TextField
                                    label="Branch Id"
                                    id="branchId"
                                    name="branchId"
                                    onChange={this.onChangeValues}
                                    sx={{ m: 1, width: '40ch' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            <><BillId />
                                            </>
                                        </InputAdornment>,
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Username"
                                    id="userName"
                                    name="userName"
                                    onChange={this.onChangeValues}
                                    sx={{ m: 1, width: '40ch' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            <><UserName />
                                            </>
                                        </InputAdornment>,
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Password"
                                    id="password"
                                    name="password"
                                    onChange={this.onChangeValues}
                                    sx={{ m: 1, width: '40ch' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            < ><Password />
                                            </>
                                        </InputAdornment>,
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Gst No"
                                    id="Gst_No"
                                    name="Gst_No"
                                    onChange={this.onChangeValues}
                                    sx={{ m: 1, width: '40ch' }}
                                   
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Email"
                                    id="email"
                                    name="email"
                                    onChange={this.onChangeValues}
                                    sx={{ m: 1, width: '40ch' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            <><Email />
                                            </>
                                        </InputAdornment>,
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Phone Number"
                                    id="phoneNo"
                                    name="phoneNo"
                                    onChange={this.onChangeValues}
                                    sx={{ m: 1, width: '40ch' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            <><Phone />
                                            </>
                                        </InputAdornment>,
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Address"
                                    id="address"
                                    name="address"
                                    sx={{ m: 1, width: '40ch' }}
                                    multiline
                                    onChange={this.onChangeValues}
                                    rows={3}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            <><Address />
                                            </>
                                        </InputAdornment>,
                                    }}
                                /></div>
                            <div className='nu_button'>
                                <button style={{ width: "100%" }} className='css-button-rounded--blue' onClick={this.submitvalues}>
                                    Add User
                                </button>
                            </div>
                            <div className='nu_button'>
                                <Link to='/Admin/newUser/viewUsers'>

                                    <button style={{ width: "100%" }} className='css-button-rounded--green'>View Users</button>
                                </Link>

                            </div>
                        </form>
                    </div >
                </div>

            </div >
        )
    }
}

export default newUser
