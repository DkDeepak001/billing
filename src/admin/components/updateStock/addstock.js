import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import {BiSearchAlt as Search,} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import './addstock.css';
import Swal  from 'sweetalert2';

export class stockBranchWise extends Component {
    constructor() {
        super();
        this.state = {
            stockDetails: [],
            copyDataStockDetails:[],
            getData: [],
            rawData: [],
            dupData: [],
            copyData: [],
            ProductName:"",
            productId:"",
            ProductQuantity:0,
            fetchData:[],
            selectedValues:"",
            selectedUnits:"",
            
        }
    }
    componentDidMount() {
        axios.get('http://billing-software.dkdeepak.com/api/fetchBalanceProduct.php/?branchId=' + this.props.match.params.branchId)
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ stockDetails: result.data });
                this.setState({ copyDataStockDetails: result.data });
            })
            axios.get('http://billing-software.dkdeepak.com/api/fetch.php')
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ copyData: result.data })
            });
      
    }
    searchBar = (event) => {
        var output = this.state.copyData.filter(x => x.productName.includes((event.target.value).toLowerCase()));
        this.setState({ fetchData: output }, function () {
            console.log(this.state.fetchData)
            const h = this.state.fetchData.length;
            if (h <= 3) {
                searchResult.style.height = "120px";
            }
            if (h <= 2) {
                searchResult.style.height = "80px";
            }
            if (h <= 1) {
                searchResult.style.height = "40px";
            }
            if (h >= 4) {
                searchResult.style.height = "160px";
            }
        }
        );
        this.setState({ selectedValues: event.target.value });
        const searchBar = document.getElementById('searchBar');
        const searchResult = document.getElementById('searchResult');
        if (event.target.value != '') {
            searchResult.style.display = "block";
        } else {
            searchResult.style.display = "none";
            this.setState({ fetchData: [] });
            this.setState({ wholesalePrice: '' });

        }
        this.setState({ arrow: 0 })

    }
    
    selectData(id, productName) {
        var output = this.state.copyData.filter(x => (x.productName === productName));
        this.setState({ fetchData: output }, () => { console.log()});
        this.setState({ selectedUnits: this.state.fetchData[0].units }, () => { console.log()});
        this.setState({ selectedValues: productName }, () => {
            const searchResult = document.getElementById('searchResult');
            searchResult.style.display = "none";
            this.setState({ wholesalePrice: this.state.fetchData.filter(x => (x.productName === this.state.selectedValues)).map(x => x.totalPrice) })
            this.setState({ withoutgst: this.state.fetchData.filter(x => (x.productName === this.state.selectedValues)).map(x => x.totalPrice) })
        });

    }

    onKeyDown = (e) => {
        const searchResult = document.getElementById('searchResult');
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.productName.includes(e.target.value));
            this.setState({ fetchData: output }, function () {
                const h = this.state.fetchData.length;
                if (h <= 3) {
                    searchResult.style.height = "120px";
                }
                if (h <= 2) {
                    searchResult.style.height = "80px";
                }
                if (h <= 1) {
                    searchResult.style.height = "40px";
                }
                if (h >= 4) {
                    searchResult.style.height = "160px";
                }
            }
            );
        }
        if (e.keyCode === 38) {
            if (this.state.arrow > 0) {
                this.setState({ arrow: this.state.arrow - 1 }, () => {
                    searchResult.scrollTo(0, searchResult.scrollTop - 40);
                })
            }
        }
        if (e.keyCode === 40) {
            if (this.state.arrow < (this.state.fetchData.length - 1)) {
                if (searchResult.scrollTop >= 3) {
                    searchResult.scrollTo(0, searchResult.scrollTop + 40);
                } else {
                    searchResult.scrollTo(0, searchResult.scrollTop + 2);
                }
                this.setState({ arrow: this.state.arrow + 1 }, () => {
                })
            }
        }
        if (e.keyCode === 13) {
            var output = this.state.fetchData[this.state.arrow];
            if (output !== undefined) {
                this.selectData(this.state.arrow, (output.productName));
            }

        }


    }

    searchBarBill = (event) => {

        var output = this.state.copyData.filter(x => x.billNo.startsWith(event.target.value))
        this.setState({ dupData: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })


    }
    onKeyDownBill = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.billNo.startsWith(e.target.value))
             this.setState({ dupData: output });
       }
    }

    
    searchBarProduct = (event) => {

        var output = this.state.copyDataStockDetails.filter(x => x.productName.includes(event.target.value))
        this.setState({ stockDetails: output });
        if (event.target.value === '') {
        } else if (output.length === 0) {

        }
        this.setState({ arrow: 0 })


    }
    onKeyDownProduct = (e) => {
        if (e.keyCode === 8) {
            var output = this.state.copyDataStockDetails.filter(x => x.productName.includes(e.target.value))
            this.setState({ stockDetails: output });
       }
    }
    popup=()=>{
        const showPopup = document.getElementById('popUp-add-stock');
        showPopup.style.display="flex";
        const hideBg = document.getElementById('main-bcpa-container');
        hideBg.style.display="none";
    }
    hidePopUp=()=>{
        const showPopup = document.getElementById('popUp-add-stock');
        showPopup.style.display="none";
        const hideBg = document.getElementById('main-bcpa-container');
        hideBg.style.display="block";
    }
    uservalue=(event)=>{
        this.setState({[event.target.name]:[event.target.value]});
    }
    addStocktoDbd=()=>{
        this.setState({ productId: this.state.fetchData[0].id },()=>{
           
            
            var formData = new FormData();
            formData.append('productId', this.state.productId)
            formData.append('productName', this.state.selectedValues)
            formData.append('productQuantity', this.state.ProductQuantity)
            formData.append('procuctUnits', this.state.selectedUnits)
            formData.append('branchId', this.props.match.params.branchId)
            if (this.state.productName === '' || this.state.ProductQuantity === '') {
                Swal.fire({
                    title: 'Please fill all the details',
                    icon: 'error'
                })
            } else {
                axios({
                    method: 'post',
                    url: 'http://billing-software.dkdeepak.com/api/waitingstock.php',
                    data: formData,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                })
                .then(function (response) {
                    //handle success
                    const responsedata = response.data
                    if (responsedata.includes('Duplicate entry') === true) {
                        Swal.fire({
                            title: 'Product added',
                            icon: 'success',
                            
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
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
                this.setState({selectedValues:""})
                this.setState({ProductQuantity:""})
                document.getElementById('quantity').value="";
                this.hidePopUp();
            }
        });
        }
        
        render() {
            return (
                <div className='bcpa_container'>
                <div className='main-bcpa-container' id='main-bcpa-container'>
                <div className='bcpa_header'>
                <h2>Bill copy &#38; Product Analytics of {this.props.match.params.branchId}</h2>
                
                </div>
                <div className='bcpa_main'>
                <div className='bcpa_right'style={{width:"100%"}}>
                <div className='' >
                <div className='bcpa_right_mainHead'  style={{margin:"1% auto"}}>
                <h2> Balance Stock </h2>
                <TextField
                label="Search"
                id="Search"
                sx={{ m: 1, width: '20ch' }}
                                placeholder='Search product'
                                onChange={this.searchBarProduct}
                                onKeyDown={this.onKeyDownProduct}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                            />
                            <button className='css-button-rounded--green' onClick={this.popup}>Add stock</button>
                            </div>
                            <div style={{ overflowX: 'auto' }} >
                                <table className='table'>
                                    <thead className='table1_head'>
                                        <tr>
                                            <th className='table1_head' >SI no</th>
                                            <th className='table1_head' >Product Name</th>
                                            <th className='table1_head' >Available Quantity</th>
                                            <th className='table1_head' >Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id='container_table_body' >
                                        {this.state.stockDetails.length===0?<td>NO Data Found</td>:
                                            this.state.stockDetails.map((x, index) =>
                                            <tr style={{ margin: "20%" }}>
                                                <td >{index + 1}</td>
                                                <td >{x.productName}</td>
                                                <td >{x.quantity} {x.units}</td>
                                                <Link to={`/Admin/stockUpdate/${this.props.match.params.branchId}/${x.Pid}`}>
                                                    <td ><button className='css-button-rounded--blue' style={{ minHeight: 0, minWidth: 0 }}>Analytics</button></td>
                                                </Link>

                                            </tr>

                                        )}

                                    </tbody>
                                </table>
                            </div >
                        </div>
                    </div >
                </div >
                </div>
                <div className='popUp-add-stock' id='popUp-add-stock' style={{position:"relative"}}>
                        <div className='popup-bg'>
                            <button onClick={this.hidePopUp} className='css-button-rounded--red' style={{padding:".5%",minWidth:0,minHeight:0,position:"relative"}}>X</button>
                            <h2 style={{padding:"5% 0%"}}>Your are adding stock to {this.props.match.params.branchId}</h2>
                            <div className='popUp-add-stock-form'>
                                <div className='' style={{padding:"10px 0%"}}>
                                <div>
                                   <TextField id="searchBar"  label="Product_Name"  variant="outlined" size='small' onChange={this.searchBar} onKeyDown={this.onKeyDown} value={this.state.selectedValues} />
                                        <div className='wholesale_searchResult' id="searchResult" >
                                            {this.state.fetchData.length === 0 ? <p className="items">No Data Found</p> :
                                                this.state.fetchData.map((x, index) => (
                                                    <p className='items' id={(`items${index}` === `items${this.state.arrow}`) ? 'active' : ''} key={x.id} onClick={() => this.selectData(x.id, x.productName)}>{x.productName}</p>

                                                ))}
                                        </div>
                                   </div>
                                </div>
                                <div className='' style={{padding:"10px 0%"}}>
                                    <TextField 
                                    id="quantity" 
                                    type='number' 
                                    label="Product_Quantity" 
                                    variant="outlined" 
                                    size='small' 
                                    name="ProductQuantity" 
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{this.state.selectedUnits}</InputAdornment>,
                                      }}
                                    inputProps={{ min: "0",step: "1" }}
                                    onChange={this.uservalue} 
                                    />
                                </div>
                                
                                <button className='css-button-rounded--green' onClick={this.addStocktoDbd}>Add Stock</button>
                            </div>
                        </div>
                </div>
            </div >
        )
    }
}

export default stockBranchWise
