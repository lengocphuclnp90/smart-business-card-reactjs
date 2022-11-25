import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './InformationManage.scss';
import './InformationManageMobile.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CommonUtils, path } from "../../../utils";
import * as actions from "../../../store/actions"
import { toast } from "react-toastify";
import _ from 'lodash';

import Social from './Tables/Social';
import Bank from './Tables/Bank';
import Custom from './Tables/Custom';
import Email from './Tables/Email';
import Phone from './Tables/Phone';
import Location from './Tables/Location';

class InfomationManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 1,
            number: 0,
            show: 0,
            view: 0
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    socialManage = () => {
        this.setState({
            active: 1
        })
    }
    emailManage = () => {
        this.setState({
            active: 2
        })
    }
    phoneManage = () => {
        this.setState({
            active: 3
        })
    }
    bankManage = () => {
        this.setState({
            active: 4
        })
    }
    locationManage = () => {
        this.setState({
            active: 5
        })
    }
    customManage = () => {
        this.setState({
            active: 6
        })
    }
    gotoProfile = () => {
        if (this.props.userInfo.hide === 'ON') {
            if (this.props.language === LANGUAGES.VI) {
                toast.warning("Bạn cần bật Hiển Thị Trang Cá Nhân tại mục Tài Khoản !");
            } else {
                toast.warning("You need to enable Show Profile in the Account section !");
            }

        } else {
            window.open(`http://localhost:3000/profile/` + this.props.userInfo.link)
        }
    }
    checkView = (number, show, view) => {
        this.setState({
            number: number,
            show: show,
            view: view
        })
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    render() {
        let active = +this.state.active;
        console.log("active", active);
        let userInfo = this.props.userInfo;
        let imageBase64 = '';
        if (userInfo) {
            if (userInfo.image) {
                imageBase64 = new Buffer(userInfo.image, 'base64').toString('binary');
            }
        }
        return (
            <React.Fragment>
                <div className='information-manage-mobile'>
                    <select
                        value={this.state.active}
                        onChange={(event) => this.handleOnChangeInput(event, 'active')}
                    >
                        <FormattedMessage id="info.social" >
                            {(message) => <option value='1'>{message}</option>}
                        </FormattedMessage>
                        <FormattedMessage id="info.email" >
                            {(message) => <option value='2'>{message}</option>}
                        </FormattedMessage>
                        <FormattedMessage id="info.phone" >
                            {(message) => <option value='3'>{message}</option>}
                        </FormattedMessage>
                        <FormattedMessage id="info.bank" >
                            {(message) => <option value='4'>{message}</option>}
                        </FormattedMessage>
                        <FormattedMessage id="info.location" >
                            {(message) => <option value='5'>{message}</option>}
                        </FormattedMessage>
                        <FormattedMessage id="info.custom" >
                            {(message) => <option value='6'>{message}</option>}
                        </FormattedMessage>
                    </select>
                    <div className='left-footer'>
                        <div className='footer-content'>
                            <FormattedMessage id="info.total" /> <b>{this.state.number}</b>
                        </div>
                        <div className='footer-content'>
                            <FormattedMessage id="info.totalShow" /> <b>{this.state.show}</b>
                        </div>
                        <div className='footer-content'>
                            <FormattedMessage id="info.totalView" /> <b>{this.state.view}</b>
                        </div>
                    </div>
                    <div className='information-content-right'>
                        {active === 1 ? <Social checkView={this.checkView} /> : ''}
                        {active === 2 ? <Email checkView={this.checkView} /> : ''}
                        {active === 3 ? <Phone checkView={this.checkView} /> : ''}
                        {active === 4 ? <Bank checkView={this.checkView} /> : ''}
                        {active === 5 ? <Location checkView={this.checkView} /> : ''}
                        {active === 6 ? <Custom checkView={this.checkView} /> : ''}
                    </div>
                </div>
                <div className='information-manage'>
                    <div className='information-content'>
                        <div className='information-content-left'>
                            <div className='left-header' onClick={() => this.gotoProfile()}>
                                <div className='header-image'><img src={imageBase64}></img></div>
                                <div className='header-status'>
                                    <div className='name'>{userInfo.name}</div>
                                    {this.props.userInfo.hide === 'ON' ?
                                        <React.Fragment>
                                            <div className='status lock'><FormattedMessage id="info.hide" /></div>
                                        </React.Fragment>
                                        : <React.Fragment>
                                            <div className='status'><FormattedMessage id="info.view" /></div>
                                        </React.Fragment>
                                    }
                                </div>
                                {this.props.userInfo.hide === 'ON' ?
                                    <React.Fragment>
                                        <div className='header-icon'><i class="fas fa-unlink"></i></div>
                                    </React.Fragment>
                                    : <React.Fragment>
                                        <div className='header-icon'><i class="fas fa-sign-out-alt"></i></div>
                                    </React.Fragment>
                                }

                            </div>
                            <div className='left-menu'>
                                <div className={active === 1 ? 'sub-menu active' : 'sub-menu'}
                                    onClick={() => this.socialManage()}
                                ><i class="far fa-folder"></i> <FormattedMessage id="info.social" /></div>
                                <div className={active === 2 ? 'sub-menu active' : 'sub-menu'}
                                    onClick={() => this.emailManage()}
                                ><i class="far fa-folder"></i> <FormattedMessage id="info.email" /></div>
                                <div className={active === 3 ? 'sub-menu active' : 'sub-menu'}
                                    onClick={() => this.phoneManage()}
                                ><i class="far fa-folder"></i> <FormattedMessage id="info.phone" /></div>
                                <div className={active === 4 ? 'sub-menu active' : 'sub-menu'}
                                    onClick={() => this.bankManage()}
                                ><i class="far fa-folder"></i> <FormattedMessage id="info.bank" /></div>
                                <div className={active === 5 ? 'sub-menu active' : 'sub-menu'}
                                    onClick={() => this.locationManage()}
                                ><i class="far fa-folder"></i> <FormattedMessage id="info.location" /></div>
                                <div className={active === 6 ? 'sub-menu active' : 'sub-menu'}
                                    onClick={() => this.customManage()}
                                > <i class="far fa-folder"></i> <FormattedMessage id="info.custom" /></div>
                            </div>
                            <div className='left-footer'>
                                <div className='footer-content'>
                                    <FormattedMessage id="info.total" /> <b>{this.state.number}</b>
                                </div>
                                <div className='footer-content'>
                                    <FormattedMessage id="info.totalShow" /> <b>{this.state.show}</b>
                                </div>
                                <div className='footer-content'>
                                    <FormattedMessage id="info.totalView" /> <b>{this.state.view}</b>
                                </div>
                            </div>
                        </div>
                        <div className='information-content-right'>
                            {active === 1 ? <Social checkView={this.checkView} /> : ''}
                            {active === 2 ? <Email checkView={this.checkView} /> : ''}
                            {active === 3 ? <Phone checkView={this.checkView} /> : ''}
                            {active === 4 ? <Bank checkView={this.checkView} /> : ''}
                            {active === 5 ? <Location checkView={this.checkView} /> : ''}
                            {active === 6 ? <Custom checkView={this.checkView} /> : ''}
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }

}

const mapStateToProps = state => {
    return {
        isAdmin: state.user.isAdmin,
        userInfo: state.user.userInfo,
        language: state.user.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfomationManage));
