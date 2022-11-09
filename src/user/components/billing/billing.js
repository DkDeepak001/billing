import React, { Component } from 'react';
import './billing.css';
import TextField from '@mui/material/TextField';
import {
    IoMdAddCircleOutline as Addicon,
    MdDelete as DeleteIcon,
    BiUpArrowAlt as Up,
    BiDownArrowAlt as Down,
    FiDownload as Download,
     FiMail as Mail

} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Swal from 'sweetalert2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { saveAs } from 'file-saver';








export class billing extends Component {

    constructor() {
        super()
        let cookieValue;
        { localStorage.getItem("cbill") == null ? cookieValue = [] : cookieValue = JSON.parse(localStorage.getItem("cbill")) }
        this.state = {
            fetchData: [],
            copyData: [],
            selectedValues: '',
            Quantity: '',
            quanunit: undefined,
            quantityPrice: 0,
            billingproducts: cookieValue,
            sortProductName: false,
            sortPrice: false,
            sortQuantity: false,
            sortTotalPrice: false,
            pageTotal: 0,
            count: 0,
            punit: '',
            stockDetial: [],
            dupData: [],
            getbillNo: '',
            arrow: 0,
            userDetails:[],
            uGst_no:""
        }
        this.getData();
        this.selectData = this.selectData.bind(this);


    }

