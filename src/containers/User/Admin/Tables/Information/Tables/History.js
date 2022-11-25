import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './History.scss';
import { LANGUAGES, CommonUtils, path } from "../../../../../../utils";
import { toast } from "react-toastify";
import _ from 'lodash';
import { getHistory } from "../../../../../../services/userService";

class History extends Component {

    constructor(props) {
        super(props);
        this.state = {
            get_runing: true,
            arrInfo: {},
            total: 0,

            step_number: 15,
            default_number: 10,
            number: 10,
            more_type: 'get',

            link_filter: '',
            type_filter: '',
            vname_filter: '',

            filter_runing: false,
        }
    }
    componentDidMount() {
        this.getInfo();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    getTotal = async () => {
        let data = {
            type: 'total',
            user: this.props.id,
        }
        let total = await getHistory(data);
        if (total) {
            this.setState({
                total: total
            })
        }
    }
    getInfo = async () => {
        if (this.state.filter_runing === true) {
            await this.setState({
                number: this.state.default_number,
                get_runing: !this.state.get_runing,
                filter_runing: !this.state.filter_runing,
            })
        }
        let data = {
            type: 'all',
            user: this.props.id,
            number: this.state.number,
        }
        let res = await getHistory(data);
        if (!res || res.err === 'NOT') {

        } else {
            this.setState({
                arrInfo: res,
            })
        }
        await this.getTotal();
        this.setState({
            get_runing: true,
            more_type: 'get',
            link_filter: '',
            type_filter: '',
            vname_filter: '',
        })
        if (_.isEmpty(this.state.arrInfo)) {
            toast.success("Lịch sử trống, hãy mở rộng mối quan hệ !");
        }
    }
    filter = async () => {
        if (this.state.get_runing === true) {
            await this.setState({
                number: this.state.default_number,
                get_runing: !this.state.get_runing,
                filter_runing: !this.state.filter_runing,
            })
        }
        let data = {
            type: 'filter',
            user: this.props.id,
            number: this.state.number,
            link: this.state.link_filter,
            vname: this.state.vname_filter,
            vtype: this.state.type_filter,
        }
        let res = await getHistory(data);
        if (!res || res.err === 'NOT') {
            toast.success("Không tìm thấy thông tin hợp lệ !");
        } else {
            this.setState({
                arrInfo: res,
            })
        }
        await this.getTotal();
        this.setState({
            more_type: 'filter'
        })
    }
    deleteOne = async (id) => {
        let data = {
            type: 'delete-one',
            id: id
        }
        let res = await getHistory(data);
        if (res.err) {
            toast.error("Đã xảy ra lỗi !!!");
        } else {
            await this.getInfo();
        }
    }
    deleteAll = async () => {
        let warning = prompt("Bạn có chắc chắn muốn xóa hết tất cả ? Nhập YES để xác nhận hoặc bấm bất kì để hùy.", "");
        if (warning === "YES") {
            let data = {
                type: 'delete-all',
                user: this.props.id,
            }
            let res = await getHistory(data);
            if (res.err) {
                toast.error("Đã xảy ra lỗi !!!");
            } else {
                await this.getInfo();
                this.setState({
                    total: 0,
                })
            }
        }
    }
    showMore = async (type) => {
        let more_type = this.state.more_type;
        if (type === 'default') {
            this.setState({
                number: this.state.default_number,
            }, async () => {
                if (more_type === 'get') {
                    this.getInfo();
                } else if (more_type === 'filter') {
                    await this.filter();
                }
            })
        } else if (type === 'next') {
            this.setState({
                number: this.state.number + this.state.step_number
            }, async () => {
                if (more_type === 'get') {
                    await this.getInfo();
                } else if (more_type === 'filter') {
                    await this.filter();
                }
                console.log("state sau cong: ", this.state.number);
                if ((this.state.number - this.state.arrInfo.length) >= this.state.step_number) {
                    this.setState({
                        number: this.state.number - this.state.step_number
                    }, () => {
                        console.log("state sau tru: ", this.state.number);
                    })
                }
            })
        } else {
            if (this.state.number > this.state.default_number) {
                console.log("state truoc: ", this.state.number);
                this.setState({
                    number: this.state.number - this.state.step_number
                }, async () => {
                    console.log("state: ", this.state.number);
                    if (more_type === 'get') {
                        await this.getInfo();
                    } else if (more_type === 'filter') {
                        await this.filter();
                    }
                })
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
    render() {
        let showNumber = 0;
        if (this.state.arrInfo?.length > 0) {
            showNumber = this.state.arrInfo.length;
        }
        let arrInfo = this.state.arrInfo;
        return (
            <React.Fragment>
                <div className='history'>
                    <div className='history-header'>
                        <div className='history-title'>
                            <i class="fas fa-arrow-circle-left"
                                onClick={() => this.props.showUserInfo()}
                            ></i>
                            Thông Tin Tài Khoản Này Đã Xem
                        </div>
                        <div className='history-tool'>
                            <div className='tool-input'>
                                <div className='tool-content'>
                                    <div className='htitle'>Loại thông tin</div>
                                    <div className='hinput'>
                                        <select
                                            onChange={(event) => this.handleOnChangeInput(event, 'type_filter')}
                                            value={this.state.type_filter}
                                        >
                                            <option value=''>Tất cả</option>
                                            <option value='profile'>Trang cá nhân</option>
                                            <option value='card'>Danh thiếp</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='tool-content'>
                                    <div className='htitle'>Tên hiển thị</div>
                                    <div className='hinput'>
                                        <input onChange={(event) => this.handleOnChangeInput(event, 'vname_filter')}
                                            value={this.state.vname_filter} ></input>
                                    </div>
                                </div>
                            </div>

                            <div className='tool-content'>
                                <div className='hsubmit' title='Tìm kiếm'
                                    onClick={() => this.filter()}
                                ><i class="fas fa-search"></i></div>
                                <div className='hrefect' title='Làm mới'
                                    onClick={() => this.getInfo()}
                                ><i class="fas fa-undo"></i></div>
                                <div className='hdelete' title='Xóa tất cả'
                                    onClick={() => this.deleteAll()}
                                ><i class="fas fa-trash-alt"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className='history-body'>
                        <div>
                            Đang hiển thị: <b>{showNumber}</b>/<b>{this.state.total}</b>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='table-title'>Thời gian</td>
                                    <td className='table-title'>Tên hiển thị</td>
                                    <td className='table-title center'>Liên kết</td>
                                    <td className='table-title center'>Loại thông tin</td>
                                    <td className='table-title center'>Thao tác</td>
                                </tr>
                                {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><i class="fas fa-clock"></i> {item.time}</td>
                                            <td> {item.vname}</td>
                                            <td className='center'><a href={item.link} target='_blank'>Mở Link <i class="fas fa-external-link-alt"></i></a></td>
                                            {item.type === 'profile' ?
                                                <React.Fragment>
                                                    <td className='center'><i class="fas fa-user"></i> Trang cá nhân</td>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <td className='center'><i class="far fa-address-card"></i> Danh thiếp</td>
                                                </React.Fragment>
                                            }
                                            <td className='center'><i class="fas fa-trash-alt btn"
                                                onClick={() => this.deleteOne(item.id)}
                                            ></i></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className='show-more'>
                            <div className='pre' onClick={() => this.showMore('pre')}><i class="fas fa-minus"></i> Ẩn bớt</div>
                            <div className='default' onClick={() => this.showMore('default')}><i class="fas fa-sync-alt"></i> Mặc định</div>
                            <div className='next' onClick={() => this.showMore('next')}> <i class="fas fa-plus"></i> Xem thêm</div>
                            <div>
                                Đang hiển thị: <b>{showNumber}</b>/<b>{this.state.total}</b>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(History));
