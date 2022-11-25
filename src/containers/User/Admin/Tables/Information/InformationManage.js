import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './InformationManage.scss';
import { LANGUAGES, CommonUtils, path } from "../../../../../utils";
import * as actions from "../../../../../store/actions"
import { toast } from "react-toastify";
import _ from 'lodash';

import Social from './Tables/Social';
import Bank from './Tables/Bank';
import Custom from './Tables/Custom';
import Email from './Tables/Email';
import Phone from './Tables/Phone';
import Location from './Tables/Location';
import Card from './Tables/Card';
import Schedule from './Tables/Schedule';
import Viewer from './Tables/Viewer';
import History from './Tables/History';

import { updateProfileService } from '../../../../../services/userService';
import { adminDashboardService } from '../../../../../services/adminMenuService';

import { FormattedMessage } from 'react-intl';

class InfomationManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 1,
            number: 0,
            show: 0,
            view: 0,

            userInfo: {},
            id: {},
            user_roleid: '',
            user_password: '',
            user_email: '',
            user_phone: '',
            user_name: '',
            user_sex: '',
            user_intro: '',
            user_link: '',
            user_vip: '',
            user_view: '',
            user_hide: '',
            user_lockprofile: '',
            user_active: '',
            user_image: '',

            isShow: false,
            showUserInfo: false,
        }
    }
    componentDidMount() {
        this.getUserInfo();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    getUserInfo = async () => {
        let newInfo = {
            type: 'refect',
            id: this.props.id,
        }
        let res = await updateProfileService(newInfo);
        if (res && res.err) {
            if (res.err === 'NOT') {

            } else {
                toast.error("Server trả về mã lỗi !");
            }
        } else {
            this.setState({
                userInfo: res,
                user_roleid: res.roleid,
                user_password: '',
                user_email: res.email,
                user_phone: res.phone,
                user_name: res.name,
                user_sex: res.sex,
                user_intro: res.intro,
                user_link: res.link,
                user_vip: res.vip,
                user_view: res.view,
                user_hide: res.hide,
                user_lockprofile: res.lockprofile,
                user_active: res.active,
                user_image: res.image,
            })
        }
    }
    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                user_image: base64
            })
        }
        // tao data gui di
        let newUserInfo = {
            id: this.props.id,
            image: this.state.user_image,
            type: 'image'
        }
        let res = await updateProfileService(newUserInfo);
        if (res && res.err) {
            if (res.err === 'NOT') {

            } else {
                toast.error("Server trả về mã lỗi !");
            }
        } else {
            this.setState({
                userInfo: res,
                user_roleid: res.roleid,
                user_password: '',
                user_email: res.email,
                user_phone: res.phone,
                user_name: res.name,
                user_sex: res.sex,
                user_intro: res.intro,
                user_link: res.link,
                user_vip: res.vip,
                user_view: res.view,
                user_hide: res.hide,
                user_lockprofile: res.lockprofile,
                user_active: res.active,
                user_image: res.image,
            })
        }
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    saveUserInfo = async () => {
        let newInfo = {
            id: this.props.id,
            type: 'update-user',
            table: 'user',

            roleid: this.state.user_roleid,

            email: this.state.user_email,
            phone: this.state.user_phone,
            password: this.state.user_password,

            name: this.state.user_name,
            intro: this.state.user_intro,

            sex: this.state.user_sex,
            vip: this.state.user_vip,
            link: this.state.user_link,

            view: this.state.user_view,
            hide: this.state.user_hide,
            active: this.state.user_active,

            lockprofile: this.state.user_lockprofile,

        }
        let res = await adminDashboardService(newInfo);
        if (!res || res.err) {
            if (res.err === 1) {
                toast.error("Trùng địa chỉ email !");
            } else if (res.err === 2) {
                toast.error("Trùng liên kết cá nhân !");
            } else {
                toast.error("Đã xảy ra lỗi !");
            }
        } else {
            if (this.props.id === this.props.userInfo.id) {
                await this.props.updateProfile(newInfo);
            }
            toast.success("Cập nhật thông tin thành công");
            this.getUserInfo();
        }
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
    cardManage = () => {
        this.setState({
            active: 7
        })
    }
    scheduleManage = () => {
        this.setState({
            active: 8,
            showUserInfo: true,
        })
    }
    viewerManage = () => {
        this.setState({
            active: 9,
            showUserInfo: true,
        })
    }
    historyManage = () => {
        this.setState({
            active: 10,
            showUserInfo: true,
        })
    }
    gotoProfile = () => {
        if (this.state.userInfo.hide === 'ON') {
            toast.warning("Bạn cần bật Hiển Thị Trang Cá Nhân tại mục Tài Khoản !");
        } else {
            window.open(`http://localhost:3000/profile/` + this.state.userInfo.link)
        }
    }
    checkView = (number, show, view) => {
        this.setState({
            number: number,
            show: show,
            view: view
        })
    }
    showUserInfo = () => {
        this.setState({
            showUserInfo: false,
            active: 1,
        })
    }
    render() {
        let active = this.state.active;
        let user_image = this.state.user_image;
        let imageBase64 = '';
        if (user_image) {
            if (user_image) {
                imageBase64 = new Buffer(user_image, 'base64').toString('binary');
            }
        }
        return (
            <React.Fragment>
                {this.state.showUserInfo === false ?
                    <React.Fragment>
                        <div className='information-manage-admin user'>
                            <div className='information-content'>
                                <div className='information-content-left'>
                                    <div className='left-header' >
                                        <div className='header-icon'>
                                            <i class="fas fa-arrow-alt-circle-left"
                                                onClick={() => this.props.displayUser('')}
                                            ></i>
                                        </div>
                                        <div className='header-image'>
                                            <input id="upload-img" type="file" hidden
                                                onChange={(event) => this.handleOnchangeImage(event)}
                                            />
                                            <div className='user-img'><label htmlFor="upload-img" title="Ấn để đổi ảnh đại diện"><img src={imageBase64} /></label></div>
                                        </div>
                                        <div className='header-status'>
                                            <div className='name'>{this.state.user_name}</div>
                                            {this.state.user_hide === 'ON' ?
                                                <React.Fragment>
                                                    <div className='status lock'>Đang ẩn trang cá nhân</div>
                                                </React.Fragment>
                                                : <React.Fragment>
                                                    <div className='status' onClick={() => this.gotoProfile()}>Xem trang cá nhân</div>
                                                </React.Fragment>
                                            }
                                        </div>
                                    </div>
                                    <div className='left-info'>
                                        <div className='info-title'
                                            onClick={() => { this.setState({ isShow: !this.state.isShow }); this.getUserInfo() }}
                                        >
                                            {this.state.isShow === true ?
                                                <React.Fragment>
                                                    <b>Chi tiết tài khoản</b><i class="fas fa-chevron-circle-up"></i>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <b>Chi tiết tài khoản</b><i class="fas fa-chevron-circle-down"></i>
                                                </React.Fragment>
                                            }
                                        </div>
                                        {this.state.isShow === true &&
                                            <React.Fragment>
                                                <div className='info-body'>
                                                    <div className='info-content'>
                                                        <div className="content-title">ID:</div>
                                                        <div className="content-data"> <b>{this.state.userInfo.id}</b></div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Tài khoản:</div>
                                                        <div className="content-data">
                                                            <select
                                                                onChange={(event) => this.handleOnChangeInput(event, "user_roleid")}
                                                                value={this.state.user_roleid} required
                                                            >
                                                                <option value="R2">Người dùng</option>
                                                                <option value="R1">Quản trị viên</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Name:</div>
                                                        <div className="content-data">
                                                            <input onChange={(event) => this.handleOnChangeInput(event, "user_name")}
                                                                value={this.state.user_name}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Email:</div>
                                                        <div className="content-data">
                                                            <input onChange={(event) => this.handleOnChangeInput(event, "user_email")}
                                                                value={this.state.user_email}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Phone:</div>
                                                        <div className="content-data">
                                                            <input onChange={(event) => this.handleOnChangeInput(event, "user_phone")}
                                                                value={this.state.user_phone}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Password:</div>
                                                        <div className="content-data">
                                                            <input value={this.state.user_password} type='password'
                                                                onChange={(event) => this.handleOnChangeInput(event, "user_password")}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Giới thiệu:</div>
                                                        <div className="content-data">
                                                            <textarea rows='4' onChange={(event) => this.handleOnChangeInput(event, "user_intro")}
                                                                value={this.state.user_intro}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Giới tính:</div>
                                                        <div className="content-data">
                                                            <select
                                                                onChange={(event) => this.handleOnChangeInput(event, "user_sex")}
                                                                value={this.state.user_sex}
                                                            >
                                                                <option value="M">Nam</option>
                                                                <option value="F">Nữ</option>
                                                                <option value="O">Chuyển giới</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">VIP:</div>
                                                        <div className="content-data">
                                                            <select onChange={(event) => this.handleOnChangeInput(event, "user_vip")}
                                                                value={this.state.user_vip}
                                                            >
                                                                <option value="PAID">Trả phí</option>
                                                                <option value="FREE">Miễn phí</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Trang cá nhân:</div>
                                                        <div className="content-data">
                                                            <select onChange={(event) => this.handleOnChangeInput(event, "user_hide")}
                                                                value={this.state.user_hide}
                                                            >
                                                                <option value="OFF">Hiển thị</option>
                                                                <option value="ON">Ẩn</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Link:</div>
                                                        <div className="content-data">
                                                            <input
                                                                onChange={(event) => this.handleOnChangeInput(event, "user_link")}
                                                                value={this.state.user_link}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">View:</div>
                                                        <div className="content-data">
                                                            <input onChange={(event) => this.handleOnChangeInput(event, "user_view")}
                                                                value={this.state.user_view}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Khóa bảo mật:</div>
                                                        <div className="content-data">
                                                            <select onChange={(event) => this.handleOnChangeInput(event, "user_lockprofile")}
                                                                value={this.state.user_lockprofile}
                                                            >
                                                                <option value="OFF">Đang tắt</option>
                                                                <option value="ON">Đang bật</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='info-content'>
                                                        <div className="content-title">Tình trạng:</div>
                                                        <div className="content-data">
                                                            <select onChange={(event) => this.handleOnChangeInput(event, "user_active")}
                                                                value={this.state.user_active}
                                                            >
                                                                <option value="ON">Hoạt động</option>
                                                                <option value="OFF">Bị khóa</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='info-submit'>
                                                        <div className='btn-save'
                                                            onClick={() => this.saveUserInfo()}
                                                        >Lưu lại</div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                    <div className='left-menu'>
                                        <div className={active === 1 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.socialManage()}
                                        ><i class="far fa-folder"></i> Mạng xã hội</div>
                                        <div className={active === 2 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.emailManage()}
                                        ><i class="far fa-folder"></i> Địa chỉ email</div>
                                        <div className={active === 3 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.phoneManage()}
                                        ><i class="far fa-folder"></i> Số điện thoại</div>
                                        <div className={active === 4 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.bankManage()}
                                        ><i class="far fa-folder"></i> Chuyển, nhận tiền</div>
                                        <div className={active === 5 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.locationManage()}
                                        ><i class="far fa-folder"></i> Vị trí đã ghim</div>
                                        <div className={active === 6 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.customManage()}
                                        > <i class="far fa-folder"></i> Tùy chỉnh</div>
                                        <div className={active === 7 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.cardManage()}
                                        ><i class="far fa-folder"></i> Danh thiếp</div>
                                    </div>
                                    <div className='left-footer'>
                                        {this.state.active === 7 ?
                                            <React.Fragment>
                                                <div className='footer-content'>
                                                    Số loại danh thiếp: <b>{this.state.number}</b>
                                                </div>
                                                <div className='footer-content'>
                                                    Loại đã hết: <b>{this.state.show}</b>
                                                </div>
                                                <div className='footer-content'>
                                                    Tổng số lượng còn lại: <b>{this.state.view}</b>
                                                </div>
                                            </React.Fragment> :
                                            <React.Fragment>
                                                <div className='footer-content'>
                                                    Số lượng: <b>{this.state.number}</b>
                                                </div>
                                                <div className='footer-content'>
                                                    Đang hiển thị: <b>{this.state.show}</b>
                                                </div>
                                                <div className='footer-content'>
                                                    Tổng số view: <b>{this.state.view}</b>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                    <div className='left-menu'>
                                        <div className={active === 8 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.scheduleManage()}
                                        ><i class="fas fa-calendar-alt"></i>Lịch hẹn</div>
                                        <div className={active === 9 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.viewerManage()}
                                        ><i class="fas fa-users"></i>Người xem</div>
                                        <div className={active === 10 ? 'sub-menu active' : 'sub-menu'}
                                            onClick={() => this.historyManage()}
                                        ><i class="fas fa-history"></i>Lịch sử</div>
                                    </div>

                                </div>
                                <div className='information-content-right'>
                                    {active === 1 ? <Social checkView={this.checkView} id={this.props.id} /> : ''}
                                    {active === 2 ? <Email checkView={this.checkView} id={this.props.id} /> : ''}
                                    {active === 3 ? <Phone checkView={this.checkView} id={this.props.id} /> : ''}
                                    {active === 4 ? <Bank checkView={this.checkView} id={this.props.id} /> : ''}
                                    {active === 5 ? <Location checkView={this.checkView} id={this.props.id} /> : ''}
                                    {active === 6 ? <Custom checkView={this.checkView} id={this.props.id} /> : ''}
                                    {active === 7 ? <Card checkView={this.checkView} id={this.props.id} /> : ''}
                                </div>
                            </div>
                        </div>
                    </React.Fragment> :
                    <React.Fragment>
                        {this.state.active === 8 && <Schedule id={this.props.id} showUserInfo={this.showUserInfo} />}
                        {this.state.active === 9 && <Viewer id={this.props.id} showUserInfo={this.showUserInfo} />}
                        {this.state.active === 10 && <History id={this.props.id} showUserInfo={this.showUserInfo} />}
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
        updateProfile: (newUserInfo) => dispatch(actions.updateProfile(newUserInfo)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfomationManage));
