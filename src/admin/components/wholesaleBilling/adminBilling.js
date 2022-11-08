import React, { Component } from 'react';
import './wholesalebilling.css';
import TextField from '@mui/material/TextField';
import {IoMdAddCircleOutline as Addicon,MdDelete as DeleteIcon,BiUpArrowAlt as Up,BiDownArrowAlt as Down} from 'react-icons/all';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

export class billing extends Component {

    constructor() {
        super()
        var cookieValue;
        { localStorage.getItem("bill") === null ? cookieValue = [] : cookieValue = JSON.parse(localStorage.getItem("bill")) }
        this.state = {
            fetchData: [],
            copyData: [],
            selectedValues: '',
            wholesalePrice: 0,
            Quantity: '',
            quanunit: undefined,
            gstType: true,
            gstPercentage: 0,
            GstValueinPer: 0,
            quantityPrice: 0,
            billingproducts: cookieValue,
            pageTotal: 0,
            count: 0,
            punit: '',
            getbillNo: '',
            description: '',
            tandc: '',
            advancePayment: 0,
            balancePayment: 0,
            company_name: '',
            GstPrice: 0,
            withoutgst: 0,
            TotalGst: 0,
            customerGst: [],
            arrow: 0,
            sortPid:false,
            sortProductName:false,
            sortProductPrice:false,
            sortProductGst:false,
            sortProductWholesalePrice:false,
            sortProductQuantity:false,
            sortProductTotal:false,
        }
        this.getData();
        this.selectData = this.selectData.bind(this);
    }

