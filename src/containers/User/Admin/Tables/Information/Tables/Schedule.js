import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Schedule.scss';
import { LANGUAGES, CommonUtils, path } from "../../../../../../utils";
import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getScheduleManage } from '../../../../../../services/userService';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class Schedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardImage: '',
            cardId: '',
            arrList: {},
            showScheduleUid: false,
            scheduleUid: {},
            scheduleCard: {},
            schedule: {},

            isOpen: false,
            imgFullScreen: '',
            scheduleOpenInfo: false,

            scheduleName: '',
            scheduleTime: '',
            scheduleLocation: '',
            scheduleContent: '',

            status: '',
            time1: '',
            time2: '',
            key: '',
        }
    }
    async componentDidMount() {
        await this.getList();
        await this.getInfo();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, async () => {
            if (id === 'cardId') {
                let arrList = this.state.arrList;
                for (let i = 0; i < arrList.length; i++) {
                    if (`${arrList[i].id}` === this.state.cardId) {
                        let imageBase64 = '';
                        if (arrList[i].image) {
                            imageBase64 = new Buffer(arrList[i].image, 'base64').toString('binary');
                        }
                        this.setState({
                            cardImage: imageBase64
                        })
                    }
                }
            }
        })
    }
    getList = async () => {
        let newInfo = {
            table: 'card',
            type: 'get',
            user: this.props.id,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            if (res.err === 'NOT') {
                toast.success("Bạn chưa có danh thiếp nào !!!");
                this.setState({
                    arrList: {}
                })
            } else {
                toast.error("Server trả về mã lỗi !");
            }
        } else {
            this.setState({
                arrList: res
            })
        }
    }
    getInfo = async () => {
        let data = {
            type: 'get',
            user: this.props.id
        }
        let res = await getScheduleManage(data);
        console.log(res);
        if (res.scheduleCard) {
            await this.setState({
                scheduleCard: res.scheduleCard,
                status: '',
                time1: '',
                time2: '',
                key: '',
                cardId: '',
            })
        }
        if (res.scheduleUid) {
            await this.setState({
                scheduleUid: res.scheduleUid,
                status: '',
                time1: '',
                time2: '',
                key: '',
                cardId: '',
            })
        }
        if (this.state.showScheduleUid === false) {
            this.setState({
                schedule: this.state.scheduleCard
            })
        } else {
            this.setState({
                schedule: this.state.scheduleUid
            })
        }
    }
    imgFullScreen = (link) => {
        this.setState({
            imgFullScreen: link,
            isOpen: true,
        })
    }
    showScheduleInfo = (item) => {
        this.setState({
            scheduleOpenInfo: true,
            scheduleName: item.name,
            scheduleTime: item.time_vi,
            scheduleLocation: item.location,
            scheduleContent: item.content,
        })
    }
    filterSchedule = async () => {
        let time1 = this.state.time1;
        let time2 = this.state.time2;
        if (time1 === '') {
            time1 = new Date('1990-1-1')
            time1 = time1.getTime();
        } else {
            time1 = new Date(this.state.time1)
            time1 = time1.getTime();
        }
        if (time2 === '') {
            time2 = new Date('2999-1-1')
            time2 = time2.getTime();
        } else {
            time2 = new Date(this.state.time2)
            time2 = time2.getTime();
        }
        console.log('time', time1, time2);
        let data = {
            type: 'filter',
            user: this.props.id,
            cardId: this.state.cardId,
            status: this.state.status,
            key: this.state.key,
            time1: time1,
            time2: time2,
        }
        let res = await getScheduleManage(data);
        if (this.state.showScheduleUid === false) {
            if (res.scheduleCard) {
                this.setState({
                    schedule: res.scheduleCard
                })
            }
        } else {
            if (res.scheduleUid) {
                this.setState({
                    schedule: res.scheduleUid,
                })
            }
        }
    }
    render() {
        let arrList = this.state.arrList;
        let schedule = this.state.schedule;
        return (
            <React.Fragment>
                <div className='schedule'>
                    {this.state.scheduleOpenInfo === true &&
                        <React.Fragment>
                            <div className='schedule-show-info'>
                                <div className='schedule-show-info-content'>
                                    <div className='sub-info-title'>
                                        <b>Chi tiết lịch hẹn: {this.state.scheduleName}</b>
                                        <i class="fas fa-times"
                                            onClick={() => this.setState({ scheduleOpenInfo: false })}
                                        ></i>
                                    </div>
                                    <div className='sub-info-content'>
                                        <b>Thời gian:</b>
                                        <span>{this.state.scheduleTime}</span>
                                    </div>
                                    <div className='sub-info-content'>
                                        <b>Địa điểm:</b>
                                        <span>{this.state.scheduleLocation}</span>
                                    </div>
                                    <div className='sub-info-content'>
                                        <b>Nội dung:</b>
                                        <span>{this.state.scheduleContent}</span>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    <div className='schedule-content'>
                        <div className='schedule-heder-tool'>
                            <div className='schedule-header'>
                                <i class="fas fa-arrow-circle-left"
                                    onClick={() => this.props.showUserInfo()}
                                ></i>
                                <b className={this.state.showScheduleUid === false ? 'active' : ''}
                                    onClick={() => this.setState({
                                        showScheduleUid: false,
                                        schedule: this.state.scheduleCard,
                                        status: '',
                                        time1: '',
                                        time2: '',
                                        key: '',
                                    })}
                                >Lịch Hẹn Của Tài Khoản Này</b>
                                <b className={this.state.showScheduleUid === true ? 'active' : ''}
                                    onClick={() => this.setState({
                                        showScheduleUid: true,
                                        cardId: '',
                                        schedule: this.state.scheduleUid,
                                        status: '',
                                        time1: '',
                                        time2: '',
                                        key: '',

                                    })}
                                >Lịch Tài Khoản Này Đã Hẹn</b>
                            </div>
                            <div className='schedule-tool'>
                                <div className='tool-content'>
                                    <b>Trạng thái:</b>
                                    <select value={this.state.status}
                                        onChange={(event) => this.handleOnChangeInput(event, 'status')}
                                    >
                                        <option value='' >Tất cả</option>
                                        {this.state.showScheduleUid === false ?
                                            <React.Fragment>
                                                <option value='S0' >Chưa xác thực</option>
                                                <option value='S1' >Chưa phản hồi</option>
                                                <option value='S2' >Đang diễn ra</option>
                                                <option value='S3' >Đã qua</option>
                                                <option value='S4B' >Bạn đã hủy</option>
                                                <option value='S4A' >Tv đã hủy</option>
                                            </React.Fragment> :
                                            <React.Fragment>
                                                <option value='S0' >Chưa xác nhận</option>
                                                <option value='S1' >Đợi phản hồi</option>
                                                <option value='S2' >Đang diễn ra</option>
                                                <option value='S3' >Đã qua</option>
                                                <option value='S4B' >TV đã hủy</option>
                                                <option value='S4A' >Bạn đã hủy</option>
                                            </React.Fragment>
                                        }
                                    </select>
                                </div>
                                {this.state.showScheduleUid === false &&
                                    <div className='tool-content'>
                                        <b>Danh thiếp:</b>
                                        <select value={this.state.cardId}
                                            onChange={(event) => this.handleOnChangeInput(event, 'cardId')}
                                        >
                                            <option value=''>TẤT CẢ DANH THIẾP</option>
                                            <React.Fragment>
                                                {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                                    return (
                                                        <React.Fragment>
                                                            <option key={item.index} value={item.id}>{item.name}</option>
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </React.Fragment>
                                        </select>
                                        {this.state.cardId !== '' ?
                                            <img src={this.state.cardImage} onClick={() => this.imgFullScreen(this.state.cardImage)}></img>
                                            : <i class="far fa-address-card"></i>
                                        }
                                    </div>
                                }
                            </div>
                            <div className='schedule-tool'>

                                <div className='tool-content'>
                                    <b>Bắt đầu:</b>
                                    <input type='datetime-local'
                                        value={this.state.time1}
                                        onChange={(event) => this.handleOnChangeInput(event, 'time1')}
                                    ></input>
                                </div>
                                <div className='tool-content'>
                                    <b>Đến:</b>
                                    <input type='datetime-local'
                                        value={this.state.time2}
                                        onChange={(event) => this.handleOnChangeInput(event, 'time2')}
                                    ></input>
                                </div>
                                <div className='tool-content'>
                                    <b>Từ khóa:</b>
                                    <input
                                        value={this.state.key}
                                        onChange={(event) => this.handleOnChangeInput(event, 'key')}
                                    ></input>
                                </div>
                                <div className='tool-content'>
                                    <div className='btn-filter'
                                        onClick={() => this.filterSchedule()}
                                    ><i class="fas fa-search"></i></div>
                                    <div className='btn-undo'
                                        onClick={() => { this.getInfo(); toast.success('Đã làm mới dữ liệu !') }}
                                    ><i class="fas fa-undo"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className='schedule-table'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title center'>Danh thiếp</td>
                                        <td className='table-title center'>Thời gian</td>
                                        <td className='table-title'>Người hẹn</td>
                                        <td className='table-title'>Email</td>
                                        <td className='table-title'>Điện thoại</td>
                                        <td className='table-title'>Lịch hẹn</td>
                                        <td className='table-title'>Trạng thái</td>
                                        <td className='table-title center'>Thao tác</td>
                                    </tr>
                                    {schedule && schedule.length > 0 && schedule.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.data.image) {
                                            imageBase64 = new Buffer(item.data.image, 'base64').toString('binary');
                                        }
                                        let date = new Date(item.time);
                                        let dd = date.getDate();
                                        let mm = date.getMonth() + 1;
                                        let yy = date.getFullYear();
                                        let h = date.getHours();
                                        let m = date.getMinutes();
                                        m = m > 9 ? m : '0' + m;
                                        item.time_vi = `${h}:${m} - ${dd}/${mm}/${yy}`
                                        item.time_en = `${h}:${m} - ${mm}/${dd}/${yy}`
                                        return (
                                            <React.Fragment>
                                                <tr>
                                                    <td className='center'>
                                                        <a href={`${path.BASE_URL}/card/${item.data.link}`} target='_blank'
                                                        ><img src={imageBase64} /></a>
                                                    </td>
                                                    <td className='center'>{item.time_vi}</td>
                                                    <td>{item.memberName}</td>
                                                    <td>{item.memberEmail}</td>
                                                    <td>{item.memberPhone}</td>
                                                    <td><span
                                                        onClick={() => this.showScheduleInfo(item)}
                                                        title='Xem chi tiết'
                                                    >{item.name}</span></td>
                                                    {item.status === 'S0' &&
                                                        <React.Fragment>
                                                            {this.state.showScheduleUid === false ?
                                                                <React.Fragment>
                                                                    <td className='red'>Chưa xác thực</td>
                                                                    <td className='center'>
                                                                        <i class="fas fa-info-circle" title='Tự động xóa sau 90 ngày'
                                                                            onClick={() => { alert("Tự động xóa sau 90 ngày !") }}
                                                                        ></i>
                                                                    </td>
                                                                </React.Fragment> :
                                                                <React.Fragment>
                                                                    <td className='red'>Chưa xác nhận</td>
                                                                    <td className='center'>
                                                                        <a
                                                                            href={`${path.BASE_URL}/verifi/?token=${item.atoken}&type=schedule&value=s1`}
                                                                            target='_blank'
                                                                            title='Xác nhận'
                                                                        >
                                                                            <i class="fas fa-check-square"></i>
                                                                        </a>
                                                                    </td>
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                    }
                                                    {item.status === 'S1' &&
                                                        <React.Fragment>
                                                            {this.state.showScheduleUid === false ?
                                                                <React.Fragment>
                                                                    <td className='yellow'>Chưa phản hồi</td>
                                                                    <td className='center'>
                                                                        <a
                                                                            href={`${path.BASE_URL}/verifi/?token=${item.btoken}&type=schedule&value=s2`}
                                                                            target='_blank'
                                                                            title='Chấp nhận'
                                                                        >
                                                                            <i class="fas fa-check-square"></i>
                                                                        </a>
                                                                        <a
                                                                            href={`${path.BASE_URL}/verifi/?token=${item.btoken}&type=schedule&value=s4b`}
                                                                            target='_blank'
                                                                            title='Từ chối với lý do...'
                                                                        >
                                                                            <i class="fas fa-window-close"></i>
                                                                        </a>
                                                                    </td>
                                                                </React.Fragment> :
                                                                <React.Fragment>
                                                                    <td className='yellow'>Đợi phản hồi</td>
                                                                    <td className='center'>
                                                                        <i class="fas fa-info-circle" title='Tự động xóa sau 90 ngày'
                                                                            onClick={() => { alert("Tự động xóa sau 90 ngày !") }}
                                                                        ></i>
                                                                    </td>
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                    }
                                                    {item.status === 'S2' &&
                                                        <React.Fragment>
                                                            {this.state.showScheduleUid === false ?
                                                                <React.Fragment>
                                                                    <td className='green'>Đang diễn ra</td>
                                                                    <td className='center'>
                                                                        <a
                                                                            href={`${path.BASE_URL}/verifi/?token=${item.btoken}&type=schedule&value=ub`}
                                                                            target='_blank'
                                                                        >
                                                                            <i class="fas fa-pencil-alt"></i>
                                                                        </a>
                                                                        <a
                                                                            href={`${path.BASE_URL}/verifi/?token=${item.btoken}&type=schedule&value=s4b`}
                                                                            target='_blank'
                                                                        >
                                                                            <i class="fas fa-window-close"></i>
                                                                        </a>
                                                                    </td>
                                                                </React.Fragment> :
                                                                <React.Fragment>
                                                                    <td className='green'>Đang diễn ra</td>
                                                                    <td className='center'>
                                                                        <a
                                                                            href={`${path.BASE_URL}/verifi/?token=${item.atoken}&type=schedule&value=ua`}
                                                                            target='_blank'
                                                                        >
                                                                            <i class="fas fa-pencil-alt"></i>
                                                                        </a>
                                                                        <a
                                                                            href={`${path.BASE_URL}/verifi/?token=${item.atoken}&type=schedule&value=s4a`}
                                                                            target='_blank'
                                                                        >
                                                                            <i class="fas fa-window-close"></i>
                                                                        </a>
                                                                    </td>
                                                                </React.Fragment>
                                                            }

                                                        </React.Fragment>
                                                    }
                                                    {item.status === 'S3' &&
                                                        <React.Fragment>
                                                            <td className='blue'>Đã qua</td>
                                                            <td className='center'>
                                                                <i class="fas fa-info-circle" title='Tự động xóa sau 90 ngày'
                                                                    onClick={() => { alert("Tự động xóa sau 90 ngày !") }}
                                                                ></i>
                                                            </td>
                                                        </React.Fragment>
                                                    }
                                                    {item.status === 'S4A' &&
                                                        <React.Fragment>
                                                            {this.state.showScheduleUid === false ?
                                                                <React.Fragment>
                                                                    <td className='organ'>Tv đã hủy</td>
                                                                    <td className='center'>
                                                                        <i class="fas fa-info-circle" title='Tự động xóa sau 90 ngày'
                                                                            onClick={() => { alert("Tự động xóa sau 90 ngày !") }}
                                                                        ></i>
                                                                    </td>
                                                                </React.Fragment> :
                                                                <React.Fragment>
                                                                    <td className='organ'>Bạn đã hủy</td>
                                                                    <td className='center'>
                                                                        <i class="fas fa-info-circle" title='Tự động xóa sau 90 ngày'
                                                                            onClick={() => { alert("Tự động xóa sau 90 ngày !") }}
                                                                        ></i>
                                                                    </td>
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                    }
                                                    {item.status === 'S4B' &&
                                                        <React.Fragment>
                                                            {this.state.showScheduleUid === false ?
                                                                <React.Fragment>
                                                                    <td className='organ'>Bạn dã hủy</td>
                                                                    <td className='center'>
                                                                        <i class="fas fa-info-circle" title='Tự động xóa sau 90 ngày'
                                                                            onClick={() => { alert("Tự động xóa sau 90 ngày !") }}
                                                                        ></i>
                                                                    </td>
                                                                </React.Fragment> :
                                                                <React.Fragment>
                                                                    <td className='organ'>Tv dã hủy</td>
                                                                    <td className='center'>
                                                                        <i class="fas fa-info-circle" title='Tự động xóa sau 90 ngày'
                                                                            onClick={() => { alert("Tự động xóa sau 90 ngày !") }}
                                                                        ></i>
                                                                    </td>
                                                                </React.Fragment>
                                                            }

                                                        </React.Fragment>
                                                    }
                                                </tr>
                                            </React.Fragment>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.imgFullScreen}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    // action={this.state.action}
                    />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Schedule));
