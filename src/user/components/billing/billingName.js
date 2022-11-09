import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import NewuserForm from '../resgister/resgister';
import './billingName.css';
import { Link } from "react-router-dom";


export class billingName extends Component {
    constructor() {
        super()
        this.state = {
            fetchData: [],
            copyData: [],
            selectedValues: '',
            NewUser: true,
            arrow: 0,

        }
        this.getData();
    }

    getData = () => {
        axios.get('https://gnindiamart.com/api/getCompanyName.php/?bName=' + localStorage.getItem('userName'))
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ copyData: result.data });
            })
    }


    searchBar = (event) => {
        var output = this.state.copyData.filter(x => x.company_name.includes(((event.target.value).toLowerCase())));
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
        }
        this.getData();
        this.setState({ arrow: 0 })


    }

    selectData(id, company_name) {
        var output = this.state.copyData.filter(x => x.company_name === company_name);
        this.setState({ fetchData: output }, () => { localStorage.setItem('cid', this.state.fetchData[0].cid) });
        this.setState({ selectedValues: company_name });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";
        this.getData();

    }

    onKeyDown = (e) => {
        const searchResult = document.getElementById('searchResult');
        if (e.keyCode === 8) {
            var output = this.state.copyData.filter(x => x.company_name.includes(e.target.value));
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
                this.selectData(output.cid, (output.company_name));
            }
        }


        this.getData();

    }
    newuser = () => {
        this.setState({ NewUser: !this.state.NewUser }, () => {
            const elec = document.getElementById("reg_container");
            const ele = document.getElementById("reg_background");
            if (ele !== null) {
                elec.style.margin = "0%";
                ele.style.boxShadow = "none";
            }
            this.getData();
        });

    }
    submitName = () => {
        localStorage.setItem('cid', this.state.fetchData[0].cid)
    }
    render() {
        const n = this.state.NewUser;
        return (
            <div className='billingName_container'>
                {localStorage.getItem('company_name') === null ? <></> : <>{this.props.history.push(`/user/billingName/billing/${localStorage.getItem('company_name')}`)}</>}
                {n ?
                    <div className='billingName_header'>
                        <div className='billingName_header_button'>
                            <button className='css-button-rounded--blue' onClick={this.newuser}>New user</button>
                        </div>
                        <div className='billingName_newuserForm'>
                            <div className='billName_row'>
                                <div className='billName_row_name'>
                                    <h2 >Company Name </h2>
                                </div>
                                <div className='billName_row_box'>
                                    <TextField id="searchBar" variant="outlined" size='small' onChange={this.searchBar} onKeyDown={this.onKeyDown} value={this.state.selectedValues} />
                                    <div className='searchResult' id="searchResult" >
                                        {this.state.fetchData.length === 0 ? <p className="items">No Data Found</p> :
                                            this.state.fetchData.map((x, index) => (
                                                <p className='items' id={(`items${index}` === `items${this.state.arrow}`) ? 'active' : ''} key={index} onClick={() => this.selectData(x.cid, x.company_name)}>{x.company_name}</p>
                                            ))}
                                    </div>
                                </div>
                                <div className='billName_row_button' >
                                    {this.state.fetchData.length !== 1 ? <Button type='button' variant='contained' className='css-button-rounded--blue' disable onClick={this.submitName} disabled> Next</Button>
                                        : <Link to={`/user/billingName/billing/${this.state.selectedValues}`}>
                                            <button className='css-button-rounded--green' onClick={this.submitName}>Next</button>

                                        </Link>
                                    }

                                </div>
                            </div>
                        </div>
                    </div >

                    :
                    <div className='billingName_header'>
                        <div className='billingName_header_button'>
                            <button className='css-button-rounded--red' onClick={this.newuser}>Hide</button>
                        </div>
                        <div className='billName_row'>
                            <NewuserForm />
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default billingName
