import React from 'react'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';


export default class Edit_price extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            getData: [],
            uid:"",
            company_name:"",
            phone_no:"",
            email:'',
            address:'',
            Gst_no:'',
            old_company_name:''
        }
    }

    uservalue = (event) => {
        this.setState({
            [event.target.name]: [event.target.value]
        }, () => {

        })
    }
    componentDidMount() {
        axios.get('http://billing-software.dkdeepak.com/api/getAdminCustomer.php/?uid=' + this.props.match.params.id)
            .then(result => {
                this.setState({ getData: result.data });
                this.setState({ uid: result.data[0].uid });
                this.setState({ company_name: result.data[0].company_name });
                this.setState({ old_company_name: result.data[0].company_name });
                this.setState({ phone_no: result.data[0].phone_no });
                this.setState({ email: result.data[0].email });
                this.setState({ address: result.data[0].address });
                this.setState({ Gst_no: result.data[0].Gst_no });
               
            })

    }

    onSubmit = (event) => {
  
        var formData = new FormData();
        formData.append('uid', this.state.uid)
        formData.append('company_name', this.state.company_name)
        formData.append('old_company_name', this.state.old_company_name)
        formData.append('phone_no', this.state.phone_no)
        formData.append('email', this.state.email)
        formData.append('Gst_no', this.state.Gst_no)
        formData.append('address', this.state.address)
        if (this.state.company_name === '' || this.state.email === ''|| this.state.phone_no === '') {
            Swal.fire({
                title: 'Please fill all the details',
                icon: 'error'
            }
            )
        } else {
            axios({
                method: 'post',
                url: 'http://billing-software.dkdeepak.com/api/editCustomer.php',
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
                            title: 'Customer Detail updated',
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
        this.props.history.push('/Admin/viewCustomer');

    }


    render() {
        return (
            <div className="ep_container" >
                <div className='ep_header'>
                    <h2>Update Company</h2>
                </div>
                <form className='ep_form'>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-basic" type='text' label="Company Name" variant="outlined" size='small' name="company_name" value={this.state.company_name} onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-basic" type='text' label="Phone No" variant="outlined" size='small' name="phone_no" value={this.state.phone_no} onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-basic" type='text' label="Email" variant="outlined" size='small' name="email" value={this.state.email} onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-basic" type='text' label="Gst_no" variant="outlined" size='small' name="Gst_no" value={this.state.Gst_no} onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <TextField id="outlined-textarea" label="Address" multiline name="address" value={this.state.address} onChange={this.uservalue} />
                    </div>
                    <div className='ep_form_gap'>
                        <button className='css-button-rounded--blue' onClick={this.onSubmit}>Update</button>
                    </div>
                </form >
            </div >
        )
    }
}

