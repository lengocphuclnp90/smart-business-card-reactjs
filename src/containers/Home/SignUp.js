import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './SignUp.scss';
import * as actions from '../../store/actions'
import { LANGUAGES, path, CommonUtils } from "../../utils";
import { signUp } from '../../services/userService';
import { getListService } from '../../services/userService';
import { toast } from 'react-toastify';
import imgLogin from '../../assets/img-login.jpg'
import Header from './Header';
import Footer from './Footer';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avt: '',
            avtPreview: '',
            email: 'phucb1809500@student.ctu.edu.vn',
            errMessage: '',
            password: '123456',
            rePassword: '123456',
            name: 'Lê Ngọc Phúc',
            phone: '098889999',
            sex: 'M',
            intro: 'Là một người tài giỏi bạn cần có cả EQ và IQ',
            link: 'lengocphuclnp90',

            waitEmail: false,
            done: false,
        }
    }
    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

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
    checkSignUp = async () => {
        let data = {
            type: 'check',
            language: this.props.language,
            name: this.state.name,
            email: this.state.email,
            link: this.state.link,
        }
        let res = await signUp(data);
        console.log("ress", res);
        let errMessage = '';
        if (res.err === 0) {
            if (this.props.language === LANGUAGES.VI) {
                errMessage = 'Email này đã có tài khoản !'
            } else {
                errMessage = 'This email already has an account !'
            }
        } else if (res.err === 1) {
            if (this.props.language === LANGUAGES.VI) {
                errMessage = 'Liên kết đã được sử dụng !'
            } else {
                errMessage = 'Link already in use!'
            }
        }
        this.setState({
            errMessage: errMessage
        })
        if (res.sendEmail === true) {
            this.setState({
                waitEmail: true
            }, () => {
                setInterval(async () => {
                    let data = {
                        type: 'checkToken',
                        email: this.state.email,
                    }
                    let res = await signUp(data);
                    if (res.res === 'OK') {
                        let data = {
                            type: 'save',
                            avt: this.state.avt,
                            email: this.state.email,
                            password: this.state.password,
                            name: this.state.name,
                            phone: this.state.phone,
                            sex: this.state.sex,
                            intro: this.state.intro,
                            link: this.state.link,
                            language: this.props.language,
                        }
                        let res = await signUp(data);
                        if (res.err) {
                            toast.error("Đã xảy ra lỗi !!!");
                        } else {
                            this.setState({
                                done: true
                            })
                        }
                    }
                }, 3000);
            })
        }
    }
    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            console.log('base 64 test', base64);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                avtPreview: objectUrl,
                avt: base64
            })
        }
    }
    reSignUp = () => {
        let warning = prompt("Bạn có chắc chắn muốn đăng ký lại ? Nhập YES để xác nhận hoặc bấm bất kì để hùy.", "");
        if (warning === "YES") {
            this.setState({
                avt: '',
                avtPreview: '',
                email: '',
                errMessage: '',
                password: '',
                rePassword: '',
                name: '',
                phone: '',
                sex: 'M',
                intro: '',
                link: '',
                waitEmail: false,
            })
        }
    }
    render() {

        return (
            <React.Fragment>
                <Header />
                <div className='sign-up-page'>
                    <div className='sign-up-page-table'>
                        {this.state.waitEmail === true ?
                            <React.Fragment>
                                <div className='sign-up-box'>
                                    {this.state.done === false ?
                                        <React.Fragment>
                                            <div className='sign-up-title'>
                                                <FormattedMessage id="home.waitTitle" />
                                            </div>
                                            <div className='check-status'>
                                                <span><FormattedMessage id="home.waitContent" /></span>
                                            </div>
                                            <div className='check-again'>
                                                <div className='check-again-btn'
                                                    onClick={() => this.reSignUp()}
                                                ><FormattedMessage id="home.reSignUp" /></div>
                                            </div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='sign-up-title'>
                                                <FormattedMessage id="home.success" />
                                            </div>
                                            <div className='check-again'>
                                                <div className='check-again-btn'
                                                    onClick={() => window.location = `${path.BASE_URL}/login`}
                                                ><FormattedMessage id="home.signIn" /></div>
                                            </div>
                                        </React.Fragment>
                                    }

                                </div>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className='sign-up-box'>
                                    <div className='sign-up-title'>
                                        <FormattedMessage id="home.signUpAccount" />
                                    </div>
                                    <div className='sign-up-content'>
                                        <span>Email</span>
                                        <input value={this.state.email}
                                            onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                        ></input>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.password" /></span>
                                        <input value={this.state.password}
                                            onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                        ></input>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.rePass" /></span>
                                        <input value={this.state.rePassword}
                                            onChange={(event) => this.handleOnChangeInput(event, 'rePassword')}
                                        ></input>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.avt" /></span>
                                        <div className='upload-avt'>
                                            <input id="upload-img" type="file" hidden
                                                onChange={(event) => this.handleOnchangeImage(event)}
                                            />
                                            <label className="lable-upload" htmlFor="upload-img">
                                                <FormattedMessage id="home.upload" /> <i className="fa fa-upload" aria-hidden="true"></i>
                                            </label>
                                            {this.state.avtPreview !== '' &&
                                                <img src={this.state.avtPreview} />
                                            }
                                        </div>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.name" /></span>
                                        <input value={this.state.name}
                                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                        ></input>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.phone" /></span>
                                        <input value={this.state.phone}
                                            onChange={(event) => this.handleOnChangeInput(event, 'phone')}
                                        ></input>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.sex" /></span>
                                        <select
                                            value={this.state.sex}
                                            onChange={(event) => this.handleOnChangeInput(event, 'sex')}
                                        >
                                            <FormattedMessage id="home.male" >
                                                {(message) => <option value='M'>{message}</option>}
                                            </FormattedMessage>
                                            <FormattedMessage id="home.feMale" >
                                                {(message) => <option value='F'>{message}</option>}
                                            </FormattedMessage>
                                            <FormattedMessage id="home.other" >
                                                {(message) => <option value='O'>{message}</option>}
                                            </FormattedMessage>
                                        </select>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.intro" /></span>
                                        <textarea value={this.state.intro} rows='3'
                                            onChange={(event) => this.handleOnChangeInput(event, 'intro')}
                                        ></textarea>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><FormattedMessage id="home.link" /></span>
                                        <input value={this.state.link}
                                            onChange={(event) => this.handleOnChangeInput(event, 'link')}
                                        ></input>
                                    </div>
                                    <div className='sign-up-content'>
                                        <span><i class="fas fa-info-circle"></i> <a href={`${path.BASE_URL}${path.POST_RULE}`} target='_blank'><FormattedMessage id="home.rule" /></a></span>
                                    </div>
                                    <div className='sign-up-submit'>
                                        <div className='submit-err'>
                                            {this.state.errMessage !== '' &&
                                                <React.Fragment>
                                                    <i class="fas fa-user-astronaut"></i>{this.state.errMessage}
                                                </React.Fragment>
                                            }
                                        </div>
                                        <div className='submit-btn'
                                            onClick={() => this.checkSignUp()}
                                        >Đăng ký</div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }

                    </div>
                    <Footer />
                </div >
            </React.Fragment >
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
