import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export class Navbar extends Component {
    render() {
        return (
            <ul className="nav nav-tabs bg-body-tertiary">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Daily Newz Dose ...</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/business">Business</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/entertainment">Entertainment</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/health">Health</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/science">Science</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/sports">Sports</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/technology">Technology</Link>
                </li>
            </ul>
        )
    }
}

export default Navbar
