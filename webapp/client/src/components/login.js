import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class login extends Component {
    render() {
        return (
            <div>
                 <div className="container">
                    <div className="row">
                        <div className="login col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <div className="shadow-sm p-3 m-1 bg-white rounded">
                                <div className="card-body">
                                    <h5 className="card-title text-center">Sign In</h5>
                                    <form className="form-signin">
                                        <div className="form-label-group">
                                            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" />
                                            <label for="inputEmail">Email address</label>
                                        </div>
                                        <div className="form-label-group">
                                            <input type="password" id="inputPassword" class="form-control" placeholder="Password"/>
                                            <label for="inputPassword">Password</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mb-3">
                                            <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                                            <label className="custom-control-label" for="customCheck1">Remember password</label>
                                        </div>
                                        <Link NavLink to='/fleet'>
                                            <button className='btn nav-button'>
                                                Sign In
                                            </button>
                                        </Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
