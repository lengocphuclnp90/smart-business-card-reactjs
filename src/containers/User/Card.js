import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import { sendEmailS3, getCard, checkStatusS3, viewItem, setSchedule } from '../../services/userService';
import { LANGUAGES, path } from "../../utils";
import { changeLanguageApp } from '../../store/actions/appActions';
import { FormattedMessage } from 'react-intl';
import Cookies from 'js-cookie'
import logo from '../../assets/logo_01.png'
import './Card.scss';
import './CardMobile.scss';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Header from '../Home/Header';
import Footer from '../Home/Footer';

class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link: this.props.match.params.link,
            cardActive: false,
            security: 'XX',
            s3Status: 'S3',
            s3WaitEmail: '',
            aName: 'hide',
            aContent: 'hide',
            showFormEmail: false,

            view: 0,
            data: {},
            check: false,
            active: 7,
            schedule: false,
            scheduleName: '',
            time: '',
            location: '',
            email: '',
            phone: '',
        }
        // thay doi domain can khi chuyen trang
        this.props.history.push(`/card/${this.state.link}`);

    }

    async componentDidMount() {
        await this.getStart();
        if (this.state.cardActive === true) {
            await this.getSecurity();
            if (this.state.security === 'S3' && Cookies.get(this.state.link)) {
                await this.checkStatusS3();
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo != this.props.userInfo) {
            this.getSecurity();
        }
    }

    getStart = async () => {
        if (Cookies.get(`view-${this.state.link}`)) {
            this.setState({
                cardActive: true,
            })
        } else {
            let data = {
                get: 'start',
                link: this.state.link
            }
            let res = await getCard(data);
            if (!res || res.err) {
                // toast.error("Đã xảy ra lỗi !!!");
            } else if (res.active === true) {
                this.setState({
                    cardActive: true,
                })
            }
        }
    }
    getSecurity = async () => {
        let data = {};
        if (!_.isEmpty(this.props.userInfo)) {
            data = {
                get: 'security',
                link: this.state.link,
                user: this.props.userInfo.id
            }
        } else {
            data = {
                get: 'security',
                link: this.state.link,
                user: 'orther'
            }
        }
        let res = await getCard(data);
        if (!res || res.err) {
            // toast.error("Đã xảy ra lỗi !!!");
        } else {
            if (res.security === 'S1') {
                this.setState({
                    security: res.security,
                }, async () => {
                    await this.getInfo();
                })
            } else if (res.security === 'S2') {
                if (!_.isEmpty(this.props.userInfo)) {
                    this.setState({
                        security: 'S1',
                    }, async () => {
                        await this.getInfo();
                    })
                } else {
                    this.setState({
                        security: 'NOTUSER',
                    })
                }
            } else if (res.security === 'S3') {
                this.setState({
                    security: res.security,
                })
            }
        }
    }
    sendEmail = async () => {
        let token = await uuidv4();
        // Đặt cookie đã gửi email
        let d = new Date();
        let h = d.getHours();
        let m = d.getMinutes();
        let s = d.getSeconds();
        let time = `${h}:${m}:${s}s`;
        // Đã gửi email
        let data = {};
        if (!_.isEmpty(this.props.userInfo)) {
            data = {
                token: token,
                link: this.state.link,
                language: this.props.language,
                aName: this.props.userInfo.name,
                aContent: this.state.aContent,
            }
        } else {
            data = {
                token: token,
                link: this.state.link,
                language: this.props.language,
                aName: this.state.aName,
                aContent: this.state.aContent,
            }
        }
        this.setState({
            showFormEmail: false,
        })
        let res = await sendEmailS3(data);
        if (res.res === 'OK') {
            Cookies.set('sendEmailS3', time, {
                expires: 0.010417
            });
            Cookies.set(this.state.link, token, {
                expires: 0.010417
            });
            toast.success("Đã gửi yêu cầu !");
            this.checkStatusS3();
        } else {
            toast.error("Đã xảy ra lỗi !!!");
        }
    }
    checkStatusS3 = async () => {
        if (Cookies.get(this.state.link) && this.state.security !== 'S1') {
            let loop = setInterval(async () => {
                if (this.state.security === 'S1' || this.state.s3Status === 'NO' || this.state.s3Status === 'OK') {
                    clearInterval(loop);
                } else {
                    let data = {
                        token: await Cookies.get(this.state.link),
                        link: this.state.link,
                    }
                    let res = await checkStatusS3(data);
                    if (res.res === 'OK') {
                        this.setState({
                            s3Status: 'OK'
                        }, async () => {
                            await this.getInfo();
                        })
                    } else if (res.res === 'NO') {
                        this.setState({
                            s3Status: 'NO'
                        })
                    } else if (res.res === 'W') {
                        this.setState({
                            s3Status: 'W'
                        })
                    }
                }
            }, 1000)
        }
    }
    getInfo = async () => {
        if (this.state.s3Status === 'OK' || this.state.security === 'S1') {
            let data = {
                get: 'data',
                link: this.state.link
            }
            let res = await getCard(data);
            this.setState({
                data: res,
                security: 'S1'
            }, async () => {
                await this.checkInfo();
            })
            if (!res || res.err) {
                toast.error("Đã xảy ra lỗi !!!");
            } else {
                // Lấy dữ liệu thành công
                if (!Cookies.get(`view-${this.state.link}`)) {
                    await this.setState({
                        view: 1,
                    })
                    Cookies.set(`view-${this.state.link}`, 'false', {
                        expires: 0.003472
                    });
                } else {
                    await this.setState({
                        view: 0,
                    })
                }
                if (!_.isEmpty(this.props.userInfo)) {
                    data = {
                        get: 'view',
                        link: this.state.link,
                        vid: this.props.userInfo.id,
                        vname: this.props.userInfo.name,
                        vlink: `/profile/${this.props.userInfo.link}`,
                        content: `/card/${this.state.link}`,
                        vemail: this.props.userInfo.email,
                        view: this.state.view
                    }
                } else {
                    data = {
                        get: 'view',
                        vname: this.state.aName,
                        link: this.state.link,
                        vid: 'hide',
                        content: `/card/${this.state.link}`,
                        view: this.state.view
                    }
                }
                await getCard(data);
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
    checkSendEmail = () => {
        if (!Cookies.get('sendEmailS3')) {
            this.setState({
                aName: '',
                aContent: '',
                showFormEmail: true,
                schedule: false
            })
        } else {
            let status = `Bạn đã gửi email trước đó vào ${Cookies.get('sendEmailS3')}. Chỉ có thể gửi mỗi 15p/1 lần!`
            this.setState({
                s3WaitEmail: status
            })
        }
    }
    checkInfo = async () => {
        if (!_.isEmpty(this.state.data.custom)) {
            this.setState({
                active: 6,
            })
        }
        if (!_.isEmpty(this.state.data.location)) {
            this.setState({
                active: 5,
            })
        }
        if (!_.isEmpty(this.state.data.phone)) {
            this.setState({
                active: 4,
            })
        }
        if (!_.isEmpty(this.state.data.email)) {
            this.setState({
                active: 3,
            })
        }
        if (!_.isEmpty(this.state.data.bank)) {
            this.setState({
                active: 2,
            })
        }
        if (!_.isEmpty(this.state.data.social)) {
            this.setState({
                active: 1,
            })
        }
    }

    openFormCheck = async (id, name, content, table) => {
        this.setState({
            check: !this.state.check,
            item_table: table,
            item_id: id,
            item_name: name,
            item_content: content
        })
    }
    viewItem = async (type) => {
        let data = {
            id: this.state.item_id,
            table: this.state.item_table
        }
        let res = await viewItem(data);
        // if (!res) {
        //     toast.error("Đã xảy ra lỗi !!!");
        // } else {
        //     if (res.err === 'OK') {
        //         toast.success("OK !!!");
        //     } else {
        //         toast.error("Đã xảy ra lỗi !!!");
        //     }
        // }
        if (type === 'copy') {
            navigator.clipboard.writeText(`${this.state.item_content} `);
            toast.success("Đã sao chép nội dung vào bộ nhớ tạm !");
        } else if (type === 'link') {
            this.setState({
                check: false,
            })
            window.open(this.state.item_content);
        }
    }
    downloadImage = async () => {
        let downloadLink = new Buffer(this.state.data.card.image, 'base64').toString('binary');
        const a = document.createElement("a");
        a.href = downloadLink
        a.download = `${this.state.data.card.name}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    scheduleSendMail = async () => {
        let data = {};
        if (!_.isEmpty(this.props.userInfo)) {
            data = {
                type: 'new',
                link: this.state.link,
                language: this.props.language,
                memberId: this.props.userInfo.id,
                memberName: this.props.userInfo.name,
                memberEmail: this.props.userInfo.email,
                memberPhone: this.props.userInfo.phone,
                name: this.state.scheduleName,
                time: this.state.time,
                location: this.state.location,
                content: this.state.aContent,
            }
        } else {
            data = {
                type: 'new',
                link: this.state.link,
                language: this.props.language,
                memberId: 'hide',
                memberName: this.state.aName,
                memberEmail: this.state.email,
                memberPhone: this.state.phone,
                name: this.state.scheduleName,
                time: this.state.time,
                location: this.state.location,
                content: this.state.aContent,
            }
        }
        if (
            data.memberName === '' || data.memberEmail === '' ||
            data.memberId === '' || data.memberPhone === '' ||
            data.name === '' || data.time === '' ||
            data.location === '' || data.content === ''
        ) {
            alert('Cần điền đầy đủ thông tin !!!');
        } else {
            let d = new Date();
            let date = new Date(data.time);
            let dNow = d.getTime();
            let dateChoose = date.getTime();
            if ((dateChoose - dNow) < 43200000 || (dateChoose - dNow) > 2592000000) {
                alert("Chỉ có thể đặt lịch hẹn vào thời gian cách hiện tại tối thiểu 12 giờ và trong tối đa 30 ngày kế tiếp !");
            } else {
                let h = d.getHours();
                let m = d.getMinutes();
                let s = d.getSeconds();
                let time = `${h}:${m}:${s}s`;
                Cookies.set(`schedule-${this.state.link}`, time, {
                    expires: 0.010417
                });
                let res = await setSchedule(data);
                if (!res || res.err) {
                    toast.error("Đã xảy ra lỗi !!!");
                } else {
                    toast.success("Đặt lịch hẹn thành công, hãy kiểm tra Email của bạn !");
                    this.setState({
                        showFormEmail: false,
                    })

                }
            }
        }
    }
    checkEmailSchedule = () => {
        if (!Cookies.get(`schedule-${this.state.link}`)) {
            this.setState({
                scheduleName: '',
                time: '',
                phone: '',
                location: '',
                email: '',
                aName: '',
                aContent: '',
                showFormEmail: true,
                schedule: true,
            })
        } else {
            toast.warning(`Yêu cầu trước đó đã gửi vào ${Cookies.get(`schedule-${this.state.link}`)}. Bạn chỉ có thể gửi 1 yêu cầu trong 15 phút!`)
        }
    }
    render() {
        let qrcode = '';
        let imageBase64 = '';

        if (!_.isEmpty(this.state.data)) {
            if (this.state.data.card.image) {
                if (this.state.data.card.image) {
                    qrcode = new Buffer(this.state.data.card.image, 'base64').toString('binary');
                }
            }
            if (this.state.data.user.image) {
                if (this.state.data.user.image) {
                    imageBase64 = new Buffer(this.state.data.user.image, 'base64').toString('binary');
                }
            }
        }
        let active = +this.state.active;
        // đổi qrcode thành ảnh card
        let check = this.state.check;
        return (
            <React.Fragment>
                {check === true &&
                    <React.Fragment>
                        <div className='check'>
                            <div className='check-table'>
                                <div className='check-header'>
                                    <div className='title-text'><b><FormattedMessage id="card-profile.check" /></b></div>
                                    <div className='title-icon'><i class="fas fa-times" onClick={() => this.setState({ check: !this.state.check })}></i></div>
                                </div>
                                <div className='check-body'>
                                    <div className='check-name'><b><FormattedMessage id="card-profile.name" /> </b>{this.state.item_name}</div>
                                    <div className='check-link'>
                                        <b><FormattedMessage id="card-profile.content" /></b>
                                        <textarea rows='4' value={this.state.item_content}>
                                        </textarea>
                                    </div>
                                </div>
                                <div className='check-footer'>
                                    {this.state.item_table === 'bank' || this.state.item_table === 'email' || this.state.item_table === 'phone' ?
                                        <React.Fragment>
                                            <div className='btn-check' onClick={() => this.viewItem('copy')}><FormattedMessage id="card-profile.copy" /> <i class="fas fa-copy"></i></div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='btn-check' onClick={() => this.viewItem('link')}><FormattedMessage id="card-profile.open" /> <i class="fas fa-angle-double-right"></i></div>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                {this.state.showFormEmail === true &&
                    <React.Fragment>
                        <div className='send-email-form'>
                            <div className='email-form-content'>
                                <div className='form-content-title'>
                                    {this.state.schedule === true ?
                                        <React.Fragment>
                                            <b><FormattedMessage id="card-profile.schedule" /></b>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <b><FormattedMessage id="card-profile.who" /></b>
                                        </React.Fragment>
                                    }
                                    <i class="fas fa-times"
                                        onClick={() => this.setState({ showFormEmail: false, schedule: false })}
                                    ></i>
                                </div>

                                <div className='form-content-body'>
                                    {_.isEmpty(this.props.userInfo) &&
                                        <React.Fragment>
                                            {this.state.schedule === true &&
                                                <React.Fragment>
                                                    <div className='body-aname'>
                                                        <span><FormattedMessage id="card-profile.email" /></span>
                                                        <input
                                                            value={this.state.email}
                                                            onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                                        ></input>
                                                    </div>
                                                    <div className='body-aname'>
                                                        <span><FormattedMessage id="card-profile.phoneF" /></span>
                                                        <input
                                                            value={this.state.phone}
                                                            onChange={(event) => this.handleOnChangeInput(event, 'phone')}
                                                        ></input>
                                                    </div>
                                                </React.Fragment>
                                            }
                                            <div className='body-aname'>
                                                <span><FormattedMessage id="card-profile.nameF" /></span>
                                                <input
                                                    value={this.state.aName}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'aName')}
                                                ></input>
                                            </div>
                                        </React.Fragment>
                                    }
                                    {this.state.schedule === true &&
                                        <React.Fragment>
                                            <div className='body-aname'>
                                                <span><FormattedMessage id="card-profile.scheduleName" /></span>
                                                <input
                                                    value={this.state.scheduleName}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'scheduleName')}
                                                ></input>
                                            </div>
                                            <div className='body-aname'>
                                                <span><FormattedMessage id="card-profile.time" /></span>
                                                <input type='datetime-local'
                                                    value={this.state.time}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'time')}
                                                ></input>
                                            </div>
                                            <div className='body-aname'>
                                                <span><FormattedMessage id="card-profile.locationF" /></span>
                                                <input
                                                    value={this.state.location}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'location')}
                                                ></input>
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className='body-acontent'>
                                        <span><FormattedMessage id="card-profile.content" /></span>
                                        <textarea rows='4'
                                            value={this.state.aContent}
                                            onChange={(event) => this.handleOnChangeInput(event, 'aContent')}
                                        ></textarea>

                                    </div>
                                </div>
                                <div className='form-content-footer'>
                                    {this.state.schedule === false ?
                                        <React.Fragment>
                                            <div className='send-email-btn'
                                                onClick={() => this.sendEmail()}
                                            ><FormattedMessage id="card-profile.send" /></div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='send-email-btn'
                                                onClick={() => this.scheduleSendMail()}
                                            ><FormattedMessage id="card-profile.send" /></div>
                                        </React.Fragment>
                                    }

                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                <Header />
                <div className='profile'>
                    <div className='cover'>
                        <div className='cover-color'></div>
                    </div>
                    {/* HẾT LƯỢT XEM */}
                    {this.state.cardActive === false &&
                        <React.Fragment>
                            <div className='body-lock'>
                                <div className='box-banned'>
                                    <div className='title-banned'><FormattedMessage id="card-profile.empty" /></div>
                                    <div className='icon-banned'><i class="far fa-address-card"></i></div>
                                    <div className='btn-banned' onClick={() => { window.location = "/"; }}>OK</div>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    {/* BẢO MẬT S2 YÊU CẦU ĐĂNG NHẬP KHI ẨN DANH */}
                    {this.state.cardActive === true && this.state.security === 'NOTUSER' &&
                        < React.Fragment >
                            <div className='body-lock'>
                                <div className='box-banned'>
                                    <div className='title-banned'><FormattedMessage id="card-profile.s2t" /></div>
                                    <div className='icon-banned'><i class="fas fa-user-secret"></i></div>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    {/* BẢO MẬT S3 GỬI EMAIL XÁC THỰC */}
                    {this.state.cardActive === true && this.state.security === 'S3' &&
                        < React.Fragment >
                            <div className='body-lock'>
                                <div className='box-banned'>
                                    {this.state.s3Status === 'S3' &&
                                        <React.Fragment>
                                            <div className='title-banned'><FormattedMessage id="card-profile.s3t" /></div>
                                            <div className='icon-banned'><i class="far fa-address-card"></i></div>
                                            <div className='btn-banned' onClick={() => this.checkSendEmail()}><FormattedMessage id="card-profile.send" /></div>
                                        </React.Fragment>
                                    }
                                    {this.state.s3Status === 'W' &&
                                        <React.Fragment>
                                            <div className='title-banned'><FormattedMessage id="card-profile.s3w" /></div>
                                            <div className='icon-banned'><i class="fas fa-coffee"></i></div>
                                            <div className='s3-status'>{this.state.s3WaitEmail}</div>
                                            <div className='btn-banned' onClick={() => this.checkSendEmail()}><FormattedMessage id="card-profile.send" /></div>
                                        </React.Fragment>
                                    }
                                    {this.state.s3Status === 'NO' &&
                                        <React.Fragment>
                                            <div className='title-banned'><FormattedMessage id="card-profile.s3n" /></div>
                                            <div className='icon-banned'><i class="fas fa-eye-slash"></i></div>
                                            <div className='btn-banned' onClick={() => { window.location = "/"; }}>OK</div>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    {/* A CHO PHÉP XEM */}
                    {this.state.cardActive === true && this.state.security === 'S1' && !_.isEmpty(this.state.data) &&
                        <React.Fragment>
                            <div className='body-active'>
                                <div className='body-profile'>
                                    <div className='profile-header'>
                                        <div className='header-info'>
                                            <div className='header-img'>
                                                {this.state.data.user.vip === 'FREE' ?
                                                    <React.Fragment>
                                                        <img src={imageBase64}></img>
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                        <img src={imageBase64} className='vip'></img>
                                                    </React.Fragment>
                                                }
                                            </div>
                                            <div className='header-content'>
                                                <div className='name'>{this.state.data.user.name}</div>
                                                <div className='intro'>{this.state.data.user.intro}</div>
                                                {this.state.data.user.vip === 'FREE' ?
                                                    <React.Fragment>
                                                        <div className='warning free'><i class="fas fa-exclamation-circle"></i> <FormattedMessage id="card-profile.free" /></div>
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                        <div className='warning vip'><i class="fas fa-check-circle"></i> <FormattedMessage id="card-profile.paid" /></div>
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                        <div className='header-qrcode-x'>
                                            <img src={qrcode} id="a" onClick={() => this.downloadImage()} title='Download Card'></img>
                                        </div>
                                    </div>
                                    {active === 0 ?
                                        <React.Fragment>
                                            <div className='profile-content'>
                                                <div><FormattedMessage id="card-profile.noInfo" /></div>
                                            </div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='profile-content'>
                                                <div className='body-menu-mobile'>
                                                    <select
                                                        value={this.state.active}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'active')}
                                                    >
                                                        {!_.isEmpty(this.state.data.social) &&
                                                            <FormattedMessage id="card-profile.social" >
                                                                {(message) => <option value='1'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {!_.isEmpty(this.state.data.bank) &&
                                                            <FormattedMessage id="card-profile.bank" >
                                                                {(message) => <option value='2'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {!_.isEmpty(this.state.data.email) &&
                                                            <FormattedMessage id="card-profile.email" >
                                                                {(message) => <option value='3'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {!_.isEmpty(this.state.data.phone) &&
                                                            <FormattedMessage id="card-profile.phone" >
                                                                {(message) => <option value='4'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {!_.isEmpty(this.state.data.location) &&
                                                            <FormattedMessage id="card-profile.location" >
                                                                {(message) => <option value='5'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {!_.isEmpty(this.state.data.custom) &&
                                                            <FormattedMessage id="card-profile.custom" >
                                                                {(message) => <option value='6'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        <FormattedMessage id="card-profile.schedule" >
                                                            {(message) => <option value='7'>{message}</option>}
                                                        </FormattedMessage>
                                                    </select>
                                                </div>
                                                <div className='body-menu'>
                                                    {!_.isEmpty(this.state.data.social) &&
                                                        <div className={active === 1 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 1 })}
                                                        ><FormattedMessage id="card-profile.social" /></div>
                                                    }
                                                    {!_.isEmpty(this.state.data.bank) &&
                                                        <div className={active === 2 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 2 })}
                                                        ><FormattedMessage id="card-profile.bank" /></div>
                                                    }
                                                    {!_.isEmpty(this.state.data.email) &&
                                                        <div className={active === 3 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 3 })}
                                                        ><FormattedMessage id="card-profile.email" /></div>
                                                    }
                                                    {!_.isEmpty(this.state.data.phone) &&
                                                        <div className={active === 4 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 4 })}
                                                        ><FormattedMessage id="card-profile.phone" /></div>
                                                    }
                                                    {!_.isEmpty(this.state.data.location) &&
                                                        <div className={active === 5 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 5 })}
                                                        ><FormattedMessage id="card-profile.location" /></div>
                                                    }
                                                    {!_.isEmpty(this.state.data.custom) &&
                                                        <div className={active === 6 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 6 })}
                                                        ><FormattedMessage id="card-profile.custom" /></div>
                                                    }
                                                    <div className={active === 7 ? 'menu-content active' : 'menu-content'}
                                                        onClick={() => this.setState({ active: 7 })}
                                                    ><FormattedMessage id="card-profile.schedule" /></div>
                                                </div>
                                                <div className='body-table'>
                                                    {active === 7 &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                <div className='info-item' onClick={() => this.checkEmailSchedule()}>
                                                                    <div className='item-image'>
                                                                        <i class="fas fa-calendar-alt"></i>
                                                                    </div>
                                                                    <div className='item-name'>
                                                                        <FormattedMessage id="card-profile.schedule" />
                                                                    </div>
                                                                    <div className='item-icon'>
                                                                        <i class="fas fa-chevron-right"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {active === 1 && !_.isEmpty(this.state.data.social) &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {this.state.data.social.map((item, index) => {
                                                                    let imageBase64 = '';
                                                                    if (item.data.image) {
                                                                        imageBase64 = new Buffer(item.data.image, 'base64').toString('binary');
                                                                    }
                                                                    return (
                                                                        <React.Fragment>
                                                                            <div className='info-item' key={index} onClick={() => this.openFormCheck(item.id, item.name, item.link, 'social')}>
                                                                                <div className='item-image'>
                                                                                    <img src={imageBase64} />
                                                                                </div>
                                                                                <div className='item-name'>
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className='item-icon'>
                                                                                    <i class="fas fa-chevron-right"></i>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {active === 2 && !_.isEmpty(this.state.data.bank) &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {this.state.data.bank.map((item, index) => {
                                                                    let imageBase64 = '';
                                                                    if (item.data.image) {
                                                                        imageBase64 = new Buffer(item.data.image, 'base64').toString('binary');
                                                                    }
                                                                    return (
                                                                        <React.Fragment>
                                                                            <div className='info-item' key={index} onClick={() => this.openFormCheck(item.id, item.name, item.number, 'bank')}>
                                                                                <div className='item-image'>
                                                                                    <img src={imageBase64} />
                                                                                </div>
                                                                                <div className='item-name'>
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className='item-icon'>
                                                                                    <i class="fas fa-chevron-right"></i>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {active === 3 && !_.isEmpty(this.state.data.email) &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {this.state.data.email.map((item, index) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <div className='info-item' key={index} onClick={() => this.openFormCheck(item.id, item.name, item.email, 'email')}>
                                                                                <div className='item-image'>
                                                                                    <i class="far fa-envelope"></i>
                                                                                </div>
                                                                                <div className='item-name'>
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className='item-icon'>
                                                                                    <i class="fas fa-chevron-right"></i>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {active === 4 && !_.isEmpty(this.state.data.phone) &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {this.state.data.phone.map((item, index) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <div className='info-item' key={index} onClick={() => this.openFormCheck(item.id, item.name, item.number, 'phone')}>
                                                                                <div className='item-image'>
                                                                                    <i class="fas fa-phone-volume"></i>
                                                                                </div>
                                                                                <div className='item-name'>
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className='item-icon'>
                                                                                    <i class="fas fa-chevron-right"></i>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {active === 5 && !_.isEmpty(this.state.data.location) &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {this.state.data.location.map((item, index) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <div className='info-item' key={index} onClick={() => this.openFormCheck(item.id, item.name, item.link, 'location')}>
                                                                                <div className='item-image'>
                                                                                    <i class="fas fa-map-marker-alt"></i>
                                                                                </div>
                                                                                <div className='item-name'>
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className='item-icon'>
                                                                                    <i class="fas fa-chevron-right"></i>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {active === 6 && !_.isEmpty(this.state.data.custom) &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {this.state.data.custom.map((item, index) => {
                                                                    let imageBase64 = '';
                                                                    if (item.data.image) {
                                                                        imageBase64 = new Buffer(item.data.image, 'base64').toString('binary');
                                                                    }
                                                                    return (
                                                                        <React.Fragment>
                                                                            <div className='info-item' key={index} onClick={() => this.openFormCheck(item.id, item.name, item.link, 'custom')}>
                                                                                <div className='item-image'>
                                                                                    <img src={imageBase64} />
                                                                                </div>
                                                                                <div className='item-name'>
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className='item-icon'>
                                                                                    <i class="fas fa-chevron-right"></i>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }

                                </div>
                            </div>
                        </React.Fragment>
                    }
                </div >
                <Footer />
            </React.Fragment >
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isUser: state.user.isUser,
        isAdmin: state.user.isAdmin,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Card));
