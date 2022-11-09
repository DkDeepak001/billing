import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
    IoMdAddCircleOutline as Addicon,
    MdDelete as DeleteIcon,
    BiUpArrowAlt as Up,
    BiDownArrowAlt as Down,
    GrEdit as Editicon,
    FiDownload as Download,
    FiMail as Mail

} from 'react-icons/all';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import './editBill.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { saveAs } from 'file-saver';
import Logo from '../../../resource/gananathanan.png';





export class analytics extends Component {

    constructor() {
        super();
        this.state = {
            fetchData: [],
            copyData: [],
            cookieData: [],
            parsedData: [],
            getData: [],
            billNo: '',
            branchId: '',
            company_name: '',
            pageTotal: '',
            time: '',
            count: 0,
            editIndex: '',
            quantityPrice: '',
            Quantity: '',
            selectedValues: '',
            copyBillingProducts: [],
            dupData: [],
            stockDetial: [],
            punit: '',
            unData: [],
            getbillNo: '',
            arrow: 0,



        }
    }

    componentDidMount() {

        axios.get('https://gnindiamart.com/api/fetchBill.php/?id=' + this.props.match.params.id + '&bName=' + localStorage.getItem("branchId"))
            .then((response) => {
                this.setState({ getData: response.data });
                // this.setState({ parsedData: response.data.map(x => JSON.parse(x.billedProducts)) });
                this.setState({ billNo: Object.entries(response.data)[0][1] });
                this.setState({ company_name: Object.entries(response.data)[1][1] });
                this.setState({ branchId: Object.entries(response.data)[2][1] });
                this.setState({ cookieData: JSON.parse((Object.entries(response.data))[3][1]) }, () => (localStorage.getItem('bill') === null ? localStorage.setItem('bill', JSON.stringify(this.state.cookieData)) : ''))
                this.setState({ parsedData: JSON.parse(localStorage.getItem('bill')) });
                this.setState({ pageTotal: Object.entries(response.data)[4][1] });
                this.setState({ time: Object.entries(response.data)[5][1] });
                this.getData();
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })

    }
    getData = () => {
        axios.get('https://gnindiamart.com/api/fetch.php')
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ dupData: result.data });
            })

        this.getStock();
    }

    getStock = () => {
        axios.get('https://gnindiamart.com/api/fetchBalanceProduct.php/?branchId=' + localStorage.getItem('userName'))
            .then(result => {
                this.setState({ stockDetial: result.data })
                const pid = (this.state.stockDetial.map(x => x.Pid));
                const matchedValues = (this.state.dupData.filter(x => pid.includes(x.id)));
                this.setState({ copyData: matchedValues });
            })
    }

    alertMsg = (index) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you wnat to delete this product!",
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
        const FName = this.state.parsedData[index].billProductName;
        const Pquantity = this.state.parsedData[index].billQuantity;
        const punit = this.state.parsedData[index].billUnits;
        const BName = this.state.stockDetial.map(x => x.productName);
        const i = BName.indexOf(FName);
        const data = this.state.stockDetial[i];
        if (punit === 'kg' || punit === 'liter') {
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
        const copyBillingProducts = [...this.state.parsedData];
        copyBillingProducts.splice(index, 1)
        this.setState({ parsedData: copyBillingProducts });
        this.setState({ count: this.state.count + 1 }, function () {
            const t = this.state.parsedData.map((x) => (x.billTotalPrice)).reduce((a, b) => a + b, 0);
            this.setState({ pageTotal: t }, () => {
            });
        });

    }



    updateBill = () => {
        const parsedData = [...this.state.parsedData];
        let copyBillingProducts = [];
        for (let i = 0; i < parsedData.length; i++) {
            const productId = parsedData[i].billProductId;
            const productName = parsedData[i].billProductName;
            const productPrice = parsedData[i].billProductPrice;
            const gst = parsedData[i].billProductGst;
            const units = parsedData[i].billUnits;
            const Quantity = parsedData[i].billQuantity;
            const OrgQty = parsedData[i].billQuantity;
            const quantityPrice = parsedData[i].billTotalPrice;
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
        }

        this.setState({ count: this.state.count + 1 }, function () {
            const t = this.state.parsedData.map((x) => (x.billTotalPrice)).reduce((a, b) => a + b, 0);
            this.setState({ pageTotal: t }, () => {
            });
        });
        let allData = new FormData();
        allData.append('billNo', this.props.match.params.id);
        allData.append('branchId', this.state.billNo);
        allData.append('billData', JSON.stringify(copyBillingProducts));
        allData.append('pageTotal', this.state.pageTotal);
        axios({
            method: 'post',
            url: 'https://gnindiamart.com/api/fetchBill.php',
            data: allData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(function (response) {
                Swal.fire({
                    title: 'Product Edited Sucessfully',
                    icon: 'success',
                })
            })
        localStorage.removeItem('bill');
        localStorage.removeItem('total');
        window.print();
        this.props.history.push('/user/billNo');

    }
    getIndex = (index) => {
        this.setState({ editIndex: index }, () => {

        })
    }
    editCalculatePrice = (event) => {
        const getQuantity = event.target.value;
        const getIndex = this.state.editIndex;
        const fetchPrice = this.state.parsedData[getIndex].billProductPrice;
        const fetchunit = this.state.parsedData[getIndex].billUnits;
        const FName = this.state.parsedData[getIndex].billProductName;
        const Pquantity = this.state.parsedData[getIndex].billQuantity;
        const OrgQty = this.state.parsedData[getIndex].billOrgQty;
        const BName = this.state.stockDetial.map(x => x.productName);
        const i = BName.indexOf(FName);
        const data = this.state.stockDetial[i];
        if (getQuantity > OrgQty) {
            if (fetchunit === 'g' || fetchunit === 'ml') {
                const d = getQuantity - OrgQty;
                const n = d / 1000;
                const total = parseFloat(data.quantity) - parseFloat(n);
                let allData = new FormData();
                allData.append('id', data.id);
                allData.append('quantity', total);
                axios({
                    method: 'post',
                    url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                    data: allData,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                }).then(function (response) { })
            } else if (fetchunit === 'kg' || fetchunit === 'liter' || fetchunit === 'pkt') {
                const d = getQuantity - OrgQty;
                const total = parseFloat(data.quantity) - parseFloat(d);
                let allData = new FormData();
                allData.append('id', data.id);
                allData.append('quantity', total);
                axios({
                    method: 'post',
                    url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                    data: allData,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                }).then(function (response) { })
            }

        } else if (getQuantity < OrgQty) {

            if (fetchunit === 'g' || fetchunit === 'ml') {
                const d = OrgQty - getQuantity;
                const n = d / 1000;
                const total = parseFloat(data.quantity) + parseFloat(n);
                let allData = new FormData();
                allData.append('id', data.id);
                allData.append('quantity', total);
                axios({
                    method: 'post',
                    url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                    data: allData,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                }).then(function (response) { })
            } else if (fetchunit === 'kg' || fetchunit === 'liter' || fetchunit === 'pkt') {
                const d = OrgQty - getQuantity;
                const total = parseFloat(data.quantity) + parseFloat(d);
                let allData = new FormData();
                allData.append('id', data.id);
                allData.append('quantity', total);
                axios({
                    method: 'post',
                    url: 'https://gnindiamart.com/api/updateBalanceProduct.php',
                    data: allData,
                    config: { headers: { 'Content-Type': 'multipart/form-data' } }
                }).then(function (response) { })
            }

        }




        if (fetchunit === 'g' || fetchunit === 'ml') {
            const gramPrice = fetchPrice / 1000;
            var quantityPrice = parseInt(getQuantity * gramPrice);
        } else if (fetchunit === 'kg' || fetchunit === 'liter' || fetchunit === 'pkt') {
            var quantityPrice = getQuantity * fetchPrice;
        }

        this.setState(prevState => ({
            parsedData: prevState.parsedData.map((x, index) =>
                (getIndex === index ? Object.assign(x, { billTotalPrice: quantityPrice }) : x)
            )
        }))
        this.setState(prevState => ({
            parsedData: prevState.parsedData.map((x, index) =>
                (getIndex === index ? Object.assign(x, { billQuantity: getQuantity }) : x)
            )
        }))
        this.setState({ count: this.state.count + 1 }, () => {
            localStorage.setItem("bill", JSON.stringify(this.state.parsedData));
        })

    }

    searchBar = (event) => {
        var output = this.state.copyData.filter(x => x.productName.includes(event.target.value));
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
    selectData(id, productName) {
        var output = this.state.copyData.filter(x => x.productName.includes(productName));
        this.setState({ fetchData: output });
        this.setState({ selectedValues: productName });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";

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
                const gramPrice = parseFloat(fetchPrice / 1000);
                const quantityPrice = parseInt(getQuantity * gramPrice);
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'g' })
            } else if (this.state.quanunit === 4) {
                const getQuantity = event.target.value;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const gramPrice = parseFloat(fetchPrice / 1000);
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



    addProduct = () => {
        const FName = this.state.fetchData[0].productName;
        const Pquantity = this.state.Quantity;
        const punit = this.state.punit;
        const BName = this.state.stockDetial.map(x => x.productName);
        const index = BName.indexOf(FName);
        const data = this.state.stockDetial[index];
        if (punit === 'kg' || punit === 'liter') {
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
            const t = this.state.parsedData.map((x) => (x.billTotalPrice)).reduce((a, b) => a + b, 0);
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
            const copyBillingProducts = [...this.state.parsedData];
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
            this.setState({ parsedData: copyBillingProducts }, function () {
                localStorage.setItem("bill", JSON.stringify(this.state.parsedData));
            });
            this.setState({ selectedValues: '' });
            localStorage.setItem("bill", JSON.stringify(this.state.parsedData));
            localStorage.setItem("total", JSON.stringify(this.state.pageTotal));
            const quantityInput = document.getElementById('quantityInput');
            quantityInput.value = '';
            this.setState({ fetchData: [] });
            this.setState({ quantityPrice: '' });
            this.setState({ Quantity: '' });
            const searchResult = document.getElementById('searchResult');
            searchResult.style.display = "none";
        }
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
                const gramPrice = parseFloat(fetchPrice / 1000);
                const quantityPrice = parseInt(getQuantity * gramPrice);
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'g' });
            } else if (this.state.quanunit === 4) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const gramPrice = parseFloat(fetchPrice / 1000);
                const quantityPrice = parseInt(getQuantity * gramPrice);
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'ml' });
            } else if (this.state.quanunit === 5) {
                const getQuantity = this.state.Quantity;
                const fetchPrice = this.state.fetchData[0].totalPrice;
                const quantityPrice = getQuantity * fetchPrice;
                this.setState({ Quantity: getQuantity });
                this.setState({ quantityPrice: quantityPrice });
                this.setState({ punit: 'liter' })
            }
        })

    }
    cancelBill = () => {

        axios.get('https://gnindiamart.com/api/fetchBalanceProduct.php/?branchId=' + localStorage.getItem('userName'))
            .then(result => {
                this.setState({ stockDetial: result.data }, () => {
                    console.log(this.state.stockDetial)
                    const clearData = JSON.parse(localStorage.getItem("bill"));
                    if (clearData !== null) {
                        for (let index = 0; index < clearData.length; index++) {

                            if (this.state.parsedData[index].billOrgQty !== this.state.parsedData[index].billQuantity) {
                                var FName = this.state.parsedData[index].billProductName;
                                var orgq = this.state.parsedData[index].billOrgQty;
                                var newq = this.state.parsedData[index].billQuantity;
                                var punit = this.state.parsedData[index].billUnits;
                                console.log(this.state.parsedData);
                                console.log(this.state.stockDetial);
                                var BName = this.state.stockDetial.map(x => x.productName);
                                var i = BName.indexOf(FName);
                                var data = this.state.stockDetial[i];
                                console.log(data)
                                if (newq > orgq) {
                                    var Pquantity;
                                    Pquantity = newq - orgq;
                                    if (punit === 'kg' || punit === 'liter' || punit === 'pkt') {
                                        const totalQ = (parseFloat(data.quantity) + parseFloat(Pquantity));
                                        console.log(data.quantity);
                                        data.quantity = totalQ;
                                        console.log(totalQ);
                                        console.log(Pquantity);
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

                                } else if (newq < orgq) {
                                    var Pquantity;
                                    Pquantity = orgq - newq;
                                    if (punit === 'kg' || punit === 'liter' || punit === 'pkt') {
                                        const totalQ = (parseFloat(data.quantity) - parseFloat(Pquantity));
                                        console.log(data.quantity);
                                        data.quantity = totalQ;
                                        console.log(totalQ);
                                        console.log(Pquantity);
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
                                }

                            }
                        }
                    }
                    localStorage.removeItem("bill");
                    this.props.history.push('/user/billNo');

                })

            })
    }
    confirmBill = () => {
        const subCont = document.getElementById("eb");
        const confCont = document.getElementById("confirm_hide");
        subCont.style.display = "none";
        confCont.style.display = "block";

    }
    confirmBillBack = () => {
        const subCont = document.getElementById("eb");
        const confCont = document.getElementById("confirm_hide");
        subCont.style.display = "block";
        confCont.style.display = "none";
    }
   

    render() {
        const x = this.state.sortValueId;
        const y = this.state.sortvalueName;
        const z = this.state.sortvaluePrice;
        const a = this.state.sortvalueUnits;
        const b = this.state.sortvaluegst;
        const bill = JSON.parse(localStorage.getItem('bill'));
        let date = new Date();

        return (
            <div>
                <div className='admin_mainwrap' >
                    {this.state.parsedData.length === 0 ? <h1 style={{ margin: "2%" }}>Not have access to edit this bill</h1> :
                        <div className='eb' id="eb">
                            <div className='ebns_container'>
                                <div className='ebn_details'>
                                    <div> <h4>Bill no : {this.state.billNo}</h4></div>
                                    <div> <h4>Branch id : {this.state.branchId}</h4></div>
                                    <div> <h4>company Name : {this.state.company_name}</h4></div>
                                    <div> <h4>Billed Date : {this.state.time}</h4></div>
                                </div>
                            </div>
                            <div className="b_header" style={{ padding: "1%" }}>
                                <div className="b_subheader">
                                    <h3>Product Name</h3>
                                    <div>
                                        <TextField id="searchBar" variant="outlined" size='small' onChange={this.searchBar} onKeyDown={this.onKeyDown} value={this.state.selectedValues} />
                                        <div className='searchResult' id="searchResult" >
                                            {this.state.fetchData.length === 0 ? <p className="items">No Data Found</p> :
                                                this.state.fetchData.map((x, index) => (
                                                    <p className='items' id={(`items${index}` === `items${this.state.arrow}`) ? 'active' : ''} key={x.id} onClick={() => this.selectData(x.id, x.productName)}>{x.productName}</p>

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
                                            inputProps={{ min: "0", step: "1" }}

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
                                            sx={{ height: 40, width: 140 }}
                                            onChange={this.gramPrice}
                                            disabled={this.state.Quantity === '' ? true : false}
                                            className='select_unit'

                                        >
                                            {this.state.fetchData.map(x => (x.units) === "pkt" ? <option value={5} id="pkt">pkt</option> :
                                                this.state.fetchData.map(x => (x.units) === "kg" ? <option value={1} id="kg">kg</option> :
                                                    <option value={2} id="liter">liter</option>))}
                                            {this.state.fetchData.map(x => (x.units) === "pkt" ? <></> :
                                                this.state.fetchData.map(x => (x.units) === "kg" ? <option value={3} id="gram">gram</option> :
                                                    <option value={4} id="ml">ml</option>))}
                                        </select></div>
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
                                        <Button color="success" variant='contained' aria-label="add an alarm" size='medium' onClick={this.addProduct} >
                                            <Addicon />Add
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="b_mainwrap" style={{ width: "95%", margin: "1% auto" ,overflow:"auto"}}>
                                <table className='table'>
                                    <thead className='table_head'>
                                        <tr>
                                            <td className='table_head' >Si No</td>
                                            <td className='table_head' >Product Id</td>
                                            <td className='table_head' >Product Name</td>
                                            <td className='table_head' >Product Price</td>
                                            <td className='table_head' >Quantity</td>
                                            <td className='table_head' >Total Price</td>
                                            <td className='table_head'></td>
                                            <td className='table_head'></td>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.parsedData.map((row, index) => (
                                            <tr
                                                key={index + 1}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <td component="th" scope="row" style={{ border: "none" }} >
                                                    {index + 1}
                                                </td>
                                                <td>PID{row.billProductId}</td>
                                                <td>{row.billProductName}</td>
                                                <td>{row.billProductPrice}</td>
                                                {this.state.editIndex === index ? <OutlinedInput
                                                    id="quantityInput"
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{ min: "1", max: "10", step: "1" }}

                                                    size='medium'
                                                    type='number'
                                                    style={{ width: 80 }}
                                                    value={row.billQuantity}
                                                    onChange={this.editCalculatePrice}
                                                    onBlur={() => { this.setState({ editIndex: '' }) }}
                                                />
                                                    : <td  >{row.billQuantity}{row.billUnits}</td>}
                                                <td >{row.billTotalPrice}</td>
                                                <td sx={{ width: 100 }}><Button variant="contained" size='small' color='success' onClick={() => this.getIndex(index)} >Edit</Button></td>
                                                <td sx={{ width: 100 }}><IconButton variant="contained" size='small' color='error' onClick={() => this.alertMsg(index)} ><DeleteIcon /></IconButton></td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>

                                {
                                    this.state.pageTotal === 0 ? '' :
                                        <div className="b_footer_editBill" id='totalPriceHTML'>
                                            <div className='b_footer_total'>
                                                <h3> <Total products={this.state.parsedData} id='totalPriceHTML' /></h3>
                                            </div>
                                            <div className='b_footer_button'>
                                                <button className='css-button-rounded--red' onClick={this.cancelBill}>Cancel bill</button>
                                                <button className='css-button-rounded--blue' type='submit' onClick={this.confirmBill}>Print</button>
                                            </div>
                                        </div>
                                }
                        </div>

                    }
                    {bill === null ? <></> :
                        <div className='pageToPrint'>
                            <div className="printHeader" style={{ borderTop: "1px soild black", borderBottom: '1px solid black', padding: "1% 0%" }}>
                            <img src={Logo} style={{ height: 40, width: 35, padding: "0% 2%" }}></img>
                                <h4>GN India Mart</h4>
                                <h6>CIN : U51909TN2021PTC146627</h6>
                                <p>No:4 Vivekanandar street, 2nd floor, Irumbuliyur,Chennai-600045,Tamilnadu</p>
                            </div>
                            <div className="printcustomerName" style={{ borderBottom: '1px solid black', padding: ".5% 0%" }}>
                                <p>Customer Name: {this.state.company_name}</p>
                                <p>Bill Date:{(date.getDate())}/{(date.getMonth())}/{date.getFullYear()}</p>
                                <p>Bill Time:{(date.getHours())}.{(date.getMinutes())}.{date.getSeconds()}</p>
                            </div>
                            <div className='printBranchName' style={{ borderBottom: '1px solid black', padding: ".5% 0%" }}>
                                <p>Branch name:{localStorage.getItem("userName")}</p>
                                <p>Bill no:{this.state.billNo}</p>
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
                                <h4>Total:{localStorage.getItem('total')}</h4>
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
                </div >
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
export default analytics