    getData = () => {
        axios.get('https://gnindiamart.com/api/fetch.php')
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ dupData: result.data });
            })
        axios.get('https:/gnindiamart.com/api/fetchBalanceProduct.php/?branchId=' + localStorage.getItem('userName'))
            .then(result => {
                this.setState({ stockDetial: result.data })
                const pid = (this.state.stockDetial.map(x => x.Pid));
                const matchedValues = (this.state.dupData.filter(x => pid.includes(x.id)));
                this.setState({ copyData: matchedValues });
            })
            axios.get('https://gnindiamart.com/api/fetchusers.php/?branchId=' + localStorage.getItem('userName'))
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ userDetails: result.data[0] });
                this.setState({uGst_no:Object.values(this.state.userDetails)[7]});
            })
    }

    sortPrice = () => {
        this.setState({ sortPrice: !this.state.sortPrice })
        if (this.state.sortPrice == true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return a.billProductPrice - b.billProductPrice;
            }))
        } else if (this.state.sortPrice == false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return b.billProductPrice - a.billProductPrice;
            }))
        }
    }

    sortTotalPrice = () => {
        this.setState({ sortTotalPrice: !this.state.sortTotalPrice })
        if (this.state.sortTotalPrice == true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return a.billTotalPrice - b.billTotalPrice;
            }))
        } else if (this.state.sortTotalPrice == false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return b.billTotalPrice - a.billTotalPrice;
            }))
        }

    }
    sortQuantity = () => {
        this.setState({ sortQuantity: !this.state.sortQuantity })
        if (this.state.sortQuantity == true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return a.billQuantity - b.billQuantity;
            }))
        } else if (this.state.sortQuantity == false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return b.billQuantity - a.billQuantity;
            }))
        }

    }
    sortName = () => {
        this.setState({ sortProductName: !this.state.sortProductName });
        if (this.state.sortProductName == true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return a.billProductName.localeCompare(b.billProductName)
            }))
        } else if (this.state.sortProductName == false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return b.billProductName.localeCompare(a.billProductName)
            }))
        }
    }

    searchBar = (event) => {
        var output = this.state.copyData.filter(x => x.productName.includes((event.target.value).toLowerCase()));
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
        this.setState({ selectedValues: event.target.value });
        const searchBar = document.getElementById('searchBar');
        const searchResult = document.getElementById('searchResult');
        if (event.target.value != '') {
            searchResult.style.display = "block";
        } else {
            searchResult.style.display = "none";
        }
        this.setState({ arrow: 0 })
    }

    selectData(id, productName) {
        var output = this.state.copyData.filter(x => x.productName.includes(productName));
        this.setState({ fetchData: output });
        this.setState({ selectedValues: productName }, () => {

        });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";


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

    calculatePrice = (event) => {
        let arr = [];
        if (this.state.quanunit === undefined) {
            arr = [];
            arr.push(parseInt(document.getElementById('punit').childNodes[0].value));
        } else {
            arr = [];
            arr.push(this.state.quanunit);
        }
        this.setState({ quanunit: parseInt(arr[0]) }, () => {
            if (this.state.quanunit === 1) {
                const getQuantity = event.target.value;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'kg' })
            }
            else if (this.state.quanunit === 2) {
                const getQuantity = event.target.value;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'liter' })
            }
            else if (this.state.quanunit === 3) {
                const getQuantity = event.target.value;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const gramPrice = (fetchPrice / 1000);
                const quantityPrice = parseInt(getQuantity * gramPrice);
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'g' })
            } else if (this.state.quanunit === 4) {
                const getQuantity = event.target.value;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const gramPrice = (fetchPrice / 1000);
                const quantityPrice = parseInt(getQuantity * gramPrice);
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'ml' })
            } else if (this.state.quanunit === 5) {
                const getQuantity = event.target.value;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'pkt' })
            }
        });


    }

    alertMsg = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this product!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
            this.deleteRow(index);
        })
    }
    deleteRow = (index) => {
        const FName = this.state.billingproducts[index].billProductName;
        const Pquantity = this.state.billingproducts[index].billQuantity;
        const punit = this.state.billingproducts[index].billUnits;
        const BName = this.state.stockDetial.map(x => x.productName);
        const i = BName.indexOf(FName);
        const data = this.state.stockDetial[i];
        if (punit === 'kg' || punit === 'liter' || punit === 'pkt') {
            const totalQ = (parseFloat(data.quantity) + parseFloat(Pquantity));
            data.quantity = totalQ;
            let allData = new FormData();
            allData.append('id', data.id);
            allData.append('quantity', data.quantity);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function (response) { })
        } else if (punit === 'g' || punit === 'ml') {
            const PCquantity = Pquantity / 1000;
            const totalQ = (parseFloat(data.quantity) + parseFloat(PCquantity));
            data.quantity = totalQ;
            let allData = new FormData();
            allData.append('id', data.id);
            allData.append('quantity', data.quantity);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function (response) { })
        }
        const copyBillingProducts = [...this.state.billingproducts];
        copyBillingProducts.splice(index, 1)
        this.setState({ billingproducts: copyBillingProducts }, function () {
            localStorage.setItem("cbill", JSON.stringify(this.state.billingproducts));
        });

    }

    addProduct = () => {
        const FName = this.state.fetchData[0].productName;
        const Pquantity = this.state.Quantity;
        const punit = this.state.punit;
        const BName = this.state.stockDetial.map(x => x.productName);
        const index = BName.indexOf(FName);
        const data = this.state.stockDetial[index];
        if (punit === 'kg' || punit === 'liter' || punit === 'pkt') {
            const totalQ = (parseFloat(data.quantity) - parseFloat(Pquantity));
            data.quantity = totalQ;
            let allData = new FormData();
            allData.append('id', data.id);
            allData.append('quantity', data.quantity);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function (response) { })
        } else if (punit === 'g' || punit === 'ml') {
            const PCquantity = Pquantity / 1000;
            const totalQ = (parseFloat(data.quantity) - parseFloat(PCquantity));
            data.quantity = totalQ;
            let allData = new FormData();
            allData.append('id', data.id);
            allData.append('quantity', data.quantity);
            axios({
                method: 'post',
                url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                data: allData,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            }).then(function (response) { })
        }



        this.setState({ count: this.state.count + 1 }, function () {
            const t = this.state.billingproducts.map((x) => (x.billTotalPrice)).reduce((a, b) => a + b, 0);
            this.setState({ pageTotal: t }, () => {
            });
        });
        if (this.state.selectedValues === '') {
            Swal.fire({
                title: 'Empty Filed?',
                icon: 'warning'
            });
        }
        else {
            axios.get('https://gnindiamart.com/api/getBillNo.php')
                .then(result => {
                    this.setState({ getbillNo: parseInt(Object.values(result.data[0])) + 1 }, function () {
                        localStorage.setItem('billNo', this.state.getbillNo);
                    });

                });
            const copyBillingProducts = [...this.state.billingproducts];
            const productId = this.state.fetchData[0].id;
            const productName = this.state.fetchData[0].productName;
            const productPrice = this.state.fetchData[0].totalPrice;
            const gst = this.state.fetchData[0].gst;
            const units = this.state.punit;
            const Quantity = this.state.Quantity;
            const OrgQty = this.state.Quantity;
            const quantityPrice = this.state.quantityPrice;
            copyBillingProducts.push({
                billProductId: productId,
                billProductName: productName,
                billQuantity: Quantity,
                billUnits: units,
                billOrgQty: OrgQty,
                billProductPrice: productPrice,
                billProductGst: gst,
                billTotalPrice: quantityPrice
            })
            this.setState({ billingproducts: copyBillingProducts }, function () {
                localStorage.setItem("cbill", JSON.stringify(this.state.billingproducts));
            });
            this.setState({ selectedValues: '' });
            const quantityInput = document.getElementById('quantityInput');
            quantityInput.value = '';
            const punit = document.getElementById('punit');
            punit.defaultvalue = 1;
            this.setState({ fetchData: [] });
            this.setState({ quantityPrice: '' });
            this.setState({ Quantity: '' });
            this.setState({ quanunit: undefined });
            const searchResult = document.getElementById('searchResult');
            searchResult.style.display = "none";
        }
    }
    updateBill = () => {

        let allData = new FormData();
        allData.append('branchId', localStorage.getItem("branchId"));
        allData.append('company_name', this.props.match.params.cName);
        allData.append('billNo', null);
        allData.append('billData', JSON.stringify(this.state.billingproducts));
        allData.append('pageTotal', this.state.pageTotal);
        allData.append('cid', localStorage.getItem("cid"));
        axios({
            method: 'post',
            url: 'https://gnindiamart.com/api/getBill.php',
            data: allData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(function (response) {
                //handle success
                const responsedata = response.data
                if (responsedata.includes('Duplicate entry') == true) {
                    Swal.fire({
                        title: 'Product already Exists',
                        icon: 'error'
                    })
                } else {
                    Swal.fire({
                        title: 'Bill Printed',
                        icon: 'success',


                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    })
                }
            })
        localStorage.removeItem("cbill");
        localStorage.removeItem("company_name");
        this.setState({ billingproducts: [] });
        this.setState({ pageTotal: 0 });
        this.setState({ selectedValues: '' });
        this.setState({ Quantity: '' });
        this.setState({ quantityPrice: 0 });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";
        window.print();
        this.props.history.push('/user');
    }
    gramPrice = (event) => {
        this.setState({ quanunit: parseInt(event.target.value) }, () => {
            if (this.state.quanunit === 1) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'kg' })
            }
            else if (this.state.quanunit === 2) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'liter' })
            } else if (this.state.quanunit === 3) {

                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const gramPrice = (fetchPrice / 1000);
                const quantityPrice = parseInt(getQuantity * gramPrice);
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'g' });

            } else if (this.state.quanunit === 4) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const gramPrice = (fetchPrice / 1000);
                const quantityPrice = parseInt(getQuantity * gramPrice);
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'ml' });
            }
            else if (this.state.quanunit === 5) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'pkt' })
            }
        })

    }
    cancelBill = () => {
        const clearData = JSON.parse(localStorage.getItem("cbill"));
        if (clearData !== null) {
            for (let index = 0; index < clearData.length; index++) {
                const FName = this.state.billingproducts[index].billProductName;
                const Pquantity = this.state.billingproducts[index].billQuantity;
                const punit = this.state.billingproducts[index].billUnits;
                const BName = this.state.stockDetial.map(x => x.productName);
                const i = BName.indexOf(FName);
                const data = this.state.stockDetial[i];
                if (punit === 'kg' || punit === 'liter' || punit === 'pkt') {
                    const totalQ = (parseFloat(data.quantity) + parseFloat(Pquantity));
                    data.quantity = totalQ;
                    let allData = new FormData();
                    allData.append('id', data.id);
                    allData.append('quantity', data.quantity);
                    axios({
                        method: 'post',
                        url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                        data: allData,
                        config: { headers: { 'Content-Type': 'multipart/form-data' } }
                    }).then(function (response) { })
                } else if (punit === 'g' || punit === 'ml') {
                    const PCquantity = Pquantity / 1000;
                    const totalQ = (parseFloat(data.quantity) + parseFloat(PCquantity));
                    data.quantity = totalQ;
                    let allData = new FormData();
                    allData.append('id', data.id);
                    allData.append('quantity', data.quantity);
                    axios({
                        method: 'post',
                        url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                        data: allData,
                        config: { headers: { 'Content-Type': 'multipart/form-data' } }
                    }).then(function (response) { })
                }
            }
        }
        localStorage.removeItem('company_name');
        localStorage.removeItem("cbill");
        this.props.history.push('/user');

    }
    confirmBill = () => {
        const subCont = document.getElementById("b_container");
        const confCont = document.getElementById("confirm_hide");
        subCont.style.display = "none";
        confCont.style.display = "block";

    }
    confirmBillBack = () => {
        const subCont = document.getElementById("b_container");
        const confCont = document.getElementById("confirm_hide");
        subCont.style.display = "block";
        confCont.style.display = "none";
    }
   

    render() {
        const x = this.state.sortProductName;
        const y = this.state.sortPrice;
        const z = this.state.sortQuantity;
        const a = this.state.sortTotalPrice;
        const company_name = (this.props.match.params.cName);
        localStorage.setItem("company_name", company_name);
        const bill = this.state.billingproducts;
        const date = new Date();
        return (
            <div>
                <div className="b_container" id="b_container">

                    <div className="b_name_header_heading">
                        <div>
                            <h1>Billing</h1>
                            <h3>Company name : {company_name}</h3>
                        </div>
                        <div>
                            <button className='css-button-rounded--red' onClick={this.cancelBill}>Cancel bill</button>
                        </div>
                    </div>
                    <div className="b_header">
                        <div className="b_subheader">
                            <h3>Product Name</h3>
                            <div>
                                <TextField id="searchBar" variant="outlined" size='small' onChange={this.searchBar} onKeyDown={this.onKeyDown} value={this.state.selectedValues} />

                                <div className='searchResult' id="searchResult" >
                                    {this.state.fetchData.length === 0 ? <p className="items">No Data Found</p> :
                                        this.state.fetchData.map((x, index) => (
                                            <p className='items ' id={(`items${index}` === `items${this.state.arrow}`) ? 'active' : ''} key={index} onClick={() => this.selectData(index, x.productName)}>{x.productName}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="b_subheader">
                            <h3>Quantity</h3>
                            <div>
                                <OutlinedInput
                                    id="quantityInput"
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{ min: "0",step: "1" }}
                                    size='small'
                                    type='number'
                                    style={{ width: 100 }}
                                    onChange={this.calculatePrice}
                                    disabled={this.state.selectedValues === '' ? true : false}
                                />

                            </div>
                        </div>
                        <div className='b_subheader'>
                            <div>
                                <select
                                    labelId="punit"
                                    id="punit"
                                    sx={{ height: 40, width: 100 }}
                                    onChange={this.gramPrice}
                                    disabled={this.state.Quantity === '' ? true : false}
                                    className='select_unit'
                                >
                                    {this.state.fetchData.map(x => (x.units) === "pkt" ? <option className='select-items' value={5} id="pkt">pkt</option> :
                                        this.state.fetchData.map(x => (x.units) === "kg" ? <option value={1} id="kg">kg</option> :
                                            <option value={2} id="liter">liter</option>))}
                                    {this.state.fetchData.map(x => (x.units) === "pkt" ? <></> :
                                        this.state.fetchData.map(x => (x.units) === "kg" ? <option value={3} id="gram">gram</option> :
                                            <option value={4} id="ml">ml</option>))}

                                </select>
                            </div>
                        </div>
                        <div className="b_subheader">
                            <h3>Price</h3>
                            <div>
                                <OutlinedInput
                                    disabled
                                    id="outlined-adornment-weight"
                                    value={this.state.fetchData.length === 1 ? this.state.quantityPrice : ''}
                                    endAdornment={<InputAdornment position="end">Rs</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    size='small'
                                    type='number'
                                    style={{ width: 100 }}
                                />
                            </div>
                        </div>
                        <div className="b_subheader">
                            <div>
                                {this.state.fetchData.length === 1 && this.state.Quantity !== "" ?
                                    <Button color="success" variant='contained' aria-label="add an alarm" size='medium' onClick={this.addProduct} >
                                        <Addicon />Add
                                    </Button> : <Button color="success" disabled variant='contained' aria-label="add an alarm" size='medium' onClick={this.addProduct} >
                                        <Addicon />Add
                                    </Button>}
                            </div>
                        </div>
                    </div>
                    <div className="b_mainwrap" style={{ margin: '2% 0%',overflow:"auto" }}>
                        <table className='table'>
                            <thead className='table_head'>
                                <tr>
                                    <th className='table_head'>Si No</th>
                                    <th className='table_head' >Product Id</th>
                                    <th className='table_head' onClick={this.sortName} >{x ? <Up size={15} /> : <Down size={15} />}Product Name</th>
                                    <th className='table_head' onClick={this.sortPrice} >{y ? <Up size={15} /> : <Down size={15} />}Product Price</th>
                                    <th className='table_head' onClick={this.sortQuantity} >{z ? <Up size={15} /> : <Down size={15} />}Quantity</th>
                                    <th className='table_head' onClick={this.sortTotalPrice} >{a ? <Up size={15} /> : <Down size={15} />}Total Price</th>
                                    <th className='table_head'></th>
                                </tr>
                            </thead>
                            <tbody className="container_table_body">
                                {this.state.billingproducts.map((row, index) => (
                                    <tr
                                        key={index + 1}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <td component="th" scope="row" style={{ border: "none" }}>
                                            {index + 1}
                                        </td>
                                        <td >PID{row.billProductId}</td>
                                        <td >{row.billProductName}</td>
                                        <td >{row.billProductPrice}</td>
                                        <td >{row.billQuantity}{row.billUnits}</td>
                                        <td >{row.billTotalPrice}</td>
                                        <td sx={{ width: 100 }}><IconButton variant="contained" size='small' color='error' onClick={() => this.alertMsg(index)} ><DeleteIcon /></IconButton></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {
                        this.state.pageTotal === 0 ? '' :
                            <div className="b_footer" id='totalPriceHTML'>
                                <Total products={this.state.billingproducts} id='totalPriceHTML' />
                                <button className='css-button-rounded--blue' type='submit' onClick={this.confirmBill}>Print</button>
                            </div>
                    }


                </div >
                {
                    bill === null ? <></> :
                        <div className='pageToPrint'>
                            <div className="printHeader" style={{ borderTop: "1px soild black", borderBottom: '1px solid black', padding: "1% 0%" }}>
                            </div>
                            <div className="printcustomerName" style={{ borderBottom: '1px solid black', padding: ".5% 0%" }}>
                                <p>Customer Name: {company_name}</p>
                                <p>Bill Date:{(date.getDate())}/{(date.getMonth())}/{date.getFullYear()}</p>
                                <p>Bill Time:{(date.getHours())}.{(date.getMinutes())}.{date.getSeconds()}</p>
                            </div>
                            <div className='printBranchName' style={{ borderBottom: '1px solid black', padding: ".5% 0%" }}>
                                <p>Branch name:{localStorage.getItem("userName")}</p>
                                <p>Bill no:{localStorage.getItem('billNo')}</p>
                            </div>
                            <table className='printBillDetali' style={{ borderBottom: '1px solid black', padding: ".5% 0%" }}>
                                <tr className='printBillTR'>
                                    <th>Si no</th>
                                    <th>product</th>
                                    <th>Quantity</th>
                                    <th>price</th>
                                </tr>
                                {bill.map((x, index) => (
                                    <tr className='printBillTD'>
                                        <td>{index + 1}</td>
                                        <td>{x.billProductName}</td>
                                        <td>{x.billQuantity}{x.billUnits}</td>
                                        <td>{parseFloat(x.billTotalPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </table>
                            <div className='printTotal' style={{ borderBottom: '1px solid black', padding: ".5% 0%" }}>
                                <p>Includes Gst</p>
                                <h4>Total:{this.state.pageTotal}</h4>
                            </div>
                            <div className="printEnd" style={{ borderBottom: '1px solid black', padding: ".5% 0%" }}>
                                <p>Thank You! Vist Again!</p>
                            </div>
                        </div>
                }
                <div className='confirm_hide' id="confirm_hide">
                    <div className='confirmBill'>
                        <div className='confirmBill_back'>
                            <div className='confirmBill_head'>
                                <h1>Print Bill</h1>
                            </div>
                            <div className='confirmBill_menu'>
                                {/* <h4>Send Bill copy</h4> */}
                                <div className='confirmBill_menu_button'>
                                {/* <IconButton color="secondary" onClick={this.downloadPDF}>
                                    <Download style={{ color: "#4287f5" }} />
                                </IconButton>
                                    <IconButton color="secondary" onClick={this.mail}>
                                        <Mail style={{ color: "#EA4335" }} />
                                    </IconButton> */}
                                </div>
                                <div className='confirmBill_button'>
                                    <button className='css-button-rounded--blue' onClick={this.updateBill}>Print Bill</button>
                                    <button style={{ margin: "10px 0px" }} className='css-button-rounded--red' onClick={this.confirmBillBack} >Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const Total = ({ products }) => (
    <h3>
        Total:
        {
            products.reduce((sum, i) => (
                sum += i.billTotalPrice
            ), 0)}
    </h3>
)

export default billing
