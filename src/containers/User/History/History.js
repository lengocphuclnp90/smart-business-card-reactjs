import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './History.scss';
import './HistoryMobile.scss';
import { LANGUAGES, CommonUtils, path } from "../../../utils";
import * as actions from "../../../store/actions"
import { toast } from "react-toastify";
import _ from 'lodash';
import { getHistory } from "../../../services/userService";
import { FormattedMessage } from 'react-intl';

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
            user: this.props.userInfo.id,
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
            user: this.props.userInfo.id,
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
            user: this.props.userInfo.id,
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
                user: this.props.userInfo.id,
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
                <div className='history-mobile'>
                    <div className='history-header'>
                        <div className='history-title'><FormattedMessage id="history.title" /></div>
                        <div className='history-tool'>
                            <div className='tool-input'>
                                <div className='tool-content'>
                                    <div className='htitle'><FormattedMessage id="history.type" /></div>
                                    <div className='hinput'>
                                        <select
                                            onChange={(event) => this.handleOnChangeInput(event, 'type_filter')}
                                            value={this.state.type_filter}
                                        >
                                            <FormattedMessage id="history.all" >
                                                {(message) => <option value=''>{message}</option>}
                                            </FormattedMessage>
                                            <FormattedMessage id="history.profile" >
                                                {(message) => <option value='profile'>{message}</option>}
                                            </FormattedMessage>
                                            <FormattedMessage id="history.card" >
                                                {(message) => <option value='card'>{message}</option>}
                                            </FormattedMessage>
                                        </select>
                                    </div>
                                </div>
                                <div className='tool-content'>
                                    <div className='htitle'><FormattedMessage id="history.name" /></div>
                                    <div className='hinput'>
                                        <input onChange={(event) => this.handleOnChangeInput(event, 'vname_filter')}
                                            value={this.state.vname_filter} ></input>
                                    </div>
                                </div>
                                <div className='tool-content-btn'>
                                    <div className='hdelete'
                                        onClick={() => this.deleteAll()}
                                    ><i class="fas fa-trash-alt"></i></div>
                                    <div className='hrefect'
                                        onClick={() => this.getInfo()}
                                    ><i class="fas fa-undo"></i></div>
                                    <div className='hsubmit'
                                        onClick={() => this.filter()}
                                    ><i class="fas fa-search"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <FormattedMessage id="history.show" /> <b>{showNumber}</b>/<b>{this.state.total}</b>
                    </div>
                    <div className='history-body'>
                        {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                            return (
                                <React.Fragment>
                                    <div className='body-sub-content'>
                                        <div className='sub-v'>
                                            <b><FormattedMessage id="view.time" />:</b>
                                            {item.time}
                                        </div>
                                        <div className='sub-v'>
                                            <b><FormattedMessage id="history.name" />:</b>
                                            {item.vname}
                                        </div>
                                        <div className='sub-v'>
                                            <b><FormattedMessage id="history.link" />:</b>
                                            <a href={item.link} target='_blank'><FormattedMessage id="history.open" /> <i class="fas fa-external-link-alt"></i></a>
                                        </div>
                                        <div className='sub-v'>
                                            <b><FormattedMessage id="history.type" />:</b>
                                            {item.type === 'profile' ?
                                                <React.Fragment>
                                                    <FormattedMessage id="history.profile" />
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <FormattedMessage id="history.card" />
                                                </React.Fragment>
                                            }
                                        </div>
                                        <div className='sub-tool'>
                                            <div className='tool-delete'
                                                onClick={() => this.deleteOne(item.id)}
                                            ><i class="fas fa-trash-alt btn"></i></div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                        <div className='show-more'>
                            <div className='tool-more'>
                                <div className='pre' onClick={() => this.showMore('pre')}><i class="fas fa-minus"></i> <FormattedMessage id="view.pre" /></div>
                                <div className='default' onClick={() => this.showMore('default')}><i class="fas fa-sync-alt"></i> <FormattedMessage id="view.default" /></div>
                                <div className='next' onClick={() => this.showMore('next')}> <i class="fas fa-plus"></i> <FormattedMessage id="view.next" /></div>

                            </div>
                            <div>
                                <FormattedMessage id="view.show" /> <b>{showNumber}</b>/<b>{this.state.total}</b>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='history'>
                    <div className='history-header'>
                        <div className='history-title'><FormattedMessage id="history.title" /></div>
                        <div className='history-tool'>
                            <div className='tool-input'>
                                <div className='tool-content'>
                                    <div className='htitle'><FormattedMessage id="history.type" /></div>
                                    <div className='hinput'>
                                        <select
                                            onChange={(event) => this.handleOnChangeInput(event, 'type_filter')}
                                            value={this.state.type_filter}
                                        >
                                            <FormattedMessage id="history.all" >
                                                {(message) => <option value=''>{message}</option>}
                                            </FormattedMessage>
                                            <FormattedMessage id="history.profile" >
                                                {(message) => <option value='profile'>{message}</option>}
                                            </FormattedMessage>
                                            <FormattedMessage id="history.card" >
                                                {(message) => <option value='card'>{message}</option>}
                                            </FormattedMessage>
                                        </select>
                                    </div>
                                </div>
                                <div className='tool-content'>
                                    <div className='htitle'><FormattedMessage id="history.name" /></div>
                                    <div className='hinput'>
                                        <input onChange={(event) => this.handleOnChangeInput(event, 'vname_filter')}
                                            value={this.state.vname_filter} ></input>
                                    </div>
                                </div>
                            </div>

                            <div className='tool-content'>
                                <div className='hsubmit'
                                    onClick={() => this.filter()}
                                ><i class="fas fa-search"></i></div>
                                <div className='hrefect'
                                    onClick={() => this.getInfo()}
                                ><i class="fas fa-undo"></i></div>
                                <div className='hdelete'
                                    onClick={() => this.deleteAll()}
                                ><i class="fas fa-trash-alt"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className='history-body'>
                        <div>
                            <FormattedMessage id="history.show" /> <b>{showNumber}</b>/<b>{this.state.total}</b>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='table-title'><FormattedMessage id="history.time" /></td>
                                    <td className='table-title'><FormattedMessage id="history.name" /></td>
                                    <td className='table-title center'><FormattedMessage id="history.link" /></td>
                                    <td className='table-title center'><FormattedMessage id="history.type" /></td>
                                    <td className='table-title center'><FormattedMessage id="history.tool" /></td>
                                </tr>
                                {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><i class="fas fa-clock"></i> {item.time}</td>
                                            <td>{item.vname}</td>
                                            <td className='center'><a href={item.link} target='_blank'><FormattedMessage id="history.open" /> <i class="fas fa-external-link-alt"></i></a></td>
                                            {item.type === 'profile' ?
                                                <React.Fragment>
                                                    <td className='center'><i class="fas fa-user"></i> <FormattedMessage id="history.profile" /></td>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <td className='center'><i class="far fa-address-card"></i> <FormattedMessage id="history.card" /></td>
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
                            <div className='pre' onClick={() => this.showMore('pre')}><i class="fas fa-minus"></i> <FormattedMessage id="history.pre" /></div>
                            <div className='default' onClick={() => this.showMore('default')}><i class="fas fa-sync-alt"></i> <FormattedMessage id="history.default" /></div>
                            <div className='next' onClick={() => this.showMore('next')}> <i class="fas fa-plus"></i> <FormattedMessage id="history.next" /></div>
                            <div>
                                <FormattedMessage id="history.show" /> <b>{showNumber}</b>/<b>{this.state.total}</b>
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
