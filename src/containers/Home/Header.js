import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Header.scss';
import './HeaderMobile.scss';
import * as actions from '../../store/actions'
import logo from '../../assets/logo_02.png'
import { LANGUAGES, path } from "../../utils";
import { setLanguage, handleLoginApi } from '../../services/userService';
import imgLogin from '../../assets/img-login.jpg'
import { toast } from 'react-toastify';
class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: this.props.userInfo,
            SignIn: false,
            user: 'lengocphuclnp90@gmail.com',
            password: '123456',
            errMessage: '',
            openMenuMobile: false,
        }
    }

    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    changeLanguage = async (language) => {
        this.setState({
            errMessage: ''
        })
        if (this.props.isUser) {
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
        } else {
            this.props.changeLanguage(language);
        }
    }
    handleOnChangeInput = (event, id) => {
        this.setState({
            errMessage: ''
        })
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    login = async () => {
        if (this.state.password === '' || this.state.user === '') {
            toast.warning("Vui lòng nhập đủ thông tin rồi thử lại !");
        } else {
            try {
                let data = await handleLoginApi(this.state.user, this.state.password);
                let errMessage = '';
                if (data && data.errCode === 1 || data.errCode === 2) {
                    if (this.props.language === LANGUAGES.VI) {
                        errMessage = 'Email không tồn tại !'
                    } else {
                        errMessage = 'Email does not exist !'
                    }
                } else if (data && data.errCode === 3) {
                    if (this.props.language === LANGUAGES.VI) {
                        errMessage = 'Mật khẩu không chính xác !'
                    } else {
                        errMessage = 'Incorrect password !'
                    }
                } else if (data && data.errCode === 4) {
                    if (this.props.language === LANGUAGES.VI) {
                        errMessage = 'Tài khoản đã bị vô hiệu hóa !'
                    } else {
                        errMessage = 'Account has been disabled!'
                    }
                }
                this.setState({
                    errMessage: errMessage,
                })
                if (data && data.errCode === 0) {
                    if (data.user.language === 'vi') {
                        this.props.changeLanguage(LANGUAGES.VI);
                    } else {
                        this.props.changeLanguage(LANGUAGES.EN);
                    }
                    await this.props.userLoginSuccess(data.user);
                    let link = window.location.href;
                    if (link.includes('card') === true || link.includes('profile') === true || link.includes('verifi') === true) {
                        this.setState({
                            SignIn: false,
                        })
                    } else {
                        window.location = path.USER_MANAGER;
                    }
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.data) {
                        this.setState({
                            errMessage: error.response.data.message
                        })
                    }
                }
            }
        }
    }
    hideSignIn = (event) => {
        if (event.target.id === 'user-sign') {
            this.setState({
                SignIn: false
            })
        }
    }
    render() {
        let language = this.props.language;
        let userInfo = this.props.userInfo;
        let avt = '';
        if (userInfo) {
            if (userInfo.image) {
                avt = new Buffer(userInfo.image, 'base64').toString('binary');
            }
        }
        return (
            <React.Fragment>
                {this.state.SignIn === true &&
                    <React.Fragment>
                        <div className='sign-in' id='user-sign' onClick={(event) => this.hideSignIn(event)}>
                            <div className='sign-in-box'>
                                <div className='box-left'>
                                    <img src={imgLogin} />
                                </div>
                                <div className='box-right'>
                                    <div className='right-title'>
                                        <div className='message'>
                                            {this.state.errMessage !== '' &&
                                                <React.Fragment>
                                                    <i class="fas fa-user-astronaut"></i>{this.state.errMessage}
                                                </React.Fragment>
                                            }
                                        </div>
                                        <i class="fas fa-times"
                                            onClick={() => this.setState({
                                                SignIn: false
                                            })}
                                        ></i>
                                    </div>
                                    <div className='right-content'>
                                        <b>Email</b>
                                        <input value={this.state.user}
                                            onChange={(event) => this.handleOnChangeInput(event, 'user')}
                                        ></input>
                                    </div>
                                    <div className='right-content'>
                                        <b><FormattedMessage id="home.password" /></b>
                                        <input type='password' value={this.state.password}
                                            onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                        ></input>
                                    </div>
                                    <div className='right-submit'>
                                        <div className='submit-btn'
                                            onClick={() => this.login()}
                                        ><FormattedMessage id="home.signIn" /></div>
                                        <span><FormattedMessage id="home.forget" /></span>
                                    </div>
                                    <div className='right-creat-account'>
                                        <span><FormattedMessage id="home.notAccount" /></span>
                                        <div className='creat-btn'
                                            onClick={() => {
                                                window.location = `${path.BASE_URL}/sign-up`;
                                            }}
                                        ><FormattedMessage id="home.join" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment >
                }
                <div className='header-mobile'>
                    <div className='header-logo'>
                        <img src={logo}
                            onClick={() => {
                                window.location = `${path.BASE_URL}/`;
                            }}
                        />
                    </div>
                    <div className='header-menu'>
                        {this.props.isUser === true ?
                            <React.Fragment>
                                <img src={avt} className='avt'
                                    onClick={() => {
                                        this.setState({
                                            openMenuMobile: !this.state.openMenuMobile
                                        })
                                    }}
                                />
                            </React.Fragment> :
                            <React.Fragment>
                                <i class="fas fa-bars"
                                    onClick={() => {
                                        this.setState({
                                            openMenuMobile: !this.state.openMenuMobile
                                        })
                                    }}
                                ></i>
                            </React.Fragment>
                        }
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
                                {this.props.isUser === true ?
                                    <React.Fragment>
                                        <div className='login'
                                            onClick={() => {
                                                window.location = `${path.BASE_URL}/login`;
                                            }}
                                        ><FormattedMessage id="home.dashboard" /></div>
                                        <div className='signup'
                                            onClick={this.props.processLogout}
                                        ><FormattedMessage id="userManage.signout" /></div>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <div className='login'
                                            onClick={() => this.setState({
                                                SignIn: true,
                                                openMenuMobile: false
                                            })}
                                        ><FormattedMessage id="home.signIn" /></div>
                                        <div className='signup'
                                            onClick={() => {
                                                window.location = `${path.BASE_URL}/sign-up`;
                                            }}
                                        ><FormattedMessage id="home.signUp" /></div>
                                    </React.Fragment>
                                }
                            </div>
                        </React.Fragment>
                    }
                </div>
                {/* phần giao diện pc */}
                <div className='header'>
                    <div className='header-logo'>
                        <img src={logo}
                            onClick={() => {
                                window.location = `${path.BASE_URL}/`;
                            }}
                        />
                    </div>
                    <div className='header-menu'>
                        <div className='header-document'>
                            <a href={`${path.BASE_URL}${path.POST_GUIDE}`}><FormattedMessage id="home.guide" /></a>
                            <a href={`${path.BASE_URL}${path.POST_RULE}`}><FormattedMessage id="home.rule" /></a>
                        </div>
                        <div className='header-btn'>
                            {this.props.isUser === true ?
                                <React.Fragment>
                                    <div className='dashboard'
                                        onClick={() => {
                                            window.location = `${path.BASE_URL}/login`;
                                        }}
                                    >
                                        <span><FormattedMessage id="home.dashboard" /></span>
                                        <img src={avt} className='avt' />
                                    </div>
                                </React.Fragment> :
                                <React.Fragment>
                                    <div className='btn-signup'
                                        onClick={() => {
                                            window.location = `${path.BASE_URL}/sign-up`;
                                        }}
                                    >
                                        <FormattedMessage id="home.signUp" />
                                    </div>
                                    <div className='btn-signin'
                                        onClick={() => this.setState({ SignIn: true })}
                                    >
                                        <FormattedMessage id="home.signIn" />
                                    </div>
                                </React.Fragment>
                            }
                            <div className='btn-language'>
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
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isUser: state.user.isUser,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: (language) => dispatch(actions.changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
