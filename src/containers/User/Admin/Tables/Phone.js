import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Phone.scss';
import { FormattedMessage } from 'react-intl';
import { toast } from "react-toastify";
import _, { get } from 'lodash';
import { adminDashboardService } from '../../../../services/adminMenuService';
import { getListService, updateInfoService } from '../../../../services/userService'
import { isTypeNode } from 'typescript';

class Phone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            get_runing: true,
            arrInfo: [],
            total: 0,

            step_number: 5,
            default_number: 10,
            number: 10,
            more_type: 'get',

            filter_runing: false,
            list_filter: '',
            hide_filter: '',
            name_filter: '',

            filterId_runing: false,

        }
    }
    componentDidMount() {
        this.getInfo();
        this.getTotal();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    getTotal = async () => {
        let newInfo = {
            table: 'phone',
            type: 'total',
        }
        let total = await adminDashboardService(newInfo);
        if (total) {
            this.setState({
                total: total
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
    // Ham load du lieu
    getInfo = async () => {
        if (this.state.filter_runing === true) {
            await this.setState({
                number: this.state.default_number,
                get_runing: !this.state.get_runing,
                filter_runing: !this.state.filter_runing,
                filterId_runing: false,
                list_filter: '',
                hide_filter: '',
                name_filter: '',
            })
        }
        let newInfo = {
            table: 'phone',
            type: 'get',
            number: this.state.number
        }
        let res = await adminDashboardService(newInfo);
        if (res && res.err) {
            toast.error("Server trả về mã lỗi !");
        } else {
            await this.setState({
                arrInfo: res,
                more_type: 'get',
                filterId_runing: false,
            })
        }
    }
    filter = async () => {
        if (this.state.get_runing === true) {
            await this.setState({
                number: this.state.default_number,
                get_runing: !this.state.get_runing,
                filter_runing: !this.state.filter_runing,
                filterId_runing: false,
            })
        }
        let data = {
            type: 'filter',
            table: 'phone',
            number: this.state.number,
            hide_filter: this.state.hide_filter,
            name_filter: this.state.name_filter,
            list_filter: this.state.list_filter,
        }
        let res = await adminDashboardService(data);
        if (res && res.err) {
            toast.error("Đã xảy ra lỗi !!!");
        } else {
            this.setState({
                arrInfo: res,
                more_type: 'filter'
            })
        }
    }
    filterId = async (user) => {
        let newInfo = {
            table: 'phone',
            type: 'get',
            user: user,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            if (res.err === 'NOT') {

            } else {
                toast.error("Server trả về mã lỗi !");
            }
        } else {
            this.setState({
                arrInfo: res,
                filterId_runing: true
            })
        }
    }
    // thao tac
    deleteInfo = async (item) => {
        let newInfo = {
            table: 'phone',
            type: 'delete',
            id: item.id,
            user: item.user,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            toast.error("Đã xảy ra lỗi !");
        } else {
            await this.getInfo();
            toast.success("Xóa thông tin thành công !");
        }
    }
    // hien an form
    hideForm = (event) => {
        if (event.target.id === 'form-info') {
            this.setState({
                showForm: !this.state.showForm
            })
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
                if ((this.state.number - this.state.arrInfo.length) > this.state.step_number) {
                    this.setState({
                        number: this.state.number - this.state.step_number
                    })
                }
            })
        } else {
            if (this.state.number > this.state.default_number) {
                this.setState({
                    number: this.state.number - this.state.step_number
                }, async () => {

                    if (more_type === 'get') {
                        await this.getInfo();
                    } else if (more_type === 'filter') {
                        await this.filter();
                    }
                })
            }
        }

    }

    render() {
        let arrInfo = this.state.arrInfo;
        return (
            <React.Fragment>
                <div className='right-box-content-admin-phone'>
                    <div className='right-header'>
                        <div className='header-title'><FormattedMessage id="info.phone" /></div>
                        <div className='header-tool'>
                            <div className='tool-content'>
                                <b><FormattedMessage id="info.state" /></b>
                                <div className='content-select'>
                                    <select
                                        onChange={(event) => this.handleOnChangeInput(event, 'hide_filter')}
                                        value={this.state.hide_filter}
                                    >
                                        <FormattedMessage id="info.all" >
                                            {(message) => <option value=''>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="info.on" >
                                            {(message) => <option value='OFF'>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="info.off" >
                                            {(message) => <option value='ON'>{message}</option>}
                                        </FormattedMessage>
                                    </select>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <b><FormattedMessage id="info.nameF" /></b>
                                <div className='content-input'>
                                    <input className='filter-input' type='text'
                                        value={this.state.name_filter}
                                        onChange={(event) => this.handleOnChangeInput(event, 'name_filter')}
                                    ></input>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <b><FormattedMessage id="info.phone" /></b>
                                <div className='content-input'>
                                    <input className='filter-input' type='text'
                                        value={this.state.list_filter}
                                        onChange={(event) => this.handleOnChangeInput(event, 'list_filter')}
                                    ></input>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <div className='btn-filter' onClick={() => this.filter()}><i class="fas fa-filter"></i></div>
                                <div className='btn-refect' onClick={() => this.getInfo()}><i class="fas fa-redo"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className='right-body'>
                        <div className='body-table-content'>
                            <div>
                                <FormattedMessage id="info.totalShow" /> <b>{this.state.arrInfo.length}</b>/<b>{this.state.total}</b>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title'>UID</td>
                                        <td className='table-title'><FormattedMessage id="info.name" /></td>
                                        <td className='table-title'><FormattedMessage id="info.phone" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.viewNumber" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.state" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.tool" /></td>
                                    </tr>
                                    {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                        return (
                                            <React.Fragment>
                                                <tr key={index}>
                                                    <td className='table-content'
                                                        onClick={() => this.props.displayUser(item.user)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {item.user}
                                                    </td>
                                                    <td className='table-content name'>{item.name}</td>
                                                    <td className='table-content fix'>
                                                        {item.number}
                                                    </td>
                                                    <td className='table-content center fix'>{item.view}</td>
                                                    <td className='table-content center fix'>
                                                        {item.hide === 'ON' ?
                                                            <React.Fragment>
                                                                <i class="fas fa-eye-slash"></i>
                                                            </React.Fragment>
                                                            : <React.Fragment>
                                                                <i class="fas fa-eye"></i>
                                                            </React.Fragment>
                                                        }

                                                    </td>
                                                    <td className='table-content center fix'>
                                                        <i class="fas fa-user" onClick={() => this.filterId(item.user)}></i>
                                                        <i class="fas fa-trash-alt" onClick={() => this.deleteInfo(item)}></i>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className='show-more'>
                                {
                                    this.state.filterId_runing === false ?
                                        <React.Fragment>
                                            <div className='pre' onClick={() => this.showMore('pre')}><i class="fas fa-minus"></i> <FormattedMessage id="info.pre" /></div>
                                            <div className='default' onClick={() => this.showMore('default')}><i class="fas fa-sync-alt"></i> <FormattedMessage id="info.default" /></div>
                                            <div className='next' onClick={() => this.showMore('next')}> <i class="fas fa-plus"></i> <FormattedMessage id="info.next" /></div>
                                            <div>
                                                <FormattedMessage id="info.totalShow" /> <b>{this.state.arrInfo.length}</b>/<b>{this.state.total}</b>
                                            </div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div><FormattedMessage id="info.only" /></div>
                                        </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Phone));
