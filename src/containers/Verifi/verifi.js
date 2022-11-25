import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import './verifi.scss';
import { updateProfileService, getSchedule, signUp, forget } from '../../services/userService';
import { setStatusS3, planSchedule } from '../../services/verifiService';
import { toast } from 'react-toastify';
import Header from '../Home/Header';
import Footer from '../Home/Footer';

class verifi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusKey: 0,
            showContent: false,
            content: '',
            value: '',
            token: '',
            showScheduleUpdate: false,
            memberPhone: '',
            time: '',
            location: '',
            content: '',
            memberId: '',
            showForget: false,

            password: '',
            rePassword: '',
            email: ''
        }
    }

    async componentDidMount() {
        const urlParams = new URLSearchParams(this.props.location.search);
        let type = urlParams.get('type');
        if (urlParams.get('token') === '') {
            this.setState({
                statusKey: 1
            })
        } else {
            if (type === 'S3') {
                let token = urlParams.get('token');
                let value = urlParams.get('value');
                let data = {
                    token: token,
                    status: value,
                }
                let res = await setStatusS3(data);
                if (res.err) {
                    this.setState({
                        statusKey: 1
                    })
                } else if (res.res === 'OK') {
                    this.setState({
                        statusKey: 2
                    })
                }
            } else if (type === 'lockprofile' || type === 'full') {
                let token = urlParams.get('token');
                let id = urlParams.get('id');
                let value = urlParams.get('value');
                let data = {
                    id: id,
                    token: token,
                    type: type,
                    value: value,
                }
                let newUserInfo = await updateProfileService(data);
                if (newUserInfo.err) {
                    this.setState({
                        statusKey: 1
                    })
                } else {
                    this.setState({
                        statusKey: 2
                    })
                    // this.props.updateProfile(data);
                }
            } else if (type === 'schedule') {
                let value = urlParams.get('value')
                let token = urlParams.get('token');

                if (value === 's4a' || value === 's4b') {
                    this.setState({
                        showContent: true,
                        statusKey: 999,
                        value: value,
                        token: token
                    })
                } else if (value === 'ua' || value === 'ub') {
                    let data = {
                        token: token,
                        status: value,
                    }
                    let res = await getSchedule(data);
                    if (!res || res.err) {
                        this.setState({
                            statusKey: 2
                        })
                    } else {
                        this.setState({
                            statusKey: 999,
                            showScheduleUpdate: true,
                            time: res.time,
                            location: res.location,
                            content: res.content,
                            memberPhone: res.memberPhone,
                            value: value,
                            token: token,
                            memberId: res.memberId,
                        })
                    }
                } else {
                    let data = {
                        token: token,
                        status: value,
                    }
                    let res = await planSchedule(data);
                    if (res.err) {
                        this.setState({
                            statusKey: 1
                        })
                    } else {
                        this.setState({
                            statusKey: 2
                        })
                    }
                }

            } else if (type === 'SIGNUP') {
                let token = urlParams.get('token');
                let email = urlParams.get('email');
                let data = {
                    token: token,
                    email: email,
                    type: 'TOKEN'
                }
                let res = await signUp(data);
                if (res.err) {
                    this.setState({
                        statusKey: 1
                    })
                } else if (res.res === 'OK') {
                    this.setState({
                        statusKey: 2
                    })
                }
            } else if (type === 'FORGET') {
                let token = urlParams.get('token');
                let email = urlParams.get('email');
                this.setState({
                    token: token,
                    email: email,
                })
                let data = {
                    token: token,
                    email: email,
                    type: 'TOKEN'
                }
                let res = await forget(data);
                console.log(res);
                if (res.err) {
                    this.setState({
                        statusKey: 1
                    })
                } else if (res.res === 'OK') {
                    this.setState({
                        showForget: true,
                        statusKey: 'XXX'
                    })
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    checkContent = async () => {
        let content = this.state.content;
        if (content === '') {
            alert("Bạn cần phải nhập lý do hủy cuộc hẹn !");
        } else {
            let data = {
                token: this.state.token,
                status: this.state.value,
                content: this.state.content,
            }
            let res = await planSchedule(data);
            if (res.err) {
                this.setState({
                    statusKey: 1,
                    showContent: false,
                })
            } else {
                this.setState({
                    statusKey: 2,
                    showContent: false,
                })
            }
        }
    }
    updateSchedule = async () => {
        let time = this.state.time;
        let date = this.state.date;
        let location = this.state.location;
        let memberPhone = this.state.memberPhone;
        let content = this.state.content;
        if (time === '' || location === '' || memberPhone === '' || content === '') {
            alert("Bạn cần điền đầy đủ thông tin !!!");
        } else {
            let data = {
                status: this.state.value,
                token: this.state.token,
                time: time,
                location: location,
                content: content,
                memberPhone: memberPhone,
            }
            let d = new Date();
            let date = new Date(data.time);
            let dNow = d.getTime();
            let dateChoose = date.getTime();
            if ((dateChoose - dNow) < 43200000 || (dateChoose - dNow) > 2592000000) {
                alert("Chỉ có thể đặt lịch hẹn vào thời gian cách hiện tại tối thiểu 12 giờ và trong tối đa 30 ngày kế tiếp !");
            } else {
                let res = await planSchedule(data);
                if (!res || res.err) {
                    this.setState({
                        statusKey: 1,
                        showScheduleUpdate: false,
                    })
                } else {
                    this.setState({
                        statusKey: 2,
                        showScheduleUpdate: false,
                    })
                }
            }
        }
    }
    updatePass = async () => {
        let pass = this.state.password;
        let rePass = this.state.rePassword;
        if (pass === '' || rePass === '') {
            alert("Vui lòng điền đầy đủ thông tin !");
        } else {
            if (pass === rePass) {
                let data = {
                    token: this.state.token,
                    email: this.state.email,
                    password: this.state.password,
                    type: 'update'
                }
                let res = await forget(data);
                if (res.err) {
                    this.setState({
                        statusKey: 1
                    })
                } else if (res.res === 'OK') {
                    this.setState({
                        showForget: false,
                        statusKey: 2,
                    })
                }
            } else {
                alert("Mật khẩu không giống nhau !");
            }
        }

    }
    closePage = () => {
        window.open('', '_self').close();
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    render() {
        return (
            <React.Fragment>
                <Header />
                <div className='verifi'>
                    <div className='verifi-box'>
                        {
                            this.state.showForget === true &&
                            <React.Fragment>
                                <div className='title warning'><FormattedMessage id="verifi.newPassTitle" /></div>
                                <div className='input-content'>
                                    <div className='update-content-input'>
                                        <b><FormattedMessage id="verifi.newPass" /> </b>
                                        <input value={this.state.password}
                                            onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                            type='password'
                                        >
                                        </input>
                                    </div>
                                </div>
                                <div className='input-content'>
                                    <div className='update-content-input'>
                                        <b><FormattedMessage id="verifi.reNewPass" /> </b>
                                        <input value={this.state.rePassword}
                                            onChange={(event) => this.handleOnChangeInput(event, 'rePassword')}
                                            type='password'
                                        >
                                        </input>
                                    </div>
                                </div>
                                <div className='btn' onClick={() => this.updatePass()}>OK</div>
                            </React.Fragment>
                        }
                        {
                            this.state.showScheduleUpdate === true &&
                            <React.Fragment>
                                <div className='title warning'><FormattedMessage id="verifi.update" /></div>
                                {this.state.value === 'ua' && this.state.memberId === 'hide' &&
                                    < div className='input-content'>
                                        <div className='update-content-input'>
                                            <b><FormattedMessage id="verifi.phone" /> </b>
                                            <input value={this.state.memberPhone}
                                                onChange={(event) => this.handleOnChangeInput(event, 'memberPhone')}
                                            >
                                            </input>
                                        </div>
                                    </div>
                                }
                                <div className='input-content'>
                                    <div className='update-content-input'>
                                        <b><FormattedMessage id="verifi.time" /></b>
                                        <input type='datetime-local' value={this.state.time}
                                            onChange={(event) => this.handleOnChangeInput(event, 'time')}
                                        >
                                        </input>
                                    </div>
                                </div>
                                <div className='input-content'>
                                    <div className='update-content-input'>
                                        <b><FormattedMessage id="verifi.location" /></b>
                                        <input value={this.state.location}
                                            onChange={(event) => this.handleOnChangeInput(event, 'location')}
                                        >
                                        </input>
                                    </div>
                                </div>
                                <div className='input-content'>
                                    <div className='update-content-input'>
                                        <b><FormattedMessage id="verifi.content" /></b>
                                        <textarea rows='4'
                                            value={this.state.content}
                                            onChange={(event) => this.handleOnChangeInput(event, 'content')}
                                        >
                                        </textarea>
                                    </div>
                                </div>
                                <div className='btn' onClick={() => this.updateSchedule()}>XÁC NHẬN</div>
                            </React.Fragment>
                        }
                        {
                            this.state.showContent === true &&
                            <React.Fragment>
                                <div className='title warning'><FormattedMessage id="verifi.cancel" /></div>
                                <div className='input-content'>
                                    <textarea rows='4'
                                        value={this.state.content}
                                        onChange={(event) => this.handleOnChangeInput(event, 'content')}
                                    >
                                    </textarea>
                                </div>
                                <div className='btn' onClick={() => this.checkContent()}>OK</div>
                            </React.Fragment>
                        }
                        {
                            this.state.statusKey === 0 &&
                            <React.Fragment>
                                <div className='title warning'><FormattedMessage id="verifi.err" /></div>
                                <div className='icon warning'><i class="fas fa-sync-alt"></i></div>
                                <div className='btn' onClick={() => this.closePage()}>OK</div>
                            </React.Fragment>
                        }
                        {
                            this.state.statusKey === 1 &&
                            <React.Fragment>
                                <div className='title err'><FormattedMessage id="verifi.empty" /></div>
                                <div className='icon err'><i class="fas fa-exclamation-triangle"></i></div>
                                <div className='btn' onClick={() => this.closePage()}>OK</div>
                            </React.Fragment>
                        }
                        {
                            this.state.statusKey === 2 &&
                            <React.Fragment>
                                <div className='title'><FormattedMessage id="verifi.ok" /></div>
                                <div className='icon' ><i class="fas fa-check-circle"></i></div>
                                <div className='btn' onClick={() => this.closePage()}>OK</div>
                            </React.Fragment>
                        }


                    </div>
                    <Footer />
                </div >
            </React.Fragment>

        )
    }

}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        // updateProfile: (newUserInfo) => dispatch(actions.updateProfile(newUserInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(verifi);
