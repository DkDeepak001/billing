import React, { Component } from 'react';
import './billNo.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';


export class billNo extends Component {
    constructor() {
        super()
        this.state = {
            billNo: ''
        }
    }


    setValue = (e) => {
        this.setState({ billNo: e.target.value });
    }


    submitValues = (e) => {
        if (this.state.billNo === '') {
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Invalid Bill No...',
            })
            this.setState({ billNo: '' })
        } else {

        }
    }
    render() {
        return (
            <div className='ebn_container'>
                <div className='ebn_back'>
                    <div className='ebn_header'>
                        <h2 >
                            Enter a Bill No
                        </h2>
                    </div>

                    <form className='editpage_container'>
                        <div>
                            <TextField 
                            fullWidth 
                            label="Bill No" 
                            id="fullWidth" 
                            type="number"
                            inputProps={{ min: "0",step: "1" }}
                            name='billNo' 
                            value={this.state.billNo} 
                            onChange={this.setValue} />
                        </div>
                        <div className='ebn_button'>
                            <Link to={`/user/billNo/edit/${this.state.billNo}`}>
                                <button className='css-button-rounded--blue' type='submit' onClick={this.submitValues}>Edit</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div >
        )
    }
}

export default billNo
