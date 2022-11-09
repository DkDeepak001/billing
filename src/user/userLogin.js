import React, { Component } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import Billing from './components/billing/billing';


export class adminLogin extends Component {

    constructor() {
        super()
        this.state = {
            userName: "",
            passWord: "",
            rvalues: ""
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
                url: 'https://gnindiamart.com/api/login.php',
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then((response) => {
                    //handle success
                    const responsedata = response.data;
                    console.log(response.data);
                    if (responsedata === 0) {
                        Swal.fire({
                            title: 'Invalid Username or Password',
                            icon: 'error',

                        });
                    } else {
                        localStorage.setItem('user', true);
                        localStorage.setItem('userName', this.state.userName);
                        window.location.reload(false);
                    }

                })
        }
    }



    render() {

        return (
            <div className='login_back'>
                <div class="login_card">
                    {!localStorage.getItem('user') ?
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
                        : <Billing />
                    }
                </div>
            </div>
        )
    }
}

export default adminLogin
