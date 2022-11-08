import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';

function Demo() {
    var history = useHistory();
    const goToPreviousPath = () => {
        history.goBack()
    }
    return (
        <div>

            <a onClick={goToPreviousPath} class="back">... Back to previous page</a>

        </div>
    )
}
export class pageNotFound extends Component {
    componentDidMount() {
        if (document.getElementById("admin_sidewrap") !== null) {
            document.getElementById("admin_sidewrap").style.display = "none";
        } else if (document.getElementById("side_Nav") !== null) {
            document.getElementById("side_Nav").style.display = "none";
        }
        console.log(document.referrer)
    }
    goback = () => {

    }
    render() {
        return (
            <div className='404'>
                <div id='oopss'>
                    <div id='error-text'>
                        <img src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt="404" />
                        <span>404 PAGE</span>
                        <p class="p-a">
                            . The page you were looking for could not be found</p>
                        <p class="p-b">
                            ... Back to previous page
                        </p>
                        <Demo></Demo>
                    </div>
                </div>
            </div>
        )
    }
}

export default pageNotFound
