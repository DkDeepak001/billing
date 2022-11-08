import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { IoSettingsOutline as Setting } from 'react-icons/all';

export class home extends Component {
    render() {
        return (
            <div>
                <div class="warning-content">
                    <div className='underConstruction'>

                        <h1>New Site Under Construction</h1>
                    </div>
                    <div className="svgCon">
                        <Setting size={100} className='animate2' />
                    </div>
                    <p>
                        Please forgive the inconvenience. <br />
                        We are currently initializing our brand new site.
                    </p>
                    <p>
                        It's okay, we're excited too!
                    </p>

                </div>
            </div >
        )
    }
}

export default home
