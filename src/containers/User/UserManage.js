import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import './UserManageMobile.scss';
import * as actions from '../../store/actions'
import logo from '../../assets/logo_02.png'
import { LANGUAGES, path } from "../../utils";
import AccountManage from './Account/AccountManage';
import InformationManage from './Information/InformationManage';
import AdminManage from './Admin/AdminManage';
import Viewer from './Viewer/Viewer';
import History from './History/History';
import CardManage from './Card/CardManage';
import Schedule from './Schedule/Schedule';
import { setLanguage } from '../../services/userService';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 1,
        }
    }

    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    acountManage = () => {
        this.setState({
            active: 1,
            openMenuMobile: false,
        })
    }
    profileManage = () => {
        this.setState({
            active: 2,
            openMenuMobile: false,
        })
        this.props.history.push(+`/profile-manager`);
    }
    cardManage = () => {
        this.setState({
            active: 3,
            openMenuMobile: false,
        })
    }
    calendarManage = () => {
        this.setState({
            active: 4,
            openMenuMobile: false,
        })
    }
    customerManage = () => {
        this.setState({
            active: 5,
            openMenuMobile: false,
        })
    }
    historyManage = () => {
        this.setState({
            active: 6,
            openMenuMobile: false,
        })
    }
    adminManage = () => {
        this.setState({
            active: 7,
            openMenuMobile: false,
        })
    }
    changeLanguage = async (language) => {
        if (language === LANGUAGES.EN) {
            let data = {
                id: this.props.userInfo.id,
                language: LANGUAGES.EN
            }
            await setLanguage(data);
            this.props.changeLanguage(LANGUAGES.EN);
        } else {
            let data = {
                id: this.props.userInfo.id,
                language: LANGUAGES.VI
            }
            await setLanguage(data);
            this.props.changeLanguage(LANGUAGES.VI);
        }
    }
    render() {
        let userInfo = this.props.userInfo;
        let imageBase64 = '';
        if (userInfo) {
            if (userInfo.image) {
                imageBase64 = new Buffer(userInfo.image, 'base64').toString('binary');
            }
        }
        let active = this.state.active;
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className='user-manage-mobile'>
                    <div className='user-manage-content'>
                        <div className='menu-top'>
                            <div className='header-mobile'>
                                <div className='header-logo'>
                                    <img src={logo}
                                        onClick={() => {
                                            window.location = `${path.BASE_URL}/`;
                                        }}
                                    />
                                </div>
                                <div className='header-menu'>
                                    <img src={imageBase64} className='avt'
                                        onClick={() => {
                                            this.setState({
                                                openMenuMobile: !this.state.openMenuMobile
                                            })
                                        }}
                                    />
                                </div>
                                {this.state.openMenuMobile === true &&
                                    <React.Fragment>
                                        <div className='header-submenu'>
                                            <div className='language'>
                                                <i class="fas fa-globe"></i>
                                                <span
                                                    className={language === LANGUAGES.VI ? 'active' : ''}
                                                    onClick={() => this.changeLanguage(LANGUAGES.VI)}
                                                >VN</span>
                                                <span
                                                    onClick={() => this.changeLanguage(LANGUAGES.EN)}
                                                    className={language === LANGUAGES.EN ? 'active' : ''}
                                                >EN</span>
                                            </div>
                                            <div className={active === 1 ? 'content-menu-mobile active' : 'content-menu-mobile'}
                                                onClick={() => { this.acountManage() }}
                                            ><i className="fas fa-user-circle"></i><FormattedMessage id="userManage.account" /></div>
                                            <div className={active === 2 ? 'content-menu-mobile active' : 'content-menu-mobile'}
                                                onClick={() => { this.profileManage() }}
                                            ><i class="fas fa-id-card-alt"></i><FormattedMessage id="userManage.profile" /></div>
                                            <div className={active === 3 ? 'content-menu-mobile active' : 'content-menu-mobile'}
                                                onClick={() => { this.cardManage() }}
                                            ><i class="far fa-address-card"></i><FormattedMessage id="userManage.card" /></div>
                                            <div className={active === 4 ? 'content-menu-mobile active' : 'content-menu-mobile'}
                                                onClick={() => { this.calendarManage() }}
                                            ><i className="far fa-calendar-alt"></i><FormattedMessage id="userManage.schedule" /></div>
                                            <div className={active === 5 ? 'content-menu-mobile active' : 'content-menu-mobile'}
                                                onClick={() => { this.customerManage() }}
                                            ><i className="fas fa-users"></i><FormattedMessage id="userManage.viewer" /></div>
                                            <div className={active === 6 ? 'content-menu-mobile active' : 'content-menu-mobile'}
                                                onClick={() => { this.historyManage() }}
                                            ><i class="fas fa-history"></i><FormattedMessage id="userManage.history" /></div>
                                            <div className='content-menu-mobile'
                                                onClick={this.props.processLogout}
                                                style={{ color: 'red' }}
                                            ><i class="fas fa-sign-out-alt"></i><FormattedMessage id="userManage.signout" /></div>
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                        <div className='body-moblie'>
                            <div className='body-content-mobile'>
                                {active === 1 && <AccountManage />}
                                {active === 2 && <InformationManage />}
                                {active === 3 && <CardManage />}
                                {active === 4 && <Schedule />}
                                {active === 5 && <Viewer />}
                                {active === 6 && <History />}
                            </div>
                        </div>

                    </div>
                </div >
                <div className='user-manage'>
                    <div className='user-manage-content'>
                        <div className='menu-left'>
                            <div className='logo'>
                                <a href='/'><img src={logo} /></a>
                            </div>
                            <div className='menu'>
                                <div className={active === 1 ? 'subMenu active' : 'subMenu'}
                                    onClick={() => { this.acountManage() }}
                                ><i className="fas fa-user-circle"></i><FormattedMessage id="userManage.account" /></div>
                                <div className={active === 2 ? 'subMenu active' : 'subMenu'}
                                    onClick={() => { this.profileManage() }}
                                ><i class="fas fa-id-card-alt"></i><FormattedMessage id="userManage.profile" /></div>
                                <div className={active === 3 ? 'subMenu active' : 'subMenu'}
                                    onClick={() => { this.cardManage() }}
                                ><i class="far fa-address-card"></i><FormattedMessage id="userManage.card" /></div>
                                <div className={active === 4 ? 'subMenu active' : 'subMenu'}
                                    onClick={() => { this.calendarManage() }}
                                ><i className="far fa-calendar-alt"></i><FormattedMessage id="userManage.schedule" /></div>
                                <div className={active === 5 ? 'subMenu active' : 'subMenu'}
                                    onClick={() => { this.customerManage() }}
                                ><i className="fas fa-users"></i><FormattedMessage id="userManage.viewer" /></div>
                                <div className={active === 6 ? 'subMenu active' : 'subMenu'}
                                    onClick={() => { this.historyManage() }}
                                ><i class="fas fa-history"></i><FormattedMessage id="userManage.history" /></div>
                                {this.props.isAdmin === true && <React.Fragment>
                                    <div className={active === 7 ? 'subMenu active' : 'subMenu'}
                                        onClick={() => { this.adminManage() }}
                                    ><i class="fas fa-user-cog"></i><FormattedMessage id="userManage.admin" /></div>
                                </React.Fragment>}
                            </div>
                            <div className='user-footer'>
                                {`${userInfo.vip}` === 'PAID' ?
                                    <React.Fragment>
                                        <div className='icon verified'><i class="far fa-check-circle"></i></div>
                                        <div className='title verified'><FormattedMessage id="userManage.verified" /></div>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <div className='icon '><i class="fas fa-user-secret"></i></div>
                                        <div className='title'><FormattedMessage id="userManage.unconfirmed" /></div>
                                    </React.Fragment>
                                }

                            </div>
                        </div>
                        <div className='menu-top'>
                            <div className="welcome"><i className="fas fa-rocket"></i><FormattedMessage id="userManage.welcome" /> <b>{userInfo.name}</b>, <FormattedMessage id="userManage.dashboard" />.</div>
                            <div className='language-signout'>
                                <div className='language'>
                                    <i class="fas fa-globe"></i>
                                    <div className={this.props.language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><b onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</b></div>
                                    <div className={this.props.language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><b onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</b></div>
                                </div>
                                <div className='signout' onClick={this.props.processLogout} title='Log out' ><FormattedMessage id="userManage.signout" /><img src={imageBase64}></img></div>
                            </div>
                        </div>
                        <div className='body'>
                            <div className='body-content'>
                                {active === 1 && <AccountManage />}
                                {active === 2 && <InformationManage />}
                                {active === 3 && <CardManage />}
                                {active === 4 && <Schedule />}
                                {active === 5 && <Viewer />}
                                {active === 6 && <History />}
                                {active === 7 && <AdminManage />}
                            </div>
                        </div>

                    </div>
                </div >
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isUser: state.user.isUser,
        isAdmin: state.user.isAdmin,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: (language) => dispatch(actions.changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
