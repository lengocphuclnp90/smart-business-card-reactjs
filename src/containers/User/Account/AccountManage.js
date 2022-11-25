import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import './AccountManage.scss';
import './AccountManageMobile.scss';
import { LANGUAGES, CommonUtils, path, LIMIT } from "../../../utils";
import * as actions from "../../../store/actions"
import { toast } from "react-toastify";
import Cookies from 'js-cookie'
import _ from 'lodash';
import { updateProfileService, getNews } from '../../../services/userService';
import { updateProfile } from '../../../store/actions';
class AccountManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrN1: {},
            arrN2: {},
            newImage: '',
            active: 1,
            waitEmail: false,

            password: '',
            newPassword: '',
            reNewPassword: '',
            email: '',
            phone: '',
            name: '',
            sex: '',
            intro: '',
            link: '',
            mobileNews: false,
        }
    }
    componentDidMount() {
        let userInfo = this.props.userInfo;

        if (userInfo && !_.isEmpty(userInfo)) {
            this.setState({
                email: userInfo.email,
                name: userInfo.name,
                sex: userInfo.sex,
                intro: userInfo.intro,
                link: userInfo.link,
            })
            let newUserInfo = {
                id: this.props.userInfo.id,
                type: 'refect',
            }
            this.props.updateProfile(newUserInfo);
        }
        this.getNews();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            let userInfo = this.props.userInfo;
            this.setState({
                email: userInfo.email,
                name: userInfo.name,
                phone: userInfo.phone,
                sex: userInfo.sex,
                intro: userInfo.intro,
                link: userInfo.link,
            })
        }
    }
    getNews = async () => {
        let data = {
            id: this.props.userInfo.id,
            limit: LIMIT.GETNEWS
        }
        let res = await getNews(data);
        if (res.N1) {
            this.setState({
                arrN1: res.N1
            })
        }
        if (res.N2) {
            this.setState({
                arrN2: res.N2
            })
        }
    }
    changHideProfile = async () => {
        if (this.props.userInfo.lockprofile === 'ON') {
            if (this.props.language === LANGUAGES.VI) {
                toast.warning("Khóa bảo mật đang bật !");
            } else {
                toast.warning("Security lock is on !");
            }
            this.lockManage();
        } else {
            // tao data gui di
            let newUserInfo = {
                id: this.props.userInfo.id,
                type: 'hide',
                hide: '',
            }
            // Thêm thông tin mới vào data gửi đi
            if (this.props.userInfo.hide === 'ON') {
                newUserInfo.hide = 'OFF';
            } else {
                newUserInfo.hide = 'ON';
            }
            this.props.updateProfile(newUserInfo);
        }
    }
    handleOnchangeImage = async (event) => {
        if (this.props.userInfo.lockprofile === 'ON') {
            if (this.props.language === LANGUAGES.VI) {
                toast.warning("Khóa bảo mật đang bật !");
            } else {
                toast.warning("Security lock is on !");
            }
            this.lockManage();
        } else {
            let data = event.target.files;
            let file = data[0];
            if (file) {
                let base64 = await CommonUtils.getBase64(file);
                console.log('base 64 test', base64);
                const objectUrl = URL.createObjectURL(file);
                this.setState({
                    newImage: base64
                })
            }
            // tao data gui di
            let newUserInfo = {
                id: this.props.userInfo.id,
                image: this.state.newImage,
                type: 'image'
            }
            this.props.updateProfile(newUserInfo);
        }
    }
    changeLockProfile = async () => {

        if (this.props.userInfo.lockprofile === 'OFF') {
            // toast.success("Đã bật khóa bảo mật !");
            let newUserInfo = {
                id: this.props.userInfo.id,
                lockprofile: 'ON',
                type: 'lockprofile'
            }
            this.props.updateProfile(newUserInfo);
        } else {
            if (!Cookies.get('sendEmail')) {
                // tao data gui di
                let newUserInfo = {
                    id: this.props.userInfo.id,
                    lockprofile: 'OFF',
                    type: 'lockprofile'
                }
                this.props.updateProfile(newUserInfo);
                if (this.props.language === LANGUAGES.VI) {
                    toast.success("Đã gửi email xác thực !");
                } else {
                    toast.success("Verification email sent!");
                }
                // setcookie không cho gửi email liên tục
                this.setSendEmail();
            } else {
                let newUserInfo = {
                    id: this.props.userInfo.id,
                    lockprofile: 'OFF',
                    type: 'refect'
                }
                await this.props.updateProfile(newUserInfo);
                if (this.props.userInfo.lockprofile === 'ON') {
                    if (this.props.language === LANGUAGES.VI) {
                        toast.warning("Đợi xác thực từ email !");
                    } else {
                        toast.warning("Waiting for email confirmation!");
                    }
                    this.setState({
                        waitEmail: true
                    })
                } else {
                    Cookies.remove('sendEmail');
                    this.setState({
                        waitEmail: false
                    })
                }
            }
        }
    }
    setSendEmail = () => {
        let d = new Date();
        let h = d.getHours();
        let m = d.getMinutes();
        let s = d.getSeconds();
        let time = `${h}:${m}:${s}s`;
        Cookies.set('sendEmail', time, {
            expires: 0.0013888889
        });
        this.setState({
            waitEmail: true
        })
    }
    checkResentEmail = async (type) => {
        if (!Cookies.get('sendEmail')) {
            if (type === 'lockprofile') {
                this.changeLockProfile();
            } else if (type === 'changeEmail') {
                if (this.props.email === Cookies.get('newEmail')) {
                    await this.refectChangeEmail();
                } else {
                    // gui lại email xác thực
                    if (Cookies.get("newEmail")) {
                        let newUserInfo = {
                            id: this.props.userInfo.id,
                            type: 'resentChangeEmail',
                            email: Cookies.get("newEmail")
                        }
                        await this.props.updateProfile(newUserInfo);
                        if (this.props.language === LANGUAGES.VI) {
                            toast.success("Đã gửi lại email xác thực !");
                        } else {
                            toast.success("Verification email sent again!");
                        }
                        this.setSendEmail();
                    }

                }
            }
        } else {
            if (this.props.language === LANGUAGES.VI) {
                toast.warning("Email trước đó đã được gửi đi vào " + Cookies.get('sendEmail') + ". Bạn chỉ có thể gửi lại email xác thực mỗi 2 phút 1 lần !");
            } else {
                toast.warning("The previous email was sent in " + Cookies.get('sendEmail') + ". You can only resend the verification email once every 2 minutes !");
            }
        }

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    saveProfile = async () => {
        let newUserInfo = {
            type: 'full',
            id: this.props.userInfo.id,
            email: this.state.email,
            phone: this.state.phone,
            name: this.state.name,
            intro: this.state.intro,
            sex: this.state.sex,
            link: this.state.link
        }

        if (newUserInfo.email !== this.props.userInfo.email) {
            let mess = "";
            if (this.props.language === LANGUAGES.VI) {
                mess = "Email Quản Trị của tài khoản này sẽ thay đổi. Nhập YES để xác nhận hoặc bấm bất kì để hùy.";
            } else {
                mess = "This account's Admin Email will change. Enter YES to confirm or press any to cancel.";
            }
            let warning = prompt(mess)
            if (warning === "YES") {
                let isExit = await updateProfileService(newUserInfo);
                if (isExit.err) {
                    if (isExit.err === 1) {
                        if (this.props.language === LANGUAGES.VI) {
                            toast.error("Email " + newUserInfo.email + " đã có một tài khoản khác !");
                        } else {
                            toast.error("Email " + newUserInfo.email + " already have another account !");
                        }
                        this.setState({
                            email: this.props.userInfo.email
                        })
                    }
                } else {
                    if (this.props.language === LANGUAGES.VI) {
                        toast.warning("Đã gửi email xác thực đến email mới !");
                    } else {
                        toast.warning("Sent verification email to new email !");
                    }
                    Cookies.set('newEmail', newUserInfo.email, {
                        expires: 1
                    });
                    this.setSendEmail();
                    newUserInfo.sendEmail = true;// CHẶN GỬI EMAIL 2 LẦN
                    await this.props.updateProfile(newUserInfo);
                    if (this.props.language === LANGUAGES.VI) {
                        toast.success("Cập nhật các thông tin khác thành công !");
                    } else {
                        toast.success("Update other information successfully !");
                    }
                }
            } else {
                this.setState({
                    email: this.props.userInfo.email
                })
            }
        } else {
            if (
                newUserInfo.email === this.props.userInfo.email &&
                newUserInfo.name === this.props.userInfo.name &&
                newUserInfo.intro === this.props.userInfo.intro &&
                newUserInfo.sex === this.props.userInfo.sex &&
                newUserInfo.link === this.props.userInfo.link &&
                newUserInfo.phone === this.props.userInfo.phone
            ) {
                if (this.props.language === LANGUAGES.VI) {
                    toast.warning("Không có thông tin nào thay đổi !");
                } else {
                    toast.warning("No information has changed!");
                }
            } else {
                let isExit = await updateProfileService(newUserInfo);
                if (isExit.err) {
                    if (isExit.err === 2) {
                        if (this.props.language === LANGUAGES.VI) {
                            toast.error("Link cá nhân: /" + newUserInfo.link + " đã tồn tại, hãy thử với link khác !");
                        } else {
                            toast.error("Personal link: /" + newUserInfo.link + " already exists, try another link!");
                        }
                        this.setState({
                            link: this.props.userInfo.link
                        })
                    }
                } else {
                    await this.props.updateProfile(newUserInfo);
                    if (this.props.language === LANGUAGES.VI) {
                        toast.success("Cập nhật các thông tin thành công !");
                    } else {
                        toast.success("Update the information successfully !");
                    }

                }


            }
        }

    }

    cancelChangeEmail = async () => {
        let newUserInfo = {
            type: 'token',
            id: this.props.userInfo.id,
        }
        await this.props.updateProfile(newUserInfo);
        Cookies.remove('newEmail');
        Cookies.remove('sendEmail');
        await this.props.updateProfile(newUserInfo);
        if (this.props.language === LANGUAGES.VI) {
            toast.success("Đã hủy thay đổi email !");
        } else {
            toast.success("Email change canceled !");
        }

    }

    refectChangeEmail = async () => {
        let newUserInfo = {
            id: this.props.userInfo.id,
            type: 'refect',
        }
        await this.props.updateProfile(newUserInfo);

        if (this.props.userInfo.email === Cookies.get('newEmail')) {
            Cookies.remove('newEmail');
            if (this.props.language === LANGUAGES.VI) {
                toast.success("Thay đổi email thành công");
            } else {
                toast.success("Change email successfully");
            }
            Cookies.remove('sendEmail');
            await this.props.updateProfile(newUserInfo);
        } else if (Cookies.get('newEmail')) {
            if (this.props.language === LANGUAGES.VI) {
                toast.warning("Email này chưa được xác thực !");
            } else {
                toast.warning("This email has not been verified !");
            }
        }
    }
    changePassword = async () => {
        if (this.state.newPassword === this.state.reNewPassword) {
            let newUserInfo = {
                type: 'password',
                id: this.props.userInfo.id,
                password: this.state.password,
                newPassword: this.state.newPassword,
            }
            let res = await updateProfileService(newUserInfo);
            if (res && res.status) {
                if (res.status === 'OK') {
                    if (this.props.language === LANGUAGES.VI) {
                        toast.success("Cập nhật mật khẩu thành công !");
                    } else {
                        toast.success("Password update successful!");
                    }
                    this.setState({
                        password: '',
                        newPassword: '',
                        reNewPassword: '',
                    })
                } else if (res.status === '1') {
                    if (this.props.language === LANGUAGES.VI) {
                        toast.error("Mật khẩu hiện tại không chính xác !");
                    } else {
                        toast.error("Current password is incorrect !");
                    }
                } else {
                    if (this.props.language === LANGUAGES.VI) {
                        toast.error("Mật khẩu không hợp lệ !");
                    } else {
                        toast.error("Invalid password !");
                    }
                }
            } else {
                if (this.props.language === LANGUAGES.VI) {
                    toast.error("Server không phản hồi !");
                } else {
                    toast.error("Server not responding !");
                }
            }
        } else {
            if (this.props.language === LANGUAGES.VI) {
                toast.error("Mật khẩu mới không giống nhau !");
            } else {
                toast.error("New password is not the same !");
            }

        }
    }
    securityManage = () => {
        this.setState({
            active: 1,
        })
    }
    infoManage = () => {
        this.setState({
            active: 2,
        })
    }
    lockManage = () => {
        this.setState({
            active: 3,
        })
    }
    downloadImage = async () => {

        let url = 'https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=' + path.BASE_URL + '/profile/' + this.props.userInfo.link;
        const blob = await fetch(url).then(res => res.blob());
        let downloadLink = await URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadLink
        a.download = `${this.props.userInfo.name}_QRCODE.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    render() {
        let arrN1 = this.state.arrN1;
        let arrN2 = this.state.arrN2;
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
                <div className='content-account-mobile'>
                    <div className='box-user-banner'>
                        <input id="upload-img" type="file" hidden
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                        <div className='user-img'><label htmlFor="upload-img"
                            title={this.props.language === 'vi' ? 'Ấn để đổi ảnh đại diện' : 'Click to change avatar'}
                        ><img src={imageBase64} /></label></div>
                        <div className='user-info'>
                            <div className='info-text'>
                                <div className='user-name'>{userInfo.name}</div>
                                <div className='user-intro'>{userInfo.intro}</div>
                            </div>
                            <div className='info-link'>
                                {userInfo.hide === 'OFF' ?
                                    <React.Fragment>
                                        <div className='user-link'><i class="fas fa-link"></i><a href={'/profile/' + userInfo.link} target='_blank'>http://localhost:3000/profile/{userInfo.link}</a></div>
                                        <div className='user-qrcode'><i class="fas fa-qrcode"></i><a id="a" onClick={() => this.downloadImage()} href=''><FormattedMessage id="account.downloadQrcode" /></a></div>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <div className='user-link'><i class="fas fa-link"></i><FormattedMessage id="account.hideProfile" /></div>
                                        <div className='user-qrcode'><i class="fas fa-qrcode"></i><FormattedMessage id="account.hideProfile2" /></div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='content-right-view'>
                        <div className='box-user-view'>
                            <div className='view-title'><FormattedMessage id="account.total" /></div>
                            {
                                userInfo.hide === 'OFF' ?
                                    <React.Fragment>
                                        <div className='view-number'>{userInfo.view}</div>
                                        <i className="fas fa-trophy"></i>
                                        <div className='btn-hide'
                                            onClick={() => this.changHideProfile()}
                                        ><FormattedMessage id="account.hideProfile3" /></div>
                                    </React.Fragment>
                                    : <React.Fragment>
                                        <div className='view-number'><FormattedMessage id="account.hide" /></div>
                                        <i class="fas fa-eye-slash"></i>
                                        <div className='btn-hide'
                                            onClick={() => this.changHideProfile()}
                                        ><FormattedMessage id="account.show" /></div>
                                    </React.Fragment>
                            }

                        </div>
                    </div>
                    <div className='content-left-body'>
                        <div className='left-body-form'>
                            <div className='content-left-menu'>
                                <div className={active === 1 ? 'left-menu-sub active' : 'left-menu-sub'}
                                    onClick={() => { this.securityManage() }}
                                ><FormattedMessage id="account.m1" /></div>
                                <div className={active === 2 ? 'left-menu-sub active' : 'left-menu-sub'}
                                    onClick={() => { this.infoManage() }}
                                ><FormattedMessage id="account.m2" /></div>
                                <div className={active === 3 ? 'left-menu-sub active' : 'left-menu-sub'}
                                    onClick={() => { this.lockManage() }}
                                ><FormattedMessage id="account.m3" /></div>
                            </div>
                            {/* FORM ĐỔI MẬT KHẨU */}
                            <div className={active === 1 ? 'content-left-form active' : 'content-left-form'}
                            >
                                <div className='form-name'><FormattedMessage id="account.m1t" /></div>
                                <div className='form-body'>
                                    <div className='form-content'>
                                        {userInfo.lockprofile === 'ON' ?
                                            <React.Fragment>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c1" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='password' value={this.state.password} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c2" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='password' value={this.state.newPassword} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c3" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='password' value={this.state.reNewPassword} disabled></input>
                                                </div>
                                                <div className='form-content-status'><FormattedMessage id="account.lock" /></div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <div className='form-content-title'><FormattedMessage id="account.m1t" /></div>
                                                <div className='form-content-input'>
                                                    <input type='password'
                                                        onChange={(event) => this.handleOnChangeInput(event, "password")}
                                                        value={this.state.password} required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c1" /></div>
                                                <div className='form-content-input'>
                                                    <input type='password'
                                                        onChange={(event) => this.handleOnChangeInput(event, "newPassword")}
                                                        value={this.state.newPassword}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2" /></div>
                                                <div className='form-content-input'>
                                                    <input type='password'
                                                        onChange={(event) => this.handleOnChangeInput(event, "reNewPassword")}
                                                        value={this.state.reNewPassword}
                                                        required
                                                    ></input>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                            {active === 1 && userInfo.lockprofile === 'OFF' &&
                                <React.Fragment>
                                    <div className='form-save'>
                                        <button onClick={() => this.changePassword()}><div className='btn-save'><FormattedMessage id="account.btn-save" /></div></button>
                                    </div>
                                </React.Fragment>
                            }
                            {/* FORM CẬP NHẬT THÔNG TIN CÁ NHÂN */}
                            <div className={active === 2 ? 'content-left-form active' : 'content-left-form'}
                            >
                                <div className='form-name'><FormattedMessage id="account.m2t" /></div>
                                <div className='form-body'>

                                    <div className='form-content'>
                                        {userInfo.lockprofile === 'ON' ?
                                            <React.Fragment>
                                                <div className='form-content-title'>Email</div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.email} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c1" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.phone} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c2" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.name} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c3" /></div>
                                                <div className='form-content-input lock'>
                                                    <textarea rows='4' value={this.state.intro} disabled></textarea>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c4" /></div>
                                                <div className='form-content-input lock'>
                                                    <div className='sex'>
                                                        <div
                                                            className={this.state.sex === 'M' ? 'sex-content active lock' : 'sex-content lock'}
                                                        ><i class="fas fa-mars"></i><FormattedMessage id="account.m2c41" /></div>
                                                        <div
                                                            className={this.state.sex === 'F' ? 'sex-content active lock' : 'sex-content lock'}
                                                        ><i class="fas fa-venus"></i><FormattedMessage id="account.m2c42" /></div>
                                                        <div
                                                            className={this.state.sex === 'O' ? 'sex-content active lock' : 'sex-content lock'}
                                                        ><i class="fas fa-transgender-alt"></i><FormattedMessage id="account.m2c3" /></div>
                                                    </div>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c5" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.link} disabled></input>
                                                </div>
                                                <div className='form-content-status'><FormattedMessage id="account.lock" /></div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>

                                                {!Cookies.get('newEmail') ?
                                                    <React.Fragment>
                                                        <div className='form-content-title'>Email</div>
                                                    </React.Fragment>
                                                    : <React.Fragment>
                                                        <div className='form-content-title'>
                                                            <div>Email: <b>{Cookies.get('newEmail')}</b> <FormattedMessage id="account.m2c01" /></div>
                                                            <div>
                                                                <FormattedMessage id="account.m2c02" /> <span onClick={() => this.cancelChangeEmail()}><FormattedMessage id="account.m2c03" /></span> <FormattedMessage id="account.m2c04" />
                                                                <span onClick={() => this.checkResentEmail('changeEmail')}> <FormattedMessage id="account.m2c05" /> </span>
                                                                <FormattedMessage id="account.m2c04" /> <span onClick={() => this.refectChangeEmail()}><FormattedMessage id="account.m2c06" /></span>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                }
                                                <div className='form-content-input lock'>
                                                    <input type='email'
                                                        onChange={(event) => this.handleOnChangeInput(event, "email")}
                                                        value={this.state.email}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c1" /></div>
                                                <div className='form-content-input'>
                                                    <input type='text'
                                                        onChange={(event) => this.handleOnChangeInput(event, "phone")}
                                                        value={this.state.phone}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c2" /></div>
                                                <div className='form-content-input'>
                                                    <input type='text'
                                                        onChange={(event) => this.handleOnChangeInput(event, "name")}
                                                        value={this.state.name}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c3" /></div>
                                                <div className='form-content-input'>
                                                    <textarea
                                                        rows="4"
                                                        onChange={(event) => this.handleOnChangeInput(event, "intro")}
                                                        value={this.state.intro}
                                                        required
                                                    ></textarea>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c4" /></div>
                                                <div className='form-content-input'>
                                                    <div className='sex'>
                                                        <div
                                                            className={this.state.sex === 'M' ? 'sex-content active' : 'sex-content'}
                                                            onClick={() => this.setState({ sex: 'M' })}
                                                        ><i class="fas fa-mars"></i><FormattedMessage id="account.m2c41" /></div>
                                                        <div
                                                            className={this.state.sex === 'F' ? 'sex-content active' : 'sex-content'}
                                                            onClick={() => this.setState({ sex: 'F' })}
                                                        ><i class="fas fa-venus"></i><FormattedMessage id="account.m2c42" /></div>
                                                        <div
                                                            className={this.state.sex === 'O' ? 'sex-content active' : 'sex-content'}
                                                            onClick={() => this.setState({ sex: 'O' })}
                                                        ><i class="fas fa-transgender-alt"></i><FormattedMessage id="account.m2c43" /></div>
                                                    </div>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c5" /></div>
                                                <div className='form-content-input'>
                                                    <input type='text'
                                                        onChange={(event) => this.handleOnChangeInput(event, "link")}
                                                        value={this.state.link}
                                                        required
                                                    ></input>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                            {active === 2 && userInfo.lockprofile === 'OFF' &&
                                <React.Fragment>
                                    <div className='form-save'>
                                        <button onClick={() => this.saveProfile()}><div className='btn-save'><FormattedMessage id="account.btn-save" /></div></button>
                                    </div>
                                </React.Fragment>
                            }
                            {/* FROM TRỢ GIÚP */}
                            <div className={active === 3 ? 'content-left-form active' : 'content-left-form'}
                            >
                                <div className='form-name'><FormattedMessage id="account.m3t" /></div>
                                <div className='form-body'>
                                    <div className='form-lock'>
                                        {userInfo.lockprofile === 'ON' ?
                                            <React.Fragment>
                                                <div className='lock-icon on'><i class="fas fa-lock"></i></div>
                                                <div className='lock-title on'><FormattedMessage id="account.m3c1" /></div>
                                                <div className='btn-lock on' onClick={() => this.changeLockProfile()}>
                                                    <i class="fas fa-lock-open"></i><FormattedMessage id="account.m3c2" /></div>
                                                {this.state.waitEmail === true &&
                                                    <React.Fragment>
                                                        <div className='resent-email'><FormattedMessage id="account.m3c3" /> <span onClick={() => this.checkResentEmail('lockprofile')}>
                                                            <FormattedMessage id="account.m3c4" /></span></div>
                                                    </React.Fragment>
                                                }
                                                <div className='warning'><FormattedMessage id="account.m3c5" /></div>
                                            </React.Fragment>
                                            : <React.Fragment>
                                                <div className='lock-icon'><i class="fas fa-unlock"></i></div>
                                                <div className='lock-title'><FormattedMessage id="account.m3c6" /></div>
                                                <div className='btn-lock' onClick={() => this.changeLockProfile()}><i class="fas fa-lock"></i><FormattedMessage id="account.m3c7" /></div>
                                                <div className='warning'><FormattedMessage id="account.m3c8" /></div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='content-left-menu-news'>
                        <div className={this.state.mobileNews === false ? 'left-menu-sub-news active' : 'left-menu-sub-news'}
                            onClick={() => {
                                this.setState({
                                    mobileNews: false
                                })
                            }}
                        >
                            <FormattedMessage id="account.n2" />
                        </div>
                        <div className={this.state.mobileNews === true ? 'left-menu-sub-news active' : 'left-menu-sub-news'}
                            onClick={() => {
                                this.setState({
                                    mobileNews: true
                                })
                            }}
                        >
                            <FormattedMessage id="account.n1" />
                        </div>
                    </div>
                    {this.state.mobileNews === false ?
                        <React.Fragment>
                            <div className='content-right-newfeed'>
                                <div className='box-newfeed'>
                                    <div className='newfeed-title'><FormattedMessage id="account.n2" /></div>
                                    <div className='newfeed-body'>
                                        {arrN1 && arrN1.length > 0 && arrN1.map((item, index) => {
                                            return (
                                                <React.Fragment>
                                                    {this.props.language === 'vi' ?
                                                        <React.Fragment>
                                                            <div className='newfeed-content'>{item.contentVi}</div>
                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                            <div className='newfeed-content'>{item.contentEn}</div>
                                                        </React.Fragment>
                                                    }
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment> :
                        <React.Fragment>
                            <div className='left-body-report'>
                                <div className='report-title'><FormattedMessage id="account.n1" /></div>
                                <div className='report-body'>
                                    {arrN2 && arrN2.length > 0 && arrN2.map((item, index) => {
                                        return (
                                            <React.Fragment>
                                                {this.props.language === 'vi' ?
                                                    <React.Fragment>
                                                        <div className='report-content'>{item.contentVi}</div>
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                        <div className='report-content'>{item.contentEn}</div>
                                                    </React.Fragment>
                                                }
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </div>
                <div className='content-left'>
                    <div className='content-left-header'>
                        <div className='box-user-banner'>
                            <input id="upload-img" type="file" hidden
                                onChange={(event) => this.handleOnchangeImage(event)}
                            />
                            <div className='user-img'><label htmlFor="upload-img"
                                title={this.props.language === 'vi' ? 'Ấn để đổi ảnh đại diện' : 'Click to change avatar'}
                            ><img src={imageBase64} /></label></div>
                            <div className='user-info'>
                                <div className='info-text'>
                                    <div className='user-name'>{userInfo.name}</div>
                                    <div className='user-intro'>{userInfo.intro}</div>
                                </div>
                                <div className='info-link'>
                                    {userInfo.hide === 'OFF' ?
                                        <React.Fragment>
                                            <div className='user-link'><i class="fas fa-link"></i><a href={'/profile/' + userInfo.link} target='_blank'>http://localhost:3000/profile/{userInfo.link}</a></div>
                                            <div className='user-qrcode'><i class="fas fa-qrcode"></i><a id="a" onClick={() => this.downloadImage()} href=''><FormattedMessage id="account.downloadQrcode" /></a></div>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <div className='user-link'><i class="fas fa-link"></i><FormattedMessage id="account.hideProfile" /></div>
                                            <div className='user-qrcode'><i class="fas fa-qrcode"></i><FormattedMessage id="account.hideProfile2" /></div>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='content-left-body'>
                        <div className='left-body-form'>
                            <div className='content-left-menu'>
                                <div className={active === 1 ? 'left-menu-sub active' : 'left-menu-sub'}
                                    onClick={() => { this.securityManage() }}
                                ><FormattedMessage id="account.m1" /></div>
                                <div className={active === 2 ? 'left-menu-sub active' : 'left-menu-sub'}
                                    onClick={() => { this.infoManage() }}
                                ><FormattedMessage id="account.m2" /></div>
                                <div className={active === 3 ? 'left-menu-sub active' : 'left-menu-sub'}
                                    onClick={() => { this.lockManage() }}
                                ><FormattedMessage id="account.m3" /></div>
                            </div>
                            {/* FORM ĐỔI MẬT KHẨU */}
                            <div className={active === 1 ? 'content-left-form active' : 'content-left-form'}
                            >
                                <div className='form-name'><FormattedMessage id="account.m1t" /></div>
                                <div className='form-body'>
                                    <div className='form-content'>
                                        {userInfo.lockprofile === 'ON' ?
                                            <React.Fragment>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c1" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='password' value={this.state.password} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c2" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='password' value={this.state.newPassword} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c3" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='password' value={this.state.reNewPassword} disabled></input>
                                                </div>
                                                <div className='form-content-status'><FormattedMessage id="account.lock" /></div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <div className='form-content-title'><FormattedMessage id="account.m1t" /></div>
                                                <div className='form-content-input'>
                                                    <input type='password'
                                                        onChange={(event) => this.handleOnChangeInput(event, "password")}
                                                        value={this.state.password} required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m1c1" /></div>
                                                <div className='form-content-input'>
                                                    <input type='password'
                                                        onChange={(event) => this.handleOnChangeInput(event, "newPassword")}
                                                        value={this.state.newPassword}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2" /></div>
                                                <div className='form-content-input'>
                                                    <input type='password'
                                                        onChange={(event) => this.handleOnChangeInput(event, "reNewPassword")}
                                                        value={this.state.reNewPassword}
                                                        required
                                                    ></input>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                            {active === 1 && userInfo.lockprofile === 'OFF' &&
                                <React.Fragment>
                                    <div className='form-save'>
                                        <button onClick={() => this.changePassword()}><div className='btn-save'><FormattedMessage id="account.btn-save" /></div></button>
                                    </div>
                                </React.Fragment>
                            }
                            {/* FORM CẬP NHẬT THÔNG TIN CÁ NHÂN */}
                            <div className={active === 2 ? 'content-left-form active' : 'content-left-form'}
                            >
                                <div className='form-name'><FormattedMessage id="account.m2t" /></div>
                                <div className='form-body'>

                                    <div className='form-content'>
                                        {userInfo.lockprofile === 'ON' ?
                                            <React.Fragment>
                                                <div className='form-content-title'>Email</div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.email} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c1" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.phone} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c2" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.name} disabled></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c3" /></div>
                                                <div className='form-content-input lock'>
                                                    <textarea rows='4' value={this.state.intro} disabled></textarea>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c4" /></div>
                                                <div className='form-content-input lock'>
                                                    <div className='sex'>
                                                        <div
                                                            className={this.state.sex === 'M' ? 'sex-content active lock' : 'sex-content lock'}
                                                        ><i class="fas fa-mars"></i><FormattedMessage id="account.m2c41" /></div>
                                                        <div
                                                            className={this.state.sex === 'F' ? 'sex-content active lock' : 'sex-content lock'}
                                                        ><i class="fas fa-venus"></i><FormattedMessage id="account.m2c42" /></div>
                                                        <div
                                                            className={this.state.sex === 'O' ? 'sex-content active lock' : 'sex-content lock'}
                                                        ><i class="fas fa-transgender-alt"></i><FormattedMessage id="account.m2c3" /></div>
                                                    </div>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c5" /></div>
                                                <div className='form-content-input lock'>
                                                    <input type='text' value={this.state.link} disabled></input>
                                                </div>
                                                <div className='form-content-status'><FormattedMessage id="account.lock" /></div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>

                                                {!Cookies.get('newEmail') ?
                                                    <React.Fragment>
                                                        <div className='form-content-title'>Email</div>
                                                    </React.Fragment>
                                                    : <React.Fragment>
                                                        <div className='form-content-title'>
                                                            <div>Email: <b>{Cookies.get('newEmail')}</b> <FormattedMessage id="account.m2c01" /></div>
                                                            <div>
                                                                <FormattedMessage id="account.m2c02" /> <span onClick={() => this.cancelChangeEmail()}><FormattedMessage id="account.m2c03" /></span> <FormattedMessage id="account.m2c04" />
                                                                <span onClick={() => this.checkResentEmail('changeEmail')}> <FormattedMessage id="account.m2c05" /> </span>
                                                                <FormattedMessage id="account.m2c04" /> <span onClick={() => this.refectChangeEmail()}><FormattedMessage id="account.m2c06" /></span>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                }
                                                <div className='form-content-input lock'>
                                                    <input type='email'
                                                        onChange={(event) => this.handleOnChangeInput(event, "email")}
                                                        value={this.state.email}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c1" /></div>
                                                <div className='form-content-input'>
                                                    <input type='text'
                                                        onChange={(event) => this.handleOnChangeInput(event, "phone")}
                                                        value={this.state.phone}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c2" /></div>
                                                <div className='form-content-input'>
                                                    <input type='text'
                                                        onChange={(event) => this.handleOnChangeInput(event, "name")}
                                                        value={this.state.name}
                                                        required
                                                    ></input>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c3" /></div>
                                                <div className='form-content-input'>
                                                    <textarea
                                                        rows="4"
                                                        onChange={(event) => this.handleOnChangeInput(event, "intro")}
                                                        value={this.state.intro}
                                                        required
                                                    ></textarea>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c4" /></div>
                                                <div className='form-content-input'>
                                                    <div className='sex'>
                                                        <div
                                                            className={this.state.sex === 'M' ? 'sex-content active' : 'sex-content'}
                                                            onClick={() => this.setState({ sex: 'M' })}
                                                        ><i class="fas fa-mars"></i><FormattedMessage id="account.m2c41" /></div>
                                                        <div
                                                            className={this.state.sex === 'F' ? 'sex-content active' : 'sex-content'}
                                                            onClick={() => this.setState({ sex: 'F' })}
                                                        ><i class="fas fa-venus"></i><FormattedMessage id="account.m2c42" /></div>
                                                        <div
                                                            className={this.state.sex === 'O' ? 'sex-content active' : 'sex-content'}
                                                            onClick={() => this.setState({ sex: 'O' })}
                                                        ><i class="fas fa-transgender-alt"></i><FormattedMessage id="account.m2c43" /></div>
                                                    </div>
                                                </div>
                                                <div className='form-content-title'><FormattedMessage id="account.m2c5" /></div>
                                                <div className='form-content-input'>
                                                    <input type='text'
                                                        onChange={(event) => this.handleOnChangeInput(event, "link")}
                                                        value={this.state.link}
                                                        required
                                                    ></input>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                            {active === 2 && userInfo.lockprofile === 'OFF' &&
                                <React.Fragment>
                                    <div className='form-save'>
                                        <button onClick={() => this.saveProfile()}><div className='btn-save'><FormattedMessage id="account.btn-save" /></div></button>
                                    </div>
                                </React.Fragment>
                            }
                            {/* FROM TRỢ GIÚP */}
                            <div className={active === 3 ? 'content-left-form active' : 'content-left-form'}
                            >
                                <div className='form-name'><FormattedMessage id="account.m3t" /></div>
                                <div className='form-body'>
                                    <div className='form-lock'>
                                        {userInfo.lockprofile === 'ON' ?
                                            <React.Fragment>
                                                <div className='lock-icon on'><i class="fas fa-lock"></i></div>
                                                <div className='lock-title on'><FormattedMessage id="account.m3c1" /></div>
                                                <div className='btn-lock on' onClick={() => this.changeLockProfile()}>
                                                    <i class="fas fa-lock-open"></i><FormattedMessage id="account.m3c2" /></div>
                                                {this.state.waitEmail === true &&
                                                    <React.Fragment>
                                                        <div className='resent-email'><FormattedMessage id="account.m3c3" /> <span onClick={() => this.checkResentEmail('lockprofile')}>
                                                            <FormattedMessage id="account.m3c4" /></span></div>
                                                    </React.Fragment>
                                                }
                                                <div className='warning'><FormattedMessage id="account.m3c5" /></div>
                                            </React.Fragment>
                                            : <React.Fragment>
                                                <div className='lock-icon'><i class="fas fa-unlock"></i></div>
                                                <div className='lock-title'><FormattedMessage id="account.m3c6" /></div>
                                                <div className='btn-lock' onClick={() => this.changeLockProfile()}><i class="fas fa-lock"></i><FormattedMessage id="account.m3c7" /></div>
                                                <div className='warning'><FormattedMessage id="account.m3c8" /></div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='left-body-report'>
                            <div className='report-title'><FormattedMessage id="account.n1" /></div>
                            <div className='report-body'>
                                {arrN2 && arrN2.length > 0 && arrN2.map((item, index) => {
                                    return (
                                        <React.Fragment>
                                            {this.props.language === 'vi' ?
                                                <React.Fragment>
                                                    <div className='report-content'>{item.contentVi}</div>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <div className='report-content'>{item.contentEn}</div>
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div >
                <div className='content-right'>
                    <div className='content-right-view'>
                        <div className='box-user-view'>
                            <div className='view-title'><FormattedMessage id="account.total" /></div>
                            {
                                userInfo.hide === 'OFF' ?
                                    <React.Fragment>
                                        <div className='view-number'>{userInfo.view}</div>
                                        <i className="fas fa-trophy"></i>
                                        <div className='btn-hide'
                                            onClick={() => this.changHideProfile()}
                                        ><FormattedMessage id="account.hideProfile3" /></div>
                                    </React.Fragment>
                                    : <React.Fragment>
                                        <div className='view-number'><FormattedMessage id="account.hide" /></div>
                                        <i class="fas fa-eye-slash"></i>
                                        <div className='btn-hide'
                                            onClick={() => this.changHideProfile()}
                                        ><FormattedMessage id="account.show" /></div>
                                    </React.Fragment>
                            }

                        </div>
                    </div>
                    <div className='content-right-newfeed'>
                        <div className='box-newfeed'>
                            <div className='newfeed-title'><FormattedMessage id="account.n2" /></div>
                            <div className='newfeed-body'>
                                {arrN1 && arrN1.length > 0 && arrN1.map((item, index) => {
                                    return (
                                        <React.Fragment>
                                            {this.props.language === 'vi' ?
                                                <React.Fragment>
                                                    <div className='newfeed-content'>{item.contentVi}</div>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <div className='newfeed-content'>{item.contentEn}</div>
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    )
                                })}
                            </div>
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
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateProfile: (newUserInfo) => dispatch(actions.updateProfile(newUserInfo)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountManage));
