import React, { Component } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import './Admin.css';
import Swal from 'sweetalert2';
import Admin from './admin_nav_side';
import './Admin.css';

export class adminLogin extends Component {

    constructor() {
        super()
        this.state = {
            userName: "",
            passWord: "",
            rvalues: "",
            detials: false
        }
    }



    updateValue = (event) => {
        this.setState({ [event.target.name]: [event.target.value] });

    }
    submitValues = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('userName', this.state.userName)
        formData.append('passWord', this.state.passWord)
        if (this.state.userName === '' || this.state.passWord === '') {
            Swal.fire({
                title: 'Please all fill all the details',
                icon: 'error'
            }
            )
        } else {
            axios({
                method: 'post',
                url: 'http://billing-software.dkdeepak.com/api/loginAdmin.php',
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then((response) => {
                    //handle success
                    const responsedata = response.data;
                    console.log(response.data);
                    if (responsedata === 1) {
                        window.location.reload(false);
                        localStorage.setItem('admin', true);
                        localStorage.setItem('adminName', this.state.userName);
                    } else {
                        Swal.fire({
                            title: 'Invalid Username or Password',
                            icon: 'error',

                        });
                    }

                })
        }
    }



    render() {

        return (
            <>
                <div className='login_back'>
                    <div class="login_card">
                        {!localStorage.getItem('admin') ?
                            <form >
                                <div className="logo_login">
                                </div>
                                <h3 class="login_title"> Log in</h3>
                                <p class="or"></p>
                                <div class="userName">
                                    <label for="Username"> <b>Username</b></label>
                                    <TextField variant="outlined" size='small' name="userName" onChange={this.updateValue} />
                                </div>
                                <div class="password">
                                    <label for="Password"> <b>Password</b></label>
                                    <TextField variant="outlined" size='small' name="passWord" onChange={this.updateValue} />
                                </div>
                                <div class="login-btn">
                                    <button className="css-button-rounded--blue" onClick={this.submitValues}>
                                        Login
                                    </button>
                                </div>
                            </form>
                            : <Admin />
                        }
                    </div>
                </div>

            </>

        )
    }
}

export default adminLogin
