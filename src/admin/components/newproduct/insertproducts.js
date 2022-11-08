import React, { Component } from 'react'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Swal from 'sweetalert2';
import './insertproduct.css';



const Input = styled('input')({
    display: 'none',
});

export class insertproducts extends Component {
    constructor() {
        super()
        this.state = {
            productName: '',
            productPrice: 0,
            gst: '',
            units: 'kg',
            totalPrice: '',
            desc: '',

        }
    }

    uservalue = (event) => {
        this.setState({
            [event.target.name]: [event.target.value]
        }, () => {

            this.totalPrice();
        });
    }
    onselectchange = (event) => {

        this.setState({
            units: event.target.value
        }, () => {

            this.totalPrice();
        })
    }
    componentDidMount() {
        this.totalPrice();
    }

    totalPrice = (event) => {
        if (this.state.gst === "") {
            this.setState({ gst: 0 });
        }

        const currentPrice = this.state.productPrice;
        const currentgst = this.state.gst;
        const gstprice = (currentPrice * currentgst) / 100;
        const newtotalprice = parseFloat(this.state.productPrice) + parseFloat(gstprice);
        console.log(currentPrice)
        console.log(currentgst)
        console.log(gstprice)
        console.log(newtotalprice)
        this.setState({
            totalPrice: newtotalprice
        })
    }


    onSubmit = (event) => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('productName', this.state.productName)
        formData.append('productPrice', this.state.productPrice)
        formData.append('gst', this.state.gst)
        formData.append('units', this.state.units)
        formData.append('totalPrice', this.state.totalPrice)
        formData.append('desc', this.state.desc)
        if (this.state.productName === '' || this.state.productPrice === '' || this.state.gst === '' || this.state.totalPrice === '') {
            Swal.fire({
                title: 'Please fill all the details',
                icon: 'error'
            })
        } else {
            this.totalPrice();
            axios({
                method: 'post',
                url: 'http://billing-software.dkdeepak.com/api/addproduct.php',
                data: formData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })
                .then(function (response) {
                    //handle success
                    const responsedata = response.data
                    if (responsedata.includes('Duplicate entry') === true) {
                        Swal.fire({
                            title: 'Product already Exists',
                            icon: 'error'
                        })
                    } else {
                        Swal.fire({
                            title: 'Product added',
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
            this.props.history.push('/Admin/new_products');
        }
        // window.location.reload(false);

    }

    render() {
        return (
            <div className="ip_container">
                <h2 className='ip_header_name'>Add new product</h2>
                <form className="ip_form" onSubmit={this.onSubmit}>
                    <div className='ip_form_gap'>
                        <TextField id="outlined-basic" 
                        type='text' 
                        label="Product Name" 
                        variant="outlined" 
                        size='small' 
                        name="productName" 
                        inputProps={{ min: "0",step: "1" }}
                        onChange={this.uservalue} />
                    </div>
                    <div className='ip_form_gap'>
                        <TextField id="outlined-basic" 
                        type='number' 
                        label="Product Price"
                        variant="outlined"
                        size='small' 
                        name="productPrice"
                        inputProps={{ min: "0",step: "1" }}
                        onChange={this.uservalue} />
                    </div>
                    <div className='ip_form_gap'>
                        <TextField id="outlined-basic" 
                        type='number' 
                        label="Gst %" 
                        variant="outlined" 
                        size='small' 
                        style={{ width: "70%" }} 
                        name="gst" 
                        inputProps={{ min: "0",step: "1" }}
                        onChange={this.uservalue} />
                    </div>
                    <div className='ip_form_gap ip_units'>
                        <label className='selectlabel'>Units</label>
                        <select size='small' name="units" onChange={this.onselectchange} value={this.state.units} className='select'>
                            <option value={'kg'} >Kg</option>
                            <option value={'liter'}>Liter</option>
                            <option value={'pkt'}>packet</option>
                        </select>
                    </div>

                    <div className='ip_form_gap'>
                        <TextField id="outlined-textarea" 
                        label="Description"
                        multiline name="desc" 
                        onChange={this.uservalue} />
                    </div>
                    <div className='ip_form_gap'>
                        <button onClick={this.onSubmit} className='css-button-rounded--blue ip_button' >
                            Add Product
                        </button>
                    </div>

                </form>
            </div >
        )
    }
}

export default insertproducts