    getData = () => {
        axios.get('http://billing-software.dkdeepak.com/api/fetch.php')
            .then(result => {
                this.setState({ copyData: result.data })
            });
        console.log(typeof (localStorage.getItem('cid')))
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
            this.setState({ fetchData: [] });
            this.setState({ wholesalePrice: '' });

        }
        this.setState({ arrow: 0 })

    }


    selectData(id, productName) {
        var output = this.state.copyData.filter(x => (x.productName === productName));
        this.setState({ fetchData: output }, () => { console.log(this.state.fetchData.map(x => x.units === "kg" ? true : false)) });
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

    calculatePrice = (event) => {
        var arr = [];
        if (this.state.quanunit === undefined) {
            arr = [];
            arr.push(parseInt(document.getElementById('punit').childNodes[0].value));
        } else {
            arr = [];
            arr.push(this.state.quanunit);
        }
        console.log(this.state.quanunit)
        this.setState({ quanunit: parseInt(arr[0]) }, () => {
            if (this.state.quanunit === 1) {
                const getQuantity = parseInt(event.target.value);
                const fetchPrice = this.state.wholesalePrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
            } else if (this.state.quanunit === 2) {
                const getQuantity = parseInt(event.target.value);
                const fetchPrice = this.state.wholesalePrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'liter' }, () => { console.log(this.state.punit) })
            }
            else if (this.state.quanunit === 3) {
                const getQuantity = parseInt(event.target.value);
                const fetchPrice = this.state.wholesalePrice;
                const gramPrice = parseFloat(fetchPrice / 1000);
                const quantityPrice = getQuantity * gramPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
            } else if (this.state.quanunit === 4) {
                const getQuantity = parseInt(event.target.value);
                const fetchPrice = this.state.wholesalePrice;
                const gramPrice = parseFloat(fetchPrice / 1000);
                const quantityPrice = getQuantity * gramPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
            }
            else if (this.state.quanunit === 5) {
                const getQuantity = parseInt(event.target.value);
                const fetchPrice = this.state.wholesalePrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
            }
        })

    }

    alertMsg = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this product",
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
                this.deleteRow(index);
            }
        })
    }
    deleteRow = (index) => {
        const copyBillingProducts = [...this.state.billingproducts];
        copyBillingProducts.splice(index, 1)
        this.setState({ billingproducts: copyBillingProducts }, function () {
            localStorage.setItem("bill", JSON.stringify(this.state.billingproducts));
        });
    }

    addProduct = () => {
        this.setState({ count: this.state.count + 1 }, function () {
            const t = this.state.billingproducts.map((x) => (x.billTotalPrice)).reduce((a, b) => a + b, 0);
            this.setState({ pageTotal: parseFloat(t).toFixed(2) }, () => {
                this.setState({ balancePayment: this.state.pageTotal });
            });
        });
        this.setState({ count: this.state.count + 1 }, function () {
            const t = this.state.billingproducts.map((x) => (x.billProductGst)).reduce((a, b) => a + b, 0);
            const GstAvg = t / (this.state.billingproducts.length);
            this.setState({ TotalGst: GstAvg }, function () { })
        });
        if (this.state.selectedValues === '') {
            Swal.fire({
                title: 'Empty Filed?',
                icon: 'warning'
            });
        }
        else {
            axios.get('http://billing-software.dkdeepak.com/api/getBillNo.php')
                .then(result => {
                    this.setState({ getbillNo: parseInt(Object.values(result.data[0])) + 1 }, function () {
                        localStorage.setItem('billNo', this.state.getbillNo);
                    });

                });
            const copyBillingProducts = [...this.state.billingproducts];
            const productId = this.state.fetchData[0].id;
            const productName = this.state.fetchData[0].productName;
            const productPrice = this.state.fetchData[0].totalPrice;
            const wholesalePrice = this.state.wholesalePrice;
            const gst = this.state.GstValueinPer;
            const units = this.state.punit;
            const Quantity = this.state.Quantity;
            const quantityPrice = this.state.quantityPrice;
            copyBillingProducts.push({
                billProductId: productId,
                billProductName: productName,
                billQuantity: Quantity,
                billUnits: units,
                billProductPrice: wholesalePrice,
                billProductGst: gst,
                billTotalPrice: quantityPrice
            })
            this.setState({ billingproducts: copyBillingProducts }, function () {
                localStorage.setItem("bill", JSON.stringify(this.state.billingproducts));
            });
            this.setState({ selectedValues: '' });
            const quantityInput = document.getElementById('quantityInput');
            quantityInput.value = '';
            this.setState({ fetchData: [] });
            this.setState({ quantityPrice: '' });
            this.setState({ Quantity: '' });
            this.setState({ wholesalePrice: '' });
            this.setState({ withoutgst: 0 });
            this.setState({ gstType: true });
            this.setState({ GstValueinPer: 0 }, () => { console.log(this.state.GstValueinPer) });
            this.setState({ quanunit: undefined });
            const searchResult = document.getElementById('searchResult');
            searchResult.style.display = "none";
            const GstType = document.getElementById('gstType');
            GstType.value = 1;
            const priceInput = document.getElementById('priceInput');
            priceInput.value = '';
        }
    }
    updateBill = () => {
        var allData = new FormData();
        allData.append('branchId', localStorage.getItem('adminName'));
        allData.append('company_name', this.props.match.params.cmpName);
        allData.append('billNo', this.state.getbillNo);
        allData.append('billData', JSON.stringify(this.state.billingproducts));
        allData.append('Desc', this.state.description);
        allData.append('tandc', this.state.tandc);
        allData.append('advancePayment', this.state.advancePayment);
        allData.append('balancePayment', this.state.balancePayment);
        allData.append('pageTotal', this.state.pageTotal);
        allData.append('cid', localStorage.getItem('cid'));
        axios({
            method: 'post',
            url: 'http://billing-software.dkdeepak.com/api/getAdminBill.php',
            data: allData,
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
                        title: 'Successfully Billed',
                        icon: 'success',
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    })
                }
            })
        localStorage.removeItem("bill");
        localStorage.removeItem("company_name");
        this.setState({ billingproducts: [] });
        this.setState({ pageTotal: 0 });
        this.setState({ selectedValues: '' });
        this.setState({ Quantity: '' });
        this.setState({ quantityPrice: 0 });
        this.setState({ description: '' });
        this.setState({ tandc: '' });
        this.setState({ advancePayment: 0 });
        this.setState({ balancePayment: 0 });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";
        const quantityInputv = document.getElementById('quantityInput');
        quantityInputv.value = '';
        window.print();
        this.props.history.push('/Admin/billingName');
    }

    gramPrice = (event) => {
        this.setState({ quanunit: parseInt(event.target.value) }, () => {
            if (this.state.quanunit === 1) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.wholesalePrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
            }
            else if (this.state.quanunit === 2) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.wholesalePrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'liter' }, () => { console.log(this.state.punit) })
            } else if (this.state.quanunit === 3) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.wholesalePrice;
                const gramPrice = parseFloat(fetchPrice / 1000);
                const quantityPrice = getQuantity * gramPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
            } else if (this.state.quanunit === 4) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.wholesalePrice;
                const gramPrice = parseFloat(fetchPrice / 1000);
                const quantityPrice = getQuantity * gramPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
            } else if (this.state.quanunit === 5) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.wholesalePrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
            }
        })

    }
    defineGst = (event) => {
        if (parseInt(event.target.value) === 1) {
            this.setState({ gstType: true });
            this.setState({ wholesalePrice: this.state.withoutgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            })
        } else if (parseInt(event.target.value) === 2) {
            this.setState({ gstType: false });

        }
    }
    addNewProductDB = () => {
        var formData = new FormData();
        formData.append('productName', this.state.selectedValues);
        axios({
            method: 'post',
            url: 'http://billing-software.dkdeepak.com/api/addproduct.php',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
        this.getData();
        this.refreshNewData(this.state.selectedValues);
    }
    refreshNewData = (productName) => {
        axios.get('http://billing-software.dkdeepak.com/api/fetch.php')
            .then(result => {
                this.setState({ copyData: result.data }, function () {
                    var output = this.state.copyData.filter(x => x.productName.includes(productName));
                    this.setState({ fetchData: output });

                });
            })

    }
    Price = (event) => {
        this.setState({ withoutgst: event.target.value });
        if (this.state.wholesalePrice === 0) {
            this.setState({ wholesalePrice: event.target.value }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = event.target.value;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (this.state.wholesalePrice !== 0) {
            this.setState({ wholesalePrice: event.target.value }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = event.target.value;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
            if (this.state.gstPercentage === 1) {
                const GstValue = 0;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 2) {
                const GstValue = 0;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 3) {
                const GstValue = 0;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 4) {
                const GstValue = 0.25;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 5) {
                const GstValue = 0.25;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 6) {
                const GstValue = 3;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 7) {
                const GstValue = 3;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 8) {
                const GstValue = 5;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 9) {
                const GstValue = 5;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 10) {
                const GstValue = 12;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 11) {
                const GstValue = 12;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 12) {
                const GstValue = 18;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 13) {
                const GstValue = 18;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 14) {
                const GstValue = 28;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            } else if (this.state.gstPercentage === 15) {
                const GstValue = 28;
                const totalgstPrice = (event.target.value * GstValue) / 100;
                const addedgst = parseFloat(totalgstPrice) + parseInt(event.target.value);
                this.setState({ wholesalePrice: addedgst });
                this.setState({ GstValueinPer: GstValue })
            }


        }

    }
    fillBill = (event) => {
        this.setState({ [event.target.name]: [event.target.value] });

    }
    addBreakpoint = (e) => {
        // if (e.keyCode === 13) {
        //     console.log((this.state.description).concat("\n"));
        //     this.setState({ description: this.state.description + "\n" }, () => { console.log(this.state.description) });
        // }
    }
    addGst = (event) => {
        const GST = parseInt(event.target.value);
        this.setState({ gstPercentage: parseInt(event.target.value) });
        if (parseInt(event.target.value) === 1) {
            const GstValue = 0;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 2) {
            const GstValue = 0;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 3) {
            const GstValue = 0;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 4) {
            const GstValue = 0.25;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 5) {
            const GstValue = 0.25;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 6) {
            const GstValue = 3;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }

            });
        } else if (parseInt(event.target.value) === 7) {
            const GstValue = 3;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 8) {
            const GstValue = 5;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }

            });
        } else if (parseInt(event.target.value) === 9) {
            const GstValue = 5;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 10) {
            const GstValue = 12;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 11) {
            const GstValue = 12;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 12) {
            const GstValue = 18;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 13) {
            const GstValue = 18;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 14) {
            const GstValue = 28;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        } else if (parseInt(event.target.value) === 15) {
            const GstValue = 28;
            const totalgstPrice = (this.state.withoutgst * GstValue) / 100;
            const addedgst = parseFloat(totalgstPrice) + parseInt(this.state.withoutgst);
            this.setState({ GstValueinPer: GstValue });
            this.setState({ wholesalePrice: addedgst }, function () {
                if (this.state.quanunit === 1) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'kg' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 2) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'l' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 3) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'g' }, () => { console.log(this.state.punit) })
                } else if (this.state.quanunit === 4) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const gramPrice = parseFloat(fetchPrice / 1000);
                    const quantityPrice = getQuantity * gramPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'ml' }, () => { console.log(this.state.punit) })
                }
                else if (this.state.quanunit === 5) {
                    const getQuantity = this.state.Quantity;
                    const fetchPrice = this.state.wholesalePrice;
                    const quantityPrice = getQuantity * fetchPrice;
                    this.setState({ Quantity: getQuantity });
                    this.setState({ quantityPrice: quantityPrice });
                    this.setState({ punit: 'pkt' }, () => { console.log(this.state.punit) })
                }
            });
        }
    }
    
    payment = (event) => {
        this.setState({ advancePayment: event.target.value })
        const total = this.state.pageTotal;
        const advancePayment = event.target.value;
        const bal = parseFloat(total - advancePayment).toFixed(2);
        this.setState({ balancePayment: bal });
    }
    cancelBill = () => {
        localStorage.removeItem('company_name');
        localStorage.removeItem('bill');
        this.props.history.push('/Admin/billingName');
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
   
    sortPid = () => {
        this.setState({ sortPid: !this.state.sortPid })
        if (this.state.sortPid === true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt( a.billProductId) - parseInt(b.billProductId);
            }))
        } else if (this.state.sortPid === false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt(b.billProductId) - parseInt( a.billProductId);
            }))
        }
        
    }
    sortProductName = () => {
        this.setState({ sortProductName: !this.state.sortProductName });
        if (this.state.sortProductName === true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return a.billProductName.localeCompare(b.billProductName)
            }))
        } else if (this.state.sortProductName === false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return b.billProductName.localeCompare(a.billProductName)
            }))
        }
    }
    sortProductPrice = () => {
        this.setState({ sortProductPrice: !this.state.sortProductPrice })
        if (this.state.sortProductPrice === true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt( a.billProductPrice) - parseInt(b.billProductPrice);
            }))
        } else if (this.state.sortProductPrice === false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt(b.billProductPrice) - parseInt( a.billProductPrice);
            }))
        }
        
    }
    sortProductGst = () => {
        this.setState({ sortProductGst: !this.state.sortProductGst })
        if (this.state.sortProductGst === true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt( a.billProductGst) - parseInt(b.billProductGst);
            }))
        } else if (this.state.sortProductGst === false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt(b.billProductGst) - parseInt( a.billProductGst);
            }))
        }
        
    }
    sortProductQuantity = () => {
        this.setState({ sortProductQuantity: !this.state.sortProductQuantity })
        if (this.state.sortProductQuantity === true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt( a.billQuantity) - parseInt(b.billQuantity);
            }))
        } else if (this.state.sortProductQuantity === false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt(b.billQuantity) - parseInt( a.billQuantity);
            }))
        }
        
    }
    sortProductTotal = () => {
        this.setState({ sortProductTotal: !this.state.sortProductTotal })
        if (this.state.sortProductTotal === true) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt( a.billTotalPrice) - parseInt(b.billTotalPrice);
            }))
        } else if (this.state.sortProductTotal === false) {
            this.setState(this.state.billingproducts.sort(function (a, b) {
                return parseInt(b.billTotalPrice) - parseInt( a.billTotalPrice);
            }))
        }
        
    }
    render() {
        const bill = this.state.billingproducts;
        const date = new Date();
        const company_name = (this.props.match.params.cmpName);
        localStorage.setItem("company_name", company_name);
        const a =this.state.sortPid ;
        const b =this.state.sortProductName ;
        const c =this.state.sortProductPrice ;
        const d =this.state.sortProductGst ;
        const e =this.state.sortProductWholesalePrice ;
        const f =this.state.sortProductQuantity ;
        const g =this.state.sortProductTotal ;
   
        return (
            <div className='blur_container'>
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
                    <div className="Wholesale_header">
                        <div className="wholesale_subheader">
                            <h3 className='wholesale_sub_heading'>Product Name</h3>
                            <div>
                                <TextField id="searchBar" variant="outlined" size='small' onChange={this.searchBar} onKeyDown={this.onKeyDown} value={this.state.selectedValues} />
                                <div className='wholesale_searchResult' id="searchResult" >
                                    {this.state.fetchData.length === 0 ? <p className="items">No Data Found</p> :
                                        this.state.fetchData.map((x, index) => (
                                            <p className='items' id={(`items${index}` === `items${this.state.arrow}`) ? 'active' : ''} key={x.id} onClick={() => this.selectData(x.id, x.productName)}>{x.productName}</p>

                                        ))}
                                </div>
                                {this.state.selectedValues !== '' ? <Button variant='contained' style={{ marginLeft: '10px' }} onClick={this.addNewProductDB}>Add new</Button> : <></>}
                            </div>
                        </div>
                        <div className="wholesale_subheader">
                            <h3 className='wholesale_sub_heading'>Price</h3>
                            <div>
                                <OutlinedInput
                                    id="priceInput"
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    size='small'
                                    type='number'
                                    style={{ width: 100 }}
                                    onChange={this.Price}
                                    // inputProps={{ min: "0",step: "1" }}
                                    value={this.state.selectedValues === '' ? '' : this.state.withoutgst}
                                />
                            </div>
                            {this.state.gstType === true ? <></> :
                                <OutlinedInput
                                    id="priceInput"
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    size='small'
                                    type='number'
                                    style={{ width: 100 }}
                                    onChange={this.Price}
                                    value={this.state.selectedValues === '' ? '' : this.state.wholesalePrice}
                                />}
                        </div>
                        <div className='wholesale_subheader'>
                            <h3 className='wholesale_sub_heading'>Gst type</h3>
                            <select
                                labelId="gstType"
                                id="gstType"
                                sx={{ height: 40, width: 150 }}
                                onChange={this.defineGst}
                                className='select'
                                style={{ width: 140 }}
                                disabled={this.state.selectedValues === '' ? true : false}
                                // style={{ backgroundColor: "#f2f4fb" }}

                            >
                                <option value={1} id="s">Includes Gst</option>
                                <option value={2} id="Excludes Gst">Excludes Gst</option>
                            </select>
                            {this.state.gstType === true ? <></> :
                                <>
                                    <h3 style={{ margin: " 0px 10px" }}>Gst value</h3>
                                    <select
                                        labelId="gstPercentage"
                                        id="gstPercentage"
                                        sx={{ height: 40, width: 150 }}
                                        onChange={this.addGst}
                                        className='select'
                                        style={{ width: 140 }}
                                        // style={{ backgroundColor: "#f2f4fb" }}
                                    >
                                        <option value={1} id="Exempted">Exempted 0.0%</option>
                                        <option value={2} id="GST 0.0%">GST 0.0%</option>
                                        <option value={3} id="IGST 0.0%">IGST 0.0%</option>
                                        <option value={4} id="GST 0.25%">GST 0.25%</option>
                                        <option value={5} id="IGST 0.25%">IGST 0.25%</option>
                                        <option value={6} id="GST 3.0%">GST 3.0%</option>
                                        <option value={7} id="IGST 3.0%">IGST 3.0%</option>
                                        <option value={8} id="GST 5.0%">GST 5.0%</option>
                                        <option value={9} id="IGST 5.0%">IGST 5.0%</option>
                                        <option value={10} id="GST 12.0%">GST 12.0%</option>
                                        <option value={11} id="IGST 12.0%">IGST 12.0%</option>
                                        <option value={12} id="GST 18.0%">GST 18.0%</option>
                                        <option value={13} id="IGST 18.0%">IGST 18.0%</option>
                                        <option value={14} id="GST 28.0%">GST 28.0%</option>
                                        <option value={15} id="IGST 28.0%">IGST 28.0%</option>
                                    </select>
                                </>
                            }
                        </div>
                        <div className="wholesale_subheader">
                            <h3 className='wholesale_sub_heading'>Quantity</h3>
                            <div>
                                <OutlinedInput

                                    id="quantityInput"
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    size='small'
                                    type='number'
                                    style={{ width: 100 }}
                                    onChange={this.calculatePrice}
                                    // inputProps={{ min: "0",step: "1" }}
                                    disabled={this.state.selectedValues === '' ? true : false}
                                />
                                <select
                                    labelId="punit"
                                    id="punit"
                                    sx={{ height: 40, width: 100 }}
                                    onChange={this.gramPrice}
                                    style={{ marginLeft: "10px" }}
                                    className='select'
                                    // style={{ width: 140 }}
                                    disabled={this.state.Quantity === '' ? true : false}
                                    // style={{ backgroundColor: "#f2f4fb" }}

                                >
                                    {this.state.fetchData.map(x => (x.units) === "pkt" ? <option value={5} id="pkt">pkt</option> :
                                        this.state.fetchData.map(x => (x.units) === "kg" ? <option value={1} id="kg">kg</option> :
                                            this.state.fetchData.map(x => (x.units) === "liter" ? <option value={2} id="liter">liter</option> :
                                                <>
                                                    <option value={5} id="pkt">pkt</option>
                                                    <option value={1} id="kg">kg</option>
                                                    <option value={2} id="liter">liter</option>
                                                </>)))}
                                    {this.state.fetchData.map(x => (x.units) === "pkt" ? <></> :
                                        this.state.fetchData.map(x => (x.units) === "kg" ? <option value={3} id="gram">gram</option> :
                                            this.state.fetchData.map(x => (x.units) === "liter" ? <option value={4} id="ml">ml</option> :
                                                <>
                                                    <option value={3} id="gram">gram</option>
                                                    <option value={4} id="ml">ml</option>
                                                </>
                                            )))}


                                </select>
                            </div>
                        </div>

                        <div className="wholesale_subheader">
                            <h3 className='wholesale_sub_heading'>Total Price</h3>
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
                        <div className="wholesale_subheader">
                            <div className='wholesale_sub_heading' v>
                                <Button color="success" variant='contained' aria-label="add an alarm" size='medium' onClick={this.addProduct} >
                                    <Addicon />Add
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="b_mainwrap" style={{ overflowX: "auto", margin: "2% 0%" }}>
                        <table className='table'>
                            <thead className='table_head'>
                                <tr>
                                    <th className='table_head' >Si No</th>
                                    <th className='table_head'  onClick={this.sortPid} >{a? <Up size={15} /> : <Down size={15} />}Product Id</th>
                                    <th className='table_head'  onClick={this.sortProductName} >{b? <Up size={15} /> : <Down size={15} />}Product Name</th>
                                    <th className='table_head'  onClick={this.sortProductPrice} >{c? <Up size={15} /> : <Down size={15} />}Product Price</th>
                                    <th className='table_head'  onClick={this.sortProductGst} >{d? <Up size={15} /> : <Down size={15} />}GST %</th>
                                    <th className='table_head'  onClick={this.sortProductQuantity} >{f? <Up size={15} /> : <Down size={15} />}Quantity</th>
                                    <th className='table_head'  onClick={this.sortProductTotal} >{g? <Up size={15} /> : <Down size={15} />}Total Price</th>
                                    <th className='table_head' ></th>
                                </tr>
                            </thead>
                            <tbody id="container_table_body">
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
                                        <td >{row.billProductGst}%</td>
                                        <td >{row.billQuantity}{row.billUnits}</td>
                                        <td >{row.billTotalPrice}</td>
                                        <td  sx={{ width: 100 }}><IconButton variant="contained" size='small' color='error' onClick={() => this.alertMsg(index)} ><DeleteIcon /></IconButton></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                    {this.state.pageTotal === 0 ? '' :
                        <div div className='tht'>
                            <div className='last_footer'>
                                {/* <div className='last_footer_Desc'>
                                    <h3 style={{ paddingRight: '10px' }}>Description</h3>
                                    <TextField multiline
                                        maxRows={4}
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.fillBill}
                                        onKeyDown={this.addBreakpoint}
                                        sx={{ width: 300 }}
                                    />
                                </div> */}
                                {/* <div className='last_footer_tandc'>
                                    <h3 style={{ paddingRight: '10px' }}>Terms &#38; Condtion</h3>
                                    <TextField multiline
                                        maxRows={15}
                                        name="tandc"
                                        value={this.state.tandc}
                                        onChange={this.fillBill}
                                        sx={{ width: 300 }}

                                    />
                                </div> */}
                            </div>
                            <div className='last_footer_payment'>
                                <div className="lfp_sub">
                                    <h3 style={{ paddingRight: '10px' }}>Advance Payment</h3>
                                    <TextField variant="outlined" size='small' id="outlined-basic" type="number" sx={{ width: 150 }} onChange={this.payment} value={this.state.advancePayment} />
                                </div>
                                <div className="lfp_sub">
                                    <h3 style={{ paddingRight: '10px' }}>Balance Payment</h3>
                                    <TextField disabled variant="outlined" size='small' id="outlined-basic" type="number" sx={{ width: 150 }} value={this.state.balancePayment} />
                                </div>
                                <div className="lfp_sub">
                                    <h3 style={{ paddingRight: '10px' }}>Total Price</h3>
                                    <TextField disabled value={this.state.pageTotal} variant="outlined" size='small' id="outlined-basic" type="number" sx={{ width: 150 }} />
                                </div>
                            </div>
                            <div className="b_footer" id='totalPriceHTML' style={{ marginBottom: "20px" }}>
                                <Total products={this.state.billingproducts} id='totalPriceHTML' />
                                <button className='css-button-rounded--blue' type='submit' onClick={this.confirmBill}>Print</button>
                            </div>
                        </div>
                    }
                </div >
                {
                    bill === null ? <></> :
                        <div className='A4pageToPrint'>
                            <div className="A4printHeader">
                                <div className='A4LogoName'>
                                    <h3>Billing </h3>
                                </div>

                            </div>

                            <div className="A4printBranchName">
                                <h4 style={{ paddingBottom: "1%" }}>Bill no:{localStorage.getItem('billNo')}</h4>
                            </div>
                            <div className="A4printCompanyhName">
                                <h4 style={{ paddingTop: "1%" }}>Company name:{company_name}</h4>
                                <h4>Bill Date:{(date.getDate())}/{(date.getMonth())}/{date.getFullYear()}</h4>
                                <h4 style={{ paddingBottom: "1%" }}>Bill Time:{(date.getHours())}.{(date.getMinutes())}.{date.getSeconds()}</h4>
                            </div>
                            <table className='printBillDetali' style={{ borderBottom: "1px solid black" }}>
                                <tr className='printBillTR' style={{ padding: "1% 0%" }}>
                                    <th>Si no</th>
                                    <th>Product Id</th>
                                    <th>Product Name</th>
                                    <th>Product Price</th>
                                    <th>GST%</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                                {bill.map((x, index) => (
                                    <tr className='printBillTD' >
                                        <td>{index + 1}</td>
                                        <td>{x.billProductId}</td>
                                        <td>{x.billProductName}</td>
                                        <td>{x.billWholesalePrice}</td>
                                        <td>{x.billProductGst}</td>
                                        <td>{x.billQuantity}{x.billUnits}</td>
                                        <td>{x.billTotalPrice}</td>
                                    </tr>
                                ))}
                            </table>
                            <div className='A4last_head'>
                                <div className='A4Desc'>
                                    <h4>Description:</h4>
                                    <p style={{ padding: "1%" }}>{this.state.description}</p>
                                </div>
                                <div className='A4tandc' >
                                    <h4>Terms  &#38; Condition:</h4>
                                    <p style={{ padding: "1%" }}>{this.state.tandc}</p>
                                </div>
                            </div>
                            <div className='A4printTotal'>
                                <p style={{ padding: "3px 0%" }}>GST:{parseFloat(this.state.TotalGst).toFixed(2)}%</p>
                                <p style={{ padding: "3px 0%" }}>SGST:{parseFloat(this.state.TotalGst / 2).toFixed(2)}%</p>
                                <p style={{ padding: "3px 0%" }}>CGST:{parseFloat(this.state.TotalGst / 2).toFixed(2)}%</p>
                                <p style={{ padding: "3px 0%" }}>Advance Payment:{this.state.advancePayment}</p>
                                <p style={{ padding: "3px 0%" }}>balance Payment:{this.state.balancePayment}</p>
                                <h2 style={{ padding: "3px 0%" }}>Total:{this.state.pageTotal}</h2>
                            </div>
                            <div className="printEnd">
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
                                {/* <h4>Send Bill copy</h4>
                                <div className='confirmBill_menu_button'>
                                <IconButton color="secondary" onClick={this.downloadPDF}>
                                    <Download style={{ color: "#4287f5" }} />
                                </IconButton>
                                    <IconButton color="secondary" onClick={this.mail}>
                                        <Mail style={{ color: "#EA4335" }} />
                                    </IconButton>
                                </div> */}
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
