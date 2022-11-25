import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Location.scss';
import { FormattedMessage } from 'react-intl';
import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getListService } from '../../../../services/userService';

class Location extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrInfo: [],
            showForm: false,
            edit: false,

            id: '',
            name: '',
            link: '',
            hide: 'OFF',
        }
    }
    componentDidMount() {
        this.getInfo();
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
    getInfo = async () => {
        let newInfo = {
            table: 'location',
            type: 'get',
            user: this.props.userInfo.id,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            if (res.err === 'NOT') {

                this.setState({
                    arrInfo: {}
                })
            } else {
                toast.error("Server trả về mã lỗi !");
            }
        } else {
            this.setState({
                arrInfo: res
            })
            // đếm thông tin gửi cho component cha
            let link = this.state.arrInfo.length;
            let show = 0;
            let view = 0;
            for (let i = 0; i < link; i++) {
                if (this.state.arrInfo[i].hide === 'OFF') {
                    show++
                }
                view = view + this.state.arrInfo[i].view;
            }
            this.props.checkView(link, show, view);
        }
    }
    // thao tac
    hideInfo = async (item) => {
        if (item.hide === 'ON') {
            item.hide = 'OFF'
        } else {
            item.hide = 'ON'
        }
        let newInfo = {
            table: 'location',
            type: 'update',
            id: item.id,
            user: item.user,
            link: item.link,
            name: item.name,
            hide: item.hide,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err === 'OK') {
            await this.getInfo();
            // toast.success("Cập nhật thành công !");
        } else {
            toast.success("Đã xảy ra lỗi !");
        }
    }
    saveInfo = async (type) => {
        if (type === 'new') {
            let newInfo = {
                table: 'location',
                type: 'new',
                user: this.props.userInfo.id,
                name: this.state.name,
                link: this.state.link,
                hide: this.state.hide
            }
            let res = await updateInfoService(newInfo);
            if (res && res.err) {
                toast.error("Đã xảy ra lỗi !");
            } else {
                await this.getInfo();
                toast.success("Thêm thông tin thành công !");
                this.setState({
                    showForm: false,
                })
            }
        } else if (type === 'update') {
            let newInfo = {
                table: 'location',
                type: 'update',
                id: this.state.id,
                user: this.props.userInfo.id,
                name: this.state.name,
                link: this.state.link,
                hide: this.state.hide,
            }
            let res = await updateInfoService(newInfo);
            if (res && res.err === 'OK') {
                await this.getInfo();
                toast.success("Cập nhật thành công !");
                this.setState({
                    showForm: false,
                    edit: false
                })
            } else {
                toast.success("Đã xảy ra lỗi !");
            }
        }

    }
    deleteInfo = async (item) => {
        let newInfo = {
            table: 'location',
            type: 'delete',
            id: item.id,
            user: this.props.userInfo.id,
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
    openFromClear = () => {
        this.setState({
            name: '',
            link: '',
            hide: 'OFF',
            showForm: true,
            edit: false,
        })
    }
    openFromData = (item) => {
        this.setState({
            id: item.id,
            name: item.name,
            hide: item.hide,
            link: item.link,
            showForm: true,
            edit: true,
        })
    }
    render() {
        let arrInfo = this.state.arrInfo;
        let showForm = this.state.showForm;
        return (
            <React.Fragment>
                {showForm === true &&
                    <React.Fragment>
                        <div className='form-info' id='form-info' onClick={(event) => this.hideForm(event)}>
                            <div className='form-info-content'>
                                <div className='header-form'>
                                    {this.state.edit === true ?
                                        <React.Fragment>
                                            <div className='form-title'><FormattedMessage id="info.update" /></div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='form-title'><FormattedMessage id="info.new" /></div>
                                        </React.Fragment>
                                    }
                                    <div className='form-close' onClick={() => { this.setState({ showForm: false }) }}><i class="fas fa-times"></i></div>
                                </div>
                                <div className='body-form'>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            <FormattedMessage id="info.name" />
                                        </div>
                                        <div className='container-input'>
                                            <input onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                                value={this.state.name}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            <FormattedMessage id="info.link" />
                                        </div>
                                        <div className='container-input'>
                                            <input onChange={(event) => this.handleOnChangeInput(event, 'link')}
                                                value={this.state.link} type='link'
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            <FormattedMessage id="info.state" />
                                        </div>
                                        <div className='container-input'>
                                            <div className='opt'>
                                                <i class={this.state.hide === 'OFF' ? 'fas fa-eye active' : 'fas fa-eye'}
                                                    onClick={() => { this.setState({ hide: 'OFF' }) }}
                                                > <FormattedMessage id="info.on" /></i>
                                                <i class={this.state.hide === 'ON' ? 'fas fa-eye-slash active' : 'fas fa-eye-slash'}
                                                    onClick={() => { this.setState({ hide: 'ON' }) }}
                                                > <FormattedMessage id="info.off" /></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='submit-form'>
                                    {this.state.edit === true ?
                                        <React.Fragment>
                                            <div className='btn-save' onClick={() => this.saveInfo('update')}><FormattedMessage id="info.btn-update" /></div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='btn-save' onClick={() => this.saveInfo('new')}><FormattedMessage id="info.btn-save" /></div>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                <div className='right-box-content-mobile'>
                    <div className='right-header'>
                        <div className='right-table-title'><FormattedMessage id="info.bank" /></div>
                        <div className='right-btn-new' onClick={() => this.openFromClear()}><FormattedMessage id="info.add" /><i class="fas fa-plus"></i></div>
                    </div>
                    <div className='right-body'>
                        {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                            return (
                                <React.Fragment>
                                    <div className='info-content'>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.name" />:</b>
                                            {item.name}
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.email" />:</b>
                                            <a href={item.link} target='_blank'
                                            ><FormattedMessage id="info.open" /> <i class="fas fa-external-link-alt"></i></a>
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.viewNumber" />:</b>
                                            {item.view}
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.state" />:</b>
                                            {item.hide === 'ON' ?
                                                <React.Fragment>
                                                    <i class="fas fa-eye-slash" onClick={() => this.hideInfo(item)}></i>
                                                </React.Fragment>
                                                : <React.Fragment>
                                                    <i class="fas fa-eye" onClick={() => this.hideInfo(item)}></i>
                                                </React.Fragment>
                                            }
                                        </div>
                                        <div className='info-content-tool'>
                                            <div className='tool-content'
                                                onClick={() => this.openFromData(item)}
                                            >Chỉnh sửa</div>
                                            <div className='tool-content'
                                                onClick={() => this.deleteInfo(item)}
                                            >Xóa</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className='right-box-content'>
                    <div className='right-header'>
                        <div className='right-table-title'><FormattedMessage id="info.location" /></div>
                        <div className='right-btn-new' onClick={() => this.openFromClear()}><FormattedMessage id="info.add" /><i class="fas fa-plus"></i></div>
                    </div>
                    <div className='right-body'>
                        <div className='body-table-content'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title'></td>
                                        <td className='table-title'><FormattedMessage id="info.name" /></td>
                                        <td className='table-title'><FormattedMessage id="info.link" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.viewNumber" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.sate" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.tool" /></td>
                                    </tr>
                                    {arrInfo && arrInfo.length > 0 ?
                                        <React.Fragment>
                                            {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                                return (
                                                    <React.Fragment>
                                                        <tr key={index}>
                                                            <td className='table-content icon'>
                                                                <i class="fas fa-map-marker-alt"></i>
                                                            </td>
                                                            <td className='table-content name'>{item.name}</td>
                                                            <td className='table-content fix'>
                                                                <a href={item.link} target='_blank'
                                                                ><FormattedMessage id="info.open" /> <i class="fas fa-external-link-alt"></i></a>
                                                            </td>
                                                            <td className='table-content center fix'>{item.view}</td>
                                                            <td className='table-content center fix'>
                                                                {item.hide === 'ON' ?
                                                                    <React.Fragment>
                                                                        <i className="fas fa-eye-slash" onClick={() => this.hideInfo(item)}></i>
                                                                    </React.Fragment>
                                                                    : <React.Fragment>
                                                                        <i className="fas fa-eye" onClick={() => this.hideInfo(item)}></i>
                                                                    </React.Fragment>
                                                                }

                                                            </td>
                                                            <td className='table-content center fix'>
                                                                <i className="fas fa-pencil-alt" onClick={() => this.openFromData(item)}></i>
                                                                <i className="fas fa-trash-alt" onClick={() => this.deleteInfo(item)}></i>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                );

                                            })}
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <tr>
                                                <td colSpan='6'><FormattedMessage id="info.notInfo" /></td>
                                            </tr>
                                        </React.Fragment>
                                    }

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
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Location));
