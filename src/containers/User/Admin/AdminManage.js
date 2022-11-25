import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './AdminManage.scss';
import { LANGUAGES, CommonUtils, path } from "../../../utils";
import * as actions from "../../../store/actions"
import { toast } from "react-toastify";
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import Social from './Tables/Social';
import Bank from './Tables/Bank';
import Custom from './Tables/Custom';
import Email from './Tables/Email';
import Phone from './Tables/Phone';
import Location from './Tables/Location';
import ListSocial from './Tables/ListSocial';
import ListBank from './Tables/ListBank';
import ListCustom from './Tables/ListCustom';
import User from './Tables/User';
import InformationManage from './Tables/Information/InformationManage';
import ListCard from './Tables/ListCard';
import News from './Tables/News';
class AdminManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 11,
            number: 0,
            show: 0,
            view: 0,
            id: '',
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    displayUser = (id) => {
        this.setState({
            id: id
        })
    }
    userManage = () => {
        this.setState({
            active: 0
        })
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
    listSocialManage = () => {
        this.setState({
            active: 7
        })
    }
    listBankManage = () => {
        this.setState({
            active: 8
        })
    }
    listCustomManage = () => {
        this.setState({
            active: 9
        })
    }
    listCardManage = () => {
        this.setState({
            active: 10
        })
    }
    newsManage = () => {
        this.setState({
            active: 11
        })
    }
    gotoProfile = () => {
        if (this.props.userInfo.hide === 'ON') {
            toast.warning("Bạn cần bật Hiển Thị Trang Cá Nhân tại mục Tài Khoản !");
        } else {
            window.open(`http://localhost:3000/profile/` + this.props.userInfo.link)
        }
    }
    render() {
        let active = this.state.active;
        let userInfo = this.props.userInfo;
        let imageBase64 = '';
        if (userInfo) {
            if (userInfo.image) {
                imageBase64 = new Buffer(userInfo.image, 'base64').toString('binary');
            }
        }
        return (
            <React.Fragment>
                {this.state.id !== '' ?
                    <React.Fragment>
                        <InformationManage displayUser={this.displayUser} id={this.state.id} />
                    </React.Fragment> :
                    <React.Fragment>
                        <div className='information-manage-admin'>
                            <div className='information-content'>
                                <div className='information-content-left'>
                                    <div className='left-header' onClick={() => this.gotoProfile()}>
                                        <div className='header-image'><img src={imageBase64}></img></div>
                                        <div className='header-status'>
                                            <div className='name'>{userInfo.name}</div>
                                            <div className='status lock'><FormattedMessage id="admin.admin" /></div>
                                        </div>
                                        <div className='header-icon'><i class="fas fa-cogs"></i></div>
                                    </div>
                                    <div className='left-menu'>
                                        <div className={active === 11 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.newsManage()}
                                        ><i class="fas fa-newspaper"></i> <FormattedMessage id="admin.news" /></div>
                                    </div>
                                    <div className='left-menu'>
                                        <div className={active === 0 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.userManage()}
                                        ><i class="fas fa-users"></i> <FormattedMessage id="admin.user" /></div>
                                    </div>
                                    <div className='left-menu'>
                                        <div className={active === 10 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.listCardManage()}
                                        ><i class="fas fa-list"></i> <FormattedMessage id="admin.listCard" /></div>
                                        <div className={active === 7 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.listSocialManage()}
                                        ><i class="fas fa-list"></i> <FormattedMessage id="admin.listSocial" /></div>
                                        <div className={active === 8 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.listBankManage()}
                                        ><i class="fas fa-list"></i> <FormattedMessage id="admin.listBank" /></div>
                                        <div className={active === 9 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.listCustomManage()}
                                        ><i class="fas fa-list"></i> <FormattedMessage id="admin.listCustom" /></div>
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
                                </div>
                                <div className='information-content-right'>
                                    {active === 0 ? <User displayUser={this.displayUser} /> : ''}
                                    {active === 1 ? <Social displayUser={this.displayUser} /> : ''}
                                    {active === 2 ? <Email displayUser={this.displayUser} /> : ''}
                                    {active === 3 ? <Phone displayUser={this.displayUser} /> : ''}
                                    {active === 4 ? <Bank displayUser={this.displayUser} /> : ''}
                                    {active === 5 ? <Location displayUser={this.displayUser} /> : ''}
                                    {active === 6 ? <Custom displayUser={this.displayUser} /> : ''}
                                    {active === 7 ? <ListSocial /> : ''}
                                    {active === 8 ? <ListBank /> : ''}
                                    {active === 9 ? <ListCustom /> : ''}
                                    {active === 10 ? <ListCard /> : ''}
                                    {active === 11 ? <News /> : ''}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment >
        );
    }

}

const mapStateToProps = state => {
    return {
        isAdmin: state.user.isAdmin,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminManage));
