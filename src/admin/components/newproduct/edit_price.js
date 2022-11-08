import React from 'react'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import './edit_price.css';

export default class Edit_price extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            getData: '',
            id: '',
            productName: '',
            productPrice: '',
            units: '',
            totalPrice: '',
            gst: '',
            desc: '',
            newTotal: ''


        }
        this.totalPrice();
    }


    uservalue = (event) => {
        this.setState({
            [event.target.name]: [event.target.value]
        }, () => {

            this.totalPrice();
        })
    }
    componentDidMount() {
        axios.get('http://billing-software.dkdeepak.com/api/fetchProductData.php/?id=' + this.props.match.params.id)
            .then(result => {
                this.setState({ getData: result.data });
                this.setState({ id: this.state.getData[0].id });
                this.setState({ productName: this.state.getData[0].productName });
                this.setState({ productPrice: this.state.getData[0].productPrice });
                this.setState({ units: this.state.getData[0].units });
                this.setState({ totalPrice: this.state.getData[0].totalPrice });
                this.setState({ gst: this.state.getData[0].gst });
                this.setState({ desc: this.state.getData[0].desc });
            })

        this.totalPrice();
    }

    totalPrice = (event) => {

        const currentPrice = this.state.productPrice;
        const currentgst = this.state.gst;
        const gstprice = (currentPrice * currentgst) / 100;
        const curtotalprice = parseInt(this.state.productPrice) + parseInt(gstprice);
        this.setState({ newTotal: curtotalprice })


    }


    onSubmit = (event) => {
        event.preventDefault();
        this.totalPrice();
        console.log(this.state.units)
        var formData = new FormData();
        formData.append('id', this.state.id)
        formData.append('productName', this.state.productName)
        formData.append('productPrice', this.state.productPrice)
        formData.append('gst', this.state.gst)
        formData.append('units', (this.state.units==="")?'kg':this.state.units)
        formData.append('desc', this.state.desc)
        formData.append('totalPrice', this.state.newTotal)
        if (this.state.productName === '' || this.state.productPrice === '') {
            Swal.fire({
                title: 'Please fill all the details',
                icon: 'error'
            }
            )
        } else {
            this.totalPrice();
            axios({
                method: 'post',
                url: 'http://billing-software.dkdeepak.com/api/edit.php',
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
                            title: 'Product update',
                            icon: 'success',
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        })
                    }
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    Swal.fire({
                        title: 'Error inserting data',
                        icon: 'error'
                    })
                });
        }
        this.props.history.push('/Admin/new_products');

    }


    render() {
        return (
            <div className="ep_container" >
                <div className='ep_header'>
                    <h2>Update Product</h2>
                </div>
                <form className='ep_form'>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-basic" type='text' label="Product Name" variant="outlined" size='small' disabled name="productName" value={this.state.productName} onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-basic" 
                        inputProps={{ min: "0",step: "1" }}
                        type='text' label="Price"
                         variant="outlined" 
                        size='small'
                        name="productPrice" 
                        value={this.state.productPrice}
                        onChange={this.uservalue} /></div>
                    <div className='ep_form_gap'>
                        <label className='selectlabel'>Units</label>
                        <select size='small' name="units" className='select' value={this.state.units} onChange={this.uservalue} defaultValue='kg'>
                            <option value={'kg'} >Kg</option>
                            <option value={'liter'}>Liter</option>
                            <option value={'pkt'}>packet</option>
                        </select>
                    </div>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-basic" 
                        type='text' 
                        label="Gst %" 
                        variant="outlined" 
                        size='small' 
                        name="gst" 
                        value={this.state.gst} 
                        inputProps={{ min: "0",step: "1" }}
                        onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-textarea" label="Description" multiline name="desc" value={this.state.desc} onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <button className='css-button-rounded--blue' onClick={this.onSubmit}>Update</button>
                    </div>
                </form >
            </div >
        )
    }
}

