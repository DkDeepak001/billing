import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './newUser.css';

export class viewUsers extends Component {
    constructor() {
        super()
        this.state = {
            fetchData: [],
        }
        this.getData();
    }
    getData = () => {
        axios.get('http://billing-software.dkdeepak.com/api/getAllBranch.php')
            .then(result => {
                this.setState({ fetchData: result.data });
            })
    }
    alertMsg = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted!',
                    'success'
                )
            }
            this.deleteRow(id);
        })
    }

    deleteRow = (id) => {
        axios({
            method: 'post',
            url: 'http://billing-software.dkdeepak.com/api/deleteuser.php/?delete=' + id
        })
            .then(function (response) {
                //handle success
                if (response.status === 200) {
                }
            })
        this.getData();
    }

    render() {
        return (
            <div className='viewUser_container'>
                <div className='vu_header'>
                    <h2>View user</h2>
                </div>
                <div  className='viewUser_mnenu'>
                    <table className='table'>
                        <thead className='table_head'>
                            <tr>
                                <th className='table_head' >Username</th>
                                <th className='table_head' >Password</th>
                                <th className='table_head' >Email</th>
                                <th className='table_head' >Phone Number</th>
                                <th className='table_head'>Address</th>
                                <th className='table_head'> Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.fetchData.length===0?<td>No Data Found</td>:
                                this.state.fetchData.map((x) => (
                                <tr
                                    key={x.uid}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <td component="th" scope="row">
                                        {x.userName}
                                    </td>
                                    <td>{x.passWord}</td>
                                    <td>{x.email}</td>
                                    <td>{x.phoneNo}</td>
                                    <td>{x.Address}</td>
                                    <td sx={{ width: 100 }}>
                                        <button className='css-button-rounded--red' onClick={() => this.alertMsg(x.uid)} >Delete</button></td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>
        )
    }
}

export default viewUsers
