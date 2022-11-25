import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './SignIn.scss';
import * as actions from '../../store/actions'
import { LANGUAGES, path } from "../../utils";
import { setLanguage, handleLoginApi, forget } from '../../services/userService';
import { getListService } from '../../services/userService';
import { toast } from 'react-toastify';
import imgLogin from '../../assets/img-login.jpg'
import Header from './Header';
import Footer from './Footer';
import { isBuffer } from 'lodash';

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',
            errMessage: '',

            forget: false,
        }
    }
    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

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
                    window.location = path.USER_MANAGER;
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
    forget = async () => {
        this.setState({
            errMessage: ''
        })
        if (this.state.user !== '') {
            let data = {
                type: 'check',
                email: this.state.user
            }
            let res = await forget(data);
            let errMessage = '';
            if (res.err) {
                if (this.props.language === LANGUAGES.VI) {
                    errMessage = 'Email không tồn tại !'
                } else {
                    errMessage = 'Email does not exist !'
                }
                this.setState({
                    errMessage: errMessage
                })
            } else {
                if (this.props.language === LANGUAGES.VI) {
                    toast.success("Đã gửi email đặt lại mật khẩu !");
                } else {
                    toast.success("Password reset email sent");
                }
                this.setState({
                    errMessage: '',
                    user: '',
                    forget: false
                })
            }
        }
    }
    render() {
        return (
            <React.Fragment>
                <Header />
                <div className='sign-in-page'>
                    <div className='sign-in-page-table'>
                        {this.state.forget === true ?
                            <React.Fragment>
                                <div className='sign-in-box'>
                                    <div className='box-right'>
                                        <div className='right-title'>
                                            <div className='t1'>
                                                <span>Đặt lại mật khẩu</span>
                                            </div>
                                        </div>
                                        <div className='right-title'>
                                            <div className='message'>
                                                {this.state.errMessage !== '' &&
                                                    <React.Fragment>
                                                        <i class="fas fa-user-astronaut"></i>{this.state.errMessage}
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                        <div className='right-content'>
                                            <b>Email:</b>
                                            <input value={this.state.user}
                                                onChange={(event) => this.handleOnChangeInput(event, 'user')}
                                            ></input>
                                        </div>
                                        <div className='right-creat-account'>
                                            <span>Đăng nhập
                                                <b
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => this.setState({
                                                        user: '',
                                                        password: '',
                                                        errMessage: '',
                                                        forget: false
                                                    })}
                                                > tại đây</b> hoặc đặt lại mật khẩu
                                            </span>
                                            <div className='creat-btn'
                                                onClick={() => this.forget()}
                                            >Gửi email lấy lại mật khẩu</div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className='sign-in-box'>
                                    <div className='box-right'>
                                        <div className='right-title'>
                                            <div className='t1'>
                                                <span>ĐĂNG NHẬP</span>
                                            </div>
                                        </div>
                                        <div className='right-title'>
                                            <div className='message'>
                                                {this.state.errMessage !== '' &&
                                                    <React.Fragment>
                                                        <i class="fas fa-user-astronaut"></i>{this.state.errMessage}
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                        <div className='right-content'>
                                            <b>Email:</b>
                                            <input value={this.state.user}
                                                onChange={(event) => this.handleOnChangeInput(event, 'user')}
                                            ></input>
                                        </div>
                                        <div className='right-content'>
                                            <b>Mật khẩu:</b>
                                            <input type='password' value={this.state.password}
                                                onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                            ></input>
                                        </div>
                                        <div className='right-submit'>
                                            <div className='submit-btn'
                                                onClick={() => this.login()}
                                            >Đăng nhập</div>
                                            <span
                                                onClick={() => this.setState({
                                                    user: '',
                                                    forget: true,
                                                })}
                                            >Bạn quên mật khẩu?</span>
                                        </div>
                                        <div className='right-creat-account'>
                                            <span>Bạn chưa có tài khoản?</span>
                                            <div className='creat-btn'
                                                onClick={() => {
                                                    window.location = `${path.BASE_URL}/sign-up`;
                                                }}
                                            >Tham gia cùng với chúng tôi</div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }

                    </div>
                    <Footer />
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
