import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import { getProfile, viewItem } from '../../services/userService';
import { LANGUAGES, path } from "../../utils";
import { changeLanguageApp } from '../../store/actions/appActions';
import { FormattedMessage } from 'react-intl';
import Cookies from 'js-cookie'
import logo from '../../assets/logo_01.png'
import './Profile.scss';
import './ProfileMobile.scss';
import { faPersonArrowUpFromLine } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link: this.props.match.params.id,
            isLock: false,
            active: 0,
            profile: {},
            view: 0,
            check: false,
            item_name: '',
            item_content: '',
            item_table: '',
            qrcode: `https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=${path.BASE_URL}/porfile/${this.props.match.params.id}`
        }
        // thay doi domain can khi chuyen trang
        this.props.history.push(`/profile/${this.state.link}`);
    }

    componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo != this.props.userInfo) {
            await this.getInfo();
            await this.checkInfo();
        }
    }

    getInfo = async () => {
        let data = {};
        let userInfo = this.props.userInfo;

        if (!Cookies.get(this.state.link)) {
            await this.setState({
                view: 1,
            })
            Cookies.set(this.state.link, 'false', {
                expires: 0.003472
            });
        }
        if (!_.isEmpty(userInfo)) {
            data = {
                link: this.state.link,
                vid: this.props.userInfo.id,
                vname: this.props.userInfo.name,
                vlink: `/profile/${this.props.userInfo.link}`,
                content: `/profile/${this.props.match.params.id}`,
                vemail: this.props.userInfo.email,
                view: this.state.view
            }
        } else {
            data = {
                link: this.state.link,
                vid: 'hide',
                content: `/porfile/${this.props.match.params.id}`,
                view: this.state.view
            }
        }
        let res = await getProfile(data);
        if (!res || res.err) {
            if (res.err === 'LOCK') {
                // toast.error("Trang cá nhân đang ẩn, hoặc không tồn tại !");
            } else {
                toast.error("Đã xảy ra lỗi !!!");
            }
            this.setState({
                isLock: true,
            })
        } else {
            this.setState({
                profile: res
            })
        }
    }

    checkInfo = async () => {
        if (this.state.profile.custom?.length > 0) {
            this.setState({
                active: 6,
            })
        }
        if (this.state.profile.location?.length > 0) {
            this.setState({
                active: 5,
            })
        }
        if (this.state.profile.phone?.length > 0) {
            this.setState({
                active: 4,
            })
        }
        if (this.state.profile.email?.length > 0) {
            this.setState({
                active: 3,
            })
        }
        if (this.state.profile.bank?.length > 0) {
            this.setState({
                active: 2,
            })
        }
        if (this.state.profile.social?.length > 0) {
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

        let url = 'https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=' + path.BASE_URL + '/profile/' + this.props.userInfo.link;
        const blob = await fetch(url).then(res => res.blob());
        let downloadLink = await URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadLink
        a.download = `${this.state.profile.name} _QRCODE.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    render() {
        let profile = this.state.profile;
        let social = this.state.profile.social;
        let bank = this.state.profile.bank;
        let email = this.state.profile.email;
        let phone = this.state.profile.phone;
        let location = this.state.profile.location;
        let custom = this.state.profile.custom;
        let active = +this.state.active;
        let qrcode = this.state.qrcode;
        let check = this.state.check;
        let imageBase64 = '';
        if (profile) {
            if (profile.image) {
                imageBase64 = new Buffer(profile.image, 'base64').toString('binary');
            }
        }
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
                <Header />
                <div className='profile'>
                    <div className='cover'>
                        <div className='cover-color'></div>
                    </div>
                    {this.state.isLock === true ?
                        <React.Fragment>
                            <div className='body-lock'>
                                <div className='box-banned'>
                                    <div className='title-banned'><FormattedMessage id="card-profile.empty" /></div>
                                    <div className='icon-banned'><i class="fas fa-bug"></i></div>
                                    <div className='btn-banned' onClick={() => { window.location = "/"; }}>OK</div>
                                </div>
                            </div>
                        </React.Fragment> :
                        <React.Fragment>
                            <div className='body-active'>
                                <div className='body-profile'>
                                    <div className='profile-header'>
                                        <div className='header-info'>
                                            <div className='header-img'>
                                                {profile.vip === 'FREE' ?
                                                    <React.Fragment>
                                                        <img src={imageBase64}></img>
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                        <img src={imageBase64} className='vip'></img>
                                                    </React.Fragment>
                                                }
                                            </div>
                                            <div className='header-content'>
                                                <div className='name'>{profile.name}</div>
                                                <div className='intro'>{profile.intro}</div>
                                                {profile.vip === 'FREE' ?
                                                    <React.Fragment>
                                                        <div className='warning free'><i class="fas fa-exclamation-circle"></i> <FormattedMessage id="card-profile.free" /></div>
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                        <div className='warning vip'><i class="fas fa-check-circle"></i> <FormattedMessage id="card-profile.paid" /></div>
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                        <div className='header-qrcode'>
                                            <img src={qrcode} id="a" onClick={() => this.downloadImage()} title='Download QR CODE'></img>
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
                                                        {social?.length > 0 &&
                                                            <FormattedMessage id="card-profile.social" >
                                                                {(message) => <option value='1'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {bank?.length > 0 &&
                                                            <FormattedMessage id="card-profile.bank" >
                                                                {(message) => <option value='2'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {email?.length > 0 &&
                                                            <FormattedMessage id="card-profile.email" >
                                                                {(message) => <option value='3'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {phone?.length > 0 &&
                                                            <FormattedMessage id="card-profile.phone" >
                                                                {(message) => <option value='4'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {location?.length > 0 &&
                                                            <FormattedMessage id="card-profile.location" >
                                                                {(message) => <option value='5'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                        {custom?.length > 0 &&
                                                            <FormattedMessage id="card-profile.custom" >
                                                                {(message) => <option value='6'>{message}</option>}
                                                            </FormattedMessage>
                                                        }
                                                    </select>
                                                </div>
                                                <div className='body-menu'>
                                                    {social?.length > 0 &&
                                                        <div className={active === 1 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 1 })}
                                                        ><FormattedMessage id="card-profile.social" /></div>
                                                    }
                                                    {bank?.length > 0 &&
                                                        <div className={active === 2 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 2 })}
                                                        ><FormattedMessage id="card-profile.bank" /></div>
                                                    }
                                                    {email?.length > 0 &&
                                                        <div className={active === 3 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 3 })}
                                                        ><FormattedMessage id="card-profile.email" /></div>
                                                    }
                                                    {phone?.length > 0 &&
                                                        <div className={active === 4 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 4 })}
                                                        ><FormattedMessage id="card-profile.phone" /></div>
                                                    }
                                                    {location?.length > 0 &&
                                                        <div className={active === 5 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 5 })}
                                                        ><FormattedMessage id="card-profile.location" /></div>
                                                    }
                                                    {custom?.length > 0 &&
                                                        <div className={active === 6 ? 'menu-content active' : 'menu-content'}
                                                            onClick={() => this.setState({ active: 6 })}
                                                        ><FormattedMessage id="card-profile.custom" /></div>
                                                    }
                                                </div>
                                                <div className='body-table'>
                                                    {active === 1 && social?.length > 0 &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {social && social.length > 0 && social.map((item, index) => {
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
                                                    {active === 2 && bank?.length > 0 &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {bank && bank.length > 0 && bank.map((item, index) => {
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
                                                    {active === 3 && email?.length > 0 &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {email && email.length > 0 && email.map((item, index) => {
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
                                                    {active === 4 && phone?.length > 0 &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {phone && phone.length > 0 && phone.map((item, index) => {
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
                                                    {active === 5 && location?.length > 0 &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {location && location.length > 0 && location.map((item, index) => {
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
                                                    {active === 6 && custom?.length > 0 &&
                                                        <React.Fragment>
                                                            <div className='table-content'>
                                                                {custom && custom.length > 0 && custom.map((item, index) => {
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
                </div>
                <Footer />
            </React.Fragment>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo));
