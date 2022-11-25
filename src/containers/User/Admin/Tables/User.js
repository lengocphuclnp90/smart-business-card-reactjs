import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './User.scss';
import { FormattedMessage } from 'react-intl';
import { toast } from "react-toastify";
import _, { get } from 'lodash';
import { adminDashboardService } from '../../../../services/adminMenuService';
import { getListService, updateInfoService } from '../../../../services/userService'
import { isTypeNode } from 'typescript';

class User extends Component {

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
            id_filter: '',
            name_filter: '',
            email_filter: '',
            roleid_filter: '',
            vip_filter: '',
            active_filter: '',

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
            table: 'user',
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
            })
        }
        let newInfo = {
            table: 'user',
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
                id_filter: '',
                name_filter: '',
                email_filter: '',
                roleid_filter: '',
                vip_filter: '',
                active_filter: '',
            })
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
            type: 'filter-user',
            table: 'user',
            number: this.state.number,
            id: this.state.id_filter,
            name: this.state.name_filter,
            email: this.state.email_filter,
            roleid: this.state.roleid_filter,
            vip: this.state.vip_filter,
            active: this.state.active_filter,
        }
        let res = await adminDashboardService(data);
        console.log('res', res);
        if (!res || res.err) {
            toast.error("Đã xảy ra lỗi !!!");
        } else {
            this.setState({
                arrInfo: res,
                more_type: 'filter'
            })
        }
    }
    // thao tac
    deleteInfo = async (item) => {
        let warning = prompt("Bạn có chắc chắn muốn người dùng này ? Nhập YES để xác nhận hoặc bấm bất kì để hùy.", "");
        if (warning === "YES") {
            let newInfo = {
                table: 'user',
                type: 'delete',
                id: item.id,
            }
            let res = await adminDashboardService(newInfo);

            if (!res || res.err) {
                toast.error("Đã xảy ra lỗi !");
            } else {
                await this.getInfo();
                toast.success("Xóa thông tin thành công !");
            }
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
                <div className='right-box-content-admin-user-x'>
                    <div className='right-header'>
                        <div className='header-title'><FormattedMessage id="admin.userManage.title" /></div>

                        <div className='header-tool'>
                            <div className='tool-content'>
                                <b>UID:</b>
                                <div className='content-input'>
                                    <input className='filter-input id' type='text'
                                        value={this.state.id_filter}
                                        onChange={(event) => this.handleOnChangeInput(event, 'id_filter')}
                                    ></input>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <b><FormattedMessage id="admin.userManage.nameF" /></b>
                                <div className='content-input'>
                                    <input className='filter-input' type='text'
                                        value={this.state.name_filter}
                                        onChange={(event) => this.handleOnChangeInput(event, 'name_filter')}
                                    ></input>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <b><FormattedMessage id="admin.userManage.email" /></b>
                                <div className='content-input'>
                                    <input className='filter-input' type='text'
                                        value={this.state.email_filter}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email_filter')}
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className='header-tool'>
                            <div className='tool-content'>
                                <b><FormattedMessage id="admin.userManage.user" /></b>
                                <div className='content-select'>
                                    <select
                                        onChange={(event) => this.handleOnChangeInput(event, 'vip_filter')}
                                        value={this.state.vip_filter}
                                    >
                                        <FormattedMessage id="admin.userManage.all" >
                                            {(message) => <option value=''>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="admin.userManage.paid" >
                                            {(message) => <option value='PAID'>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="admin.userManage.free" >
                                            {(message) => <option value='FREE'>{message}</option>}
                                        </FormattedMessage>
                                    </select>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <b><FormattedMessage id="admin.userManage.type" /></b>
                                <div className='content-select'>
                                    <select
                                        onChange={(event) => this.handleOnChangeInput(event, 'roleid_filter')}
                                        value={this.state.roleid_filter}
                                    >
                                        <FormattedMessage id="admin.userManage.all" >
                                            {(message) => <option value=''>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="admin.userManage.accountUser" >
                                            {(message) => <option value='R2'>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="admin.userManage.accountAdmin" >
                                            {(message) => <option value='R1'>{message}</option>}
                                        </FormattedMessage>
                                    </select>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <b><FormattedMessage id="admin.userManage.active" /></b>
                                <div className='content-select'>
                                    <select
                                        onChange={(event) => this.handleOnChangeInput(event, 'active_filter')}
                                        value={this.state.active_filter}
                                    >
                                        <FormattedMessage id="admin.userManage.all" >
                                            {(message) => <option value=''>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="admin.userManage.on" >
                                            {(message) => <option value='ON'>{message}</option>}
                                        </FormattedMessage>
                                        <FormattedMessage id="admin.userManage.off" >
                                            {(message) => <option value='OFF'>{message}</option>}
                                        </FormattedMessage>
                                    </select>
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
                                <FormattedMessage id="admin.userManage.show" /> <b>{this.state.arrInfo.length}</b>/<b>{this.state.total}</b>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title id'>UID</td>
                                        <td className='table-title'><FormattedMessage id="admin.userManage.name" /></td>
                                        <td className='table-title'><FormattedMessage id="admin.userManage.email" /></td>
                                        <td className='table-title '><FormattedMessage id="admin.userManage.view" /></td>
                                        <td className='table-title center'><FormattedMessage id="admin.userManage.user" /></td>
                                        <td className='table-title center'><FormattedMessage id="admin.userManage.type" /></td>
                                        <td className='table-title center'><FormattedMessage id="admin.userManage.active" /></td>
                                        <td className='table-title center'><FormattedMessage id="admin.userManage.tool" /></td>
                                    </tr>
                                    {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                        return (
                                            <React.Fragment>
                                                <tr key={index}>
                                                    <td className='table-content id'>
                                                        {item.id}
                                                    </td>
                                                    <td className='table-content fix'>{item.name}</td>
                                                    <td className='table-content name'>{item.email}</td>
                                                    <td className='table-content fix'>{item.view}</td>
                                                    <td className='table-content center fix'>
                                                        {item.vip === 'PAID' ?
                                                            <React.Fragment>
                                                                <i class="fas fa-money-bill-alt"></i>
                                                            </React.Fragment>
                                                            : <React.Fragment>
                                                                <i class="fas fa-minus"></i>
                                                            </React.Fragment>
                                                        }
                                                    </td>
                                                    <td className='table-content center fix'>
                                                        {item.roleid === 'R2' ?
                                                            <React.Fragment>
                                                                <i class="fas fa-user"></i>
                                                            </React.Fragment>
                                                            : <React.Fragment>
                                                                <i class="fas fa-cogs"></i>
                                                            </React.Fragment>
                                                        }
                                                    </td>
                                                    <td className='table-content center fix'>
                                                        {item.active === 'ON' ?
                                                            <React.Fragment>
                                                                <i class="fas fa-circle active"></i>
                                                            </React.Fragment>
                                                            : <React.Fragment>
                                                                <i class="fas fa-circle lock"></i>
                                                            </React.Fragment>
                                                        }
                                                    </td>
                                                    <td className='table-content center fix'>
                                                        <i class="fas fa-info-circle" onClick={() => this.props.displayUser(item.id)}></i>
                                                        <i class="fas fa-trash-alt" onClick={() => this.deleteInfo(item)}></i>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className='show-more'>
                                <React.Fragment>
                                    <div className='pre' onClick={() => this.showMore('pre')}><i class="fas fa-minus"></i> <FormattedMessage id="info.pre" /></div>
                                    <div className='default' onClick={() => this.showMore('default')}><i class="fas fa-sync-alt"></i> <FormattedMessage id="info.default" /></div>
                                    <div className='next' onClick={() => this.showMore('next')}> <i class="fas fa-plus"></i> <FormattedMessage id="info.next" /></div>
                                    <div>
                                        <FormattedMessage id="info.totalShow" /> <b>{this.state.arrInfo.length}</b>/<b>{this.state.total}</b>
                                    </div>
                                </React.Fragment>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));
