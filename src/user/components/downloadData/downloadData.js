import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import './DownloadData.css';
import axios from 'axios';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';

export class downloadData extends Component {
    constructor() {
        super();
        this.state = {
            type: 0,
            dateType: 0,
            selectedValues: "",
            selectBranch: "",
            BranchList: [],
            userData: [],
            adminData: [],
            copyData: [],
            fetchData: [],
            stateDate: "",
            endDate: ""
        }
        this.getData();
    }
    getData = () => {
        axios.get('https://gnindiamart.com/api/getAllBranch.php')
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ BranchList: result.data }, () => {
                });

            })
        axios.get('https://gnindiamart.com/api/getCompanyName.php/?all=' + this.state.type)
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ userData: result.data }, () => {
                });

            })
        axios.get('https://gnindiamart.com/api/getAdminCustomer.php')
            .then(result => {
                // this.setState({ fetchData: result.data });
                this.setState({ adminData: result.data }, () => {
                    var arr = [...this.state.adminData, ...this.state.userData];
                    this.setState({ copyData: arr })
                });

            })
    }
    searchBar = (event) => {
        var output = this.state.copyData.filter(x => x.company_name.includes((event.target.value).toLowerCase()));
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
        var output = this.state.copyData.filter(x => x.company_name.includes(company_name));
        this.setState({ fetchData: output });
        this.setState({ selectedValues: company_name });
        const searchResult = document.getElementById('searchResult');
        searchResult.style.display = "none";
        this.getData();

    }

    onKeyDown = (e) => {
        this.getData();
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
                this.selectData(this.state.arrow, (output.company_name));
            }

        }
    }
    selectType = (event) => {
        this.setState({ type: parseInt(event.target.value) }, () => {

        })
    }
    selectBranch = (event) => {
        this.setState({ selectBranch: parseInt(event.target.value) }, () => {
            console.log(this.state.selectBranch)
        })
    }
    dateType = (event) => {
        this.setState({ dateType: parseInt(event.target.value) }, () => {
            if (this.state.dateType === 1) {
                this.setState({ startDate: "" })
                this.setState({ endDate: "" })
            }
        })
    }
    changeValue = (event) => {
        if (event.target.value == null) {

        }
        else {
            const sfDate = (event.target.value[0]);
            const efDate = (event.target.value[1]);
            var sdate = new Date(sfDate);
            const syear = sdate.getFullYear();
            const smonth = (sdate.getMonth() + 1).toString().padStart(2, "0");
            const sday = sdate.getDate().toString().padStart(2, "0");
            const sfinalDate = syear + '-' + smonth + '-' + sday;
            this.setState({ startDate: sfinalDate })
            var edate = new Date(efDate);
            const eyear = edate.getFullYear();
            const emonth = (edate.getMonth() + 1).toString().padStart(2, "0");
            const eday = edate.getDate().toString().padStart(2, "0");
            const efinalDate = eyear + '-' + emonth + '-' + eday;
            this.setState({ endDate: efinalDate })
            this.getData()
        }
    }

    render() {
        return (
            <div className="dd_container">
                <div className='dd_main'>
                    <div className='dd_select_type'>
                        <label>Select Type </label>
                        <select
                            labelId="dd_select_type"
                            id="dd_select_type"
                            onChange={this.selectType}
                            className='select'
                            style={{ width: 140 }}
                            defaultValue={0}
                        >
                            <option value={0} id="" disabled>select type</option>
                            <option value={1} id="Branch wise">Branch wise</option>
                            <option value={2} id="Company wise">Company wise</option>
                        </select>
                    </div>
                    {this.state.type === 0 ? "" : (this.state.type === 2 ?
                        <div className='dd_select_cmpdata'>
                            <label>Enter Company Name </label>
                            <div>
                                <TextField id="searchBar" variant="outlined" size='small'
                                    onChange={this.searchBar} onKeyDown={this.onKeyDown} value={this.state.selectedValues}
                                />
                                <div className='searchResult' id="searchResult"  >
                                    {this.state.fetchData.length === 0 ? <p className="items">No Data Found</p> :
                                        this.state.fetchData.map((x, index) => (
                                            <p className='items' id={(`items${index}` === `items${this.state.arrow}`) ? 'active' : ''} key={index} onClick={() => this.selectData(x.uid, x.company_name)}>{x.company_name}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                        :
                        ""

                    )}
                    {this.state.type !== 0 || this.state.type === 1 || this.state.selectedValues !== "" ?
                        <div className='dd_select_type'>
                            <label>Select Date type </label>
                            <select
                                labelId="dd_select_type"
                                id="dd_select_type"
                                onChange={this.dateType}
                                className='select'
                                style={{ width: 140 }}
                                defaultValue={0}
                                style={{ margin: "2% 0%" }}
                            >
                                <option value={0} id="" disabled>select Date type</option>
                                <option value={1} id="Branch wise">Download all </option>
                                <option value={2} id="Company wise">select Date</option>
                            </select>
                        </div> :
                        ""
                    }
                    {this.state.dateType === 1 ? <button style={{ margin: "2% 0%" }} className='css-button-rounded--green'>Download all</button> :
                        (this.state.dateType === 2 ?
                            <DateRangePickerComponent
                                placeholder="Pick a Date"
                                max={new Date()}
                                onChange={this.changeValue}
                                style={{ margin: "2% 0%" }}
                            >
                            </DateRangePickerComponent>
                            : "")
                    }
                    {((this.state.stateDate !== "" || this.state.endDate !== "") ? <button style={{ margin: "2% 0%" }} className='css-button-rounded--green'>Download</button> : "")}
                </div>
            </div>
        )
    }
}

export default downloadData
