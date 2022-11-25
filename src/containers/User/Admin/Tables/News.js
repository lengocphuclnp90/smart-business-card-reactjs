import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './News.scss';
import { LANGUAGES, CURD_ACTIONS, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getListService } from '../../../../services/userService';
import { adminDashboardService } from '../../../../services/adminMenuService';
import { FormattedMessage } from 'react-intl';
class News extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrList: [],
            showForm: false,
            edit: false,

            id: '',
            type: '',
            contentEn: '',
            contentVi: '',
            hide: '',
        }
    }
    componentDidMount() {
        this.getList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    getList = async () => {
        let data = {
            type: 'news'
        };
        let res = await getListService(data);
        if (res) {
            this.setState({
                arrList: res,
            })
        }
    }
    // thao tac
    saveInfo = async (type) => {
        if (type === 'new') {
            let newInfo = {
                table: 'news', // biến này khai báo cho có, để xài chung service
                type: 'news',
                action: 'new',
                newsType: this.state.type,
                contentEn: this.state.contentEn,
                contentVi: this.state.contentVi,
                hide: this.state.hide,
            }
            let res = await adminDashboardService(newInfo);
            if (res && res.err) {
                toast.error("Đã xảy ra lỗi !");
            } else {
                await this.getList();
                toast.success("Thêm thông tin thành công !");
                this.setState({
                    showForm: false,
                })
            }
        } else if (type === 'update') {
            let newInfo = {
                table: 'news', // biến này khai báo cho có, để xài chung service
                id: this.state.id,
                type: 'news',
                action: 'update',
                newsType: this.state.type,
                contentEn: this.state.contentEn,
                contentVi: this.state.contentVi,
                hide: this.state.hide,
            }
            let res = await adminDashboardService(newInfo);
            if (res && res.err) {
                toast.error("Đã xảy ra lỗi !");
            } else {
                await this.getList();
                toast.success("Cập nhật thông tin thành công !");
                this.setState({
                    showForm: false,
                })
            }
        }

    }
    deleteInfo = async (item) => {
        let newInfo = {
            table: 'news', // thêm vô cho có để đủ biến dùng chung service
            type: 'news',
            action: 'delete',
            id: item.id,
        }
        let res = await adminDashboardService(newInfo);
        if (res && res.err) {
            toast.error("Đã xảy ra lỗi !");
        } else {
            await this.getList();
            toast.success("Xoa thông tin thành công !");
            this.setState({
                showForm: false,
            })
        }
    }
    hideInfo = async (id, hide) => {
        let newInfo = {
            table: 'news', // thêm vô cho có để đủ biến dùng chung service
            type: 'news',
            action: 'hide',
            hide: hide,
            id: id,
        }
        let res = await adminDashboardService(newInfo);
        if (res && res.err) {
            toast.error("Đã xảy ra lỗi !");
        } else {
            await this.getList();
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
    openFromClear = () => {
        this.setState({
            type: 'N1',
            contentEn: '',
            contentVi: '',
            hide: 'OFF',
            showForm: true,
            edit: false,
        })
    }
    openFromData = (item) => {
        this.setState({
            id: item.id,
            type: item.type,
            contentEn: item.contentEn,
            contentVi: item.contentVi,
            hide: item.hide,
            showForm: true,
            edit: true,
        })
    }
    render() {
        let arrList = this.state.arrList;
        let showForm = this.state.showForm;
        return (
            <React.Fragment>
                {showForm === true &&
                    <React.Fragment>
                        <div className='form-info-list-news' id='form-info' onClick={(event) => this.hideForm(event)}>
                            <div className='form-info-content'>
                                <div className='header-form'>
                                    {this.state.edit === true ?
                                        <React.Fragment>
                                            <div className='form-title'><FormattedMessage id="admin.newsManage.update" /></div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='form-title'><FormattedMessage id="admin.newsManage.new" /></div>
                                        </React.Fragment>
                                    }
                                    <div className='form-close' onClick={() => { this.setState({ showForm: false }) }}><i class="fas fa-times"></i></div>
                                </div>
                                <div className='body-form'>
                                    <div className='form-sub-container'>
                                        <div className='container-title'>
                                            <FormattedMessage id="admin.newsManage.type" />
                                        </div>
                                        <div className='container-input'>
                                            <select value={this.state.type}
                                                onChange={(event) => this.handleOnChangeInput(event, 'type')}
                                            >
                                                <FormattedMessage id="admin.newsManage.N1" >
                                                    {(message) => <option value='N1'>{message}</option>}
                                                </FormattedMessage>
                                                <FormattedMessage id="admin.newsManage.N2" >
                                                    {(message) => <option value='N2'>{message}</option>}
                                                </FormattedMessage>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-title'>
                                            <FormattedMessage id="admin.newsManage.state" />
                                        </div>
                                        <div className='container-input'>
                                            <select value={this.state.hide}
                                                onChange={(event) => this.handleOnChangeInput(event, 'hide')}
                                            >
                                                <FormattedMessage id="admin.newsManage.off" >
                                                    {(message) => <option value='OFF'>{message}</option>}
                                                </FormattedMessage>
                                                <FormattedMessage id="admin.newsManage.on" >
                                                    {(message) => <option value='ON'>{message}</option>}
                                                </FormattedMessage>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-title'>
                                            <FormattedMessage id="admin.newsManage.vi" />
                                        </div>
                                        <div className='container-input'>
                                            <textarea rows='6'
                                                onChange={(event) => this.handleOnChangeInput(event, 'contentVi')}
                                                value={this.state.contentVi}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-title'>
                                            <FormattedMessage id="admin.newsManage.en" />
                                        </div>
                                        <div className='container-input'>
                                            <textarea rows='6'
                                                onChange={(event) => this.handleOnChangeInput(event, 'contentEn')}
                                                value={this.state.contentEn}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className='submit-form'>
                                    {this.state.edit === true ?
                                        <React.Fragment>
                                            <div className='btn-save' onClick={() => this.saveInfo('update')}><FormattedMessage id="admin.newsManage.btn-update" /></div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='btn-save' onClick={() => this.saveInfo('new')}><FormattedMessage id="admin.newsManage.new" /></div>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                <div className='right-box-content-list'>
                    <div className='right-header'>
                        <div className='right-table-title'><FormattedMessage id="admin.newsManage.title" /></div>
                        <div className='right-btn-new' onClick={() => this.openFromClear()}><FormattedMessage id="admin.newsManage.add" /><i class="fas fa-plus"></i></div>
                    </div>
                    <div className='right-body'>
                        <div className='body-table-content'>
                            <div>
                                <FormattedMessage id="admin.newsManage.have" /> <b>{this.state.arrList.length}</b>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title'><FormattedMessage id="admin.newsManage.type" /></td>
                                        <td className='table-title'><FormattedMessage id="admin.newsManage.content" /></td>
                                        <td className='table-title center'><FormattedMessage id="admin.newsManage.state" /></td>
                                        <td className='table-title center'><FormattedMessage id="admin.newsManage.tool" /></td>
                                    </tr>
                                    {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                        return (
                                            <React.Fragment>
                                                <tr key={index}>
                                                    {item.type === 'N1' ?
                                                        <React.Fragment>
                                                            <td className='table-content fix'><FormattedMessage id="admin.newsManage.N1" /></td>
                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                            <td className='table-content fix'><FormattedMessage id="admin.newsManage.N2" /></td>
                                                        </React.Fragment>
                                                    }
                                                    <td className='table-content name'>
                                                        {this.props.language === 'vi' ?
                                                            <React.Fragment>
                                                                {item.contentVi}
                                                            </React.Fragment> :
                                                            <React.Fragment>
                                                                {item.contentEn}
                                                            </React.Fragment>
                                                        }
                                                    </td>
                                                    <td className='table-content center'>
                                                        {item.hide === 'ON' ?
                                                            <React.Fragment>
                                                                <i class="fas fa-eye-slash"
                                                                    onClick={() => this.hideInfo(item.id, 'OFF')}
                                                                ></i>
                                                            </React.Fragment>
                                                            : <React.Fragment>
                                                                <i class="fas fa-eye"
                                                                    onClick={() => this.hideInfo(item.id, 'ON')}
                                                                ></i>
                                                            </React.Fragment>
                                                        }
                                                    </td>
                                                    <td className='table-content center fix'>
                                                        <i class="fas fa-pencil-alt" onClick={() => this.openFromData(item)}></i>
                                                        <i class="fas fa-trash-alt" onClick={() => this.deleteInfo(item)}></i>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
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
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(News));
