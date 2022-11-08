import React, { Component } from 'react';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import './barGraph.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';


export class barGraph extends Component {
    constructor() {
        super();

        this.state = {
            startDate: "",
            endDate: "",
            getData: [],
            branchList: [],
            branchListTotal: []
        }

        this.getData();
    }

    getData = () => {
        axios.get('http://billing-software.dkdeepak.com/api/getSelectedDateWise.php/?startDate=' + this.state.startDate + '&endDate=' + this.state.endDate)
            .then((response) => {
                this.setState({ getData: (response.data) }, function () {
                    if (this.state.getData.length !== 0) {
                        const branch = this.state.getData.map(x => x.branchId);
                        const branchList = (branch.filter((value, index, arr) => arr.indexOf(value) === index));
                        this.setState({ branchList: branchList }, function () {
                            const branchListTotal = this.state.branchList.map((x, index) => ((this.state.getData.filter(x => (x.branchId === (this.state.branchList[index])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0)))

                        });
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            }).then(function () { })


    }



    changeValue = (event) => {
        if (event.target.value === null) {

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
            <div className='barGraph_container'>
                <div className='barGraph_menuTop'>
                    <div className='barGarap_head'>
                        <h2>Branch wise sales</h2>
                    </div>
                    <div className='date_picker'>
                        <DateRangePickerComponent
                            placeholder="Pick a Date"
                            max={new Date()}
                            onChange={this.changeValue}
                        >
                        </DateRangePickerComponent>
                    </div>
                </div>
                <div className='barGraph_main'>
                    {this.state.getData.length === 0 ? <>NO Bill yet</> : <Bar data={{
                        labels: this.state.branchList,
                        datasets: [
                            {
                                backgroundColor: [
                                    '#B21F00', '#C9DE00', '#2FDE00', '#00A6B4', '#6800B4',
                                    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                                    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                                    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
                                ],
                                data: this.state.branchList.map((x, index) => ((this.state.getData.filter(x => (x.branchId === (this.state.branchList[index])))).map((x) => (parseInt(x.totalPrice))).reduce((a, b) => a + b, 0)))
                            }
                        ]
                    }}

                        options={{
                            layout: {
                                padding: 30
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    align: 'center',
                                    display: false

                                },

                            },



                        }} />}

                </div>


            </div>
        )
    }
}

export default barGraph
