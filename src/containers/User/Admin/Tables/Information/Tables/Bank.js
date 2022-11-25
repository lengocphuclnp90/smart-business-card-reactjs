import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Bank.scss';

import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getListService } from '../../../../../../services/userService';

class Bank extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrInfo: [],
            arrList: [],
            showForm: false,
            edit: false,
            image: '',

            id: '',
            bank: '',
            name: '',
            number: '',
            hide: 'OFF',
        }
    }
    componentDidMount() {
        this.getInfo();
        this.getList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            if (id === 'bank') {
                let arrList = this.state.arrList;
                for (let i = 0; i < arrList.length; i++) {
                    if (arrList[i].keyMap === this.state.bank) {
                        let imageBase64 = '';
                        if (arrList[i].image) {
                            imageBase64 = new Buffer(arrList[i].image, 'base64').toString('binary');
                        }
                        this.setState({
                            image: imageBase64
                        })
                    }
                }
            }
        })
    }
    getInfo = async () => {
        let newInfo = {
            table: 'bank',
            type: 'get',
            user: this.props.id,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            if (res.err === 'NOT') {

            } else {
                toast.error("Server trả về mã lỗi !");
            }
        } else {
            this.setState({
                arrInfo: res
            })
            // đếm thông tin gửi cho component cha
            let number = this.state.arrInfo.length;
            let show = 0;
            let view = 0;
            for (let i = 0; i < number; i++) {
                if (this.state.arrInfo[i].hide === 'OFF') {
                    show++
                }
                view = view + this.state.arrInfo[i].view;
            }
            this.props.checkView(number, show, view);
        }
    }
    getList = async () => {
        let data = {
            type: 'bank'
        };
        let res = await getListService(data);
        if (res) {
            let imageBase64 = '';
            if (res[0].image) {
                imageBase64 = new Buffer(res[0].image, 'base64').toString('binary');
            }
            this.setState({
                image: imageBase64
            })
            this.setState({
                arrList: res,
                bank: res[0].keyMap,
            })
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
            table: 'bank',
            type: 'update',
            id: item.id,
            user: item.user,
            bank: item.bank,
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
                table: 'bank',
                type: 'new',
                user: this.props.id,
                bank: this.state.bank,
                name: this.state.name,
                number: this.state.number,
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
                table: 'bank',
                type: 'update',
                id: this.state.id,
                user: this.props.id,
                bank: this.state.bank,
                name: this.state.name,
                number: this.state.number,
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
            table: 'bank',
            type: 'delete',
            id: item.id,
            user: this.props.id,
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
        let arrList = this.state.arrList;
        let imageBase64 = '';
        if (arrList[0].image) {
            imageBase64 = new Buffer(arrList[0].image, 'base64').toString('binary');
        }
        this.setState({
            name: '',
            number: '',
            hide: 'OFF',
            bank: arrList[0].keyMap,
            image: imageBase64,
            showForm: true,
            edit: false,
        })
    }
    openFromData = (item) => {
        let arrList = this.state.arrList;
        for (let i = 0; i < arrList.length; i++) {
            if (arrList[i].keyMap === item.bank) {
                let imageBase64 = '';
                if (arrList[i].image) {
                    imageBase64 = new Buffer(arrList[i].image, 'base64').toString('binary');
                }
                this.setState({
                    image: imageBase64
                })
            }
        }
        this.setState({
            id: item.id,
            name: item.name,
            number: item.number,
            hide: item.hide,
            bank: item.bank,
            showForm: true,
            edit: true,
        })
    }
    render() {
        let arrInfo = this.state.arrInfo;
        let arrList = this.state.arrList;

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
                                            <div className='form-title'>Cập nhật thông tin</div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='form-title'>Thêm thông tin mới</div>
                                        </React.Fragment>
                                    }
                                    <div className='form-close' onClick={() => { this.setState({ showForm: false }) }}><i class="fas fa-times"></i></div>
                                </div>
                                <div className='body-form'>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            Kênh thanh toán
                                        </div>
                                        <div className='container-input'>
                                            <div className='choose'>
                                                <select
                                                    onChange={(event) => this.handleOnChangeInput(event, 'bank')}
                                                    value={this.state.bank}
                                                >
                                                    {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                                        let imageBase64 = '';
                                                        if (item.image) {
                                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                                        }
                                                        return (
                                                            <option key={index}
                                                                value={item.keyMap}
                                                            >{item.name}</option>
                                                        )
                                                    })}
                                                </select>
                                                <img src={this.state.image}></img>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            Tên tài khoản
                                        </div>
                                        <div className='container-input'>
                                            <input onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                                value={this.state.name}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            Số tài khoản
                                        </div>
                                        <div className='container-input'>
                                            <input onChange={(event) => this.handleOnChangeInput(event, 'number')}
                                                value={this.state.number}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            Trạng thái
                                        </div>
                                        <div className='container-input'>
                                            <div className='opt'>
                                                <i class={this.state.hide === 'OFF' ? 'fas fa-eye active' : 'fas fa-eye'}
                                                    onClick={() => { this.setState({ hide: 'OFF' }) }}
                                                > Hiển thị</i>
                                                <i class={this.state.hide === 'ON' ? 'fas fa-eye-slash active' : 'fas fa-eye-slash'}
                                                    onClick={() => { this.setState({ hide: 'ON' }) }}
                                                > Ẩn</i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='submit-form'>
                                    {this.state.edit === true ?
                                        <React.Fragment>
                                            <div className='btn-save' onClick={() => this.saveInfo('update')}>Cập nhật</div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className='btn-save' onClick={() => this.saveInfo('new')}>Lưu lại</div>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                <div className='right-box-content'>
                    <div className='right-header'>
                        <div className='right-table-title'>Chuyển, nhận tiền</div>
                        <div className='right-btn-new' onClick={() => this.openFromClear()}>Thêm mới<i class="fas fa-plus"></i></div>
                    </div>
                    <div className='right-body'>
                        <div className='body-table-content'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title'></td>
                                        <td className='table-title'>Kênh thanh toán</td>
                                        <td className='table-title'>Tên tài khoản</td>
                                        <td className='table-title'>Số tài khoản</td>
                                        <td className='table-title center'>Lượt truy cập</td>
                                        <td className='table-title center'>Tình trạng</td>
                                        <td className='table-title center'>Thao tác</td>
                                    </tr>
                                    {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.data.image) {
                                            imageBase64 = new Buffer(item.data.image, 'base64').toString('binary');
                                        }
                                        return (
                                            <React.Fragment>
                                                <tr key={index}>
                                                    <td className='table-content img'>
                                                        <img src={imageBase64}></img>
                                                    </td>
                                                    <td className='table-content fix'>{item.data.name}</td>
                                                    <td className='table-content name'>{item.name}</td>
                                                    <td className='table-content fix'>{item.number}</td>
                                                    <td className='table-content center fix'>{item.view}</td>
                                                    <td className='table-content center fix'>
                                                        {item.hide === 'ON' ?
                                                            <React.Fragment>
                                                                <i class="fas fa-eye-slash" onClick={() => this.hideInfo(item)}></i>
                                                            </React.Fragment>
                                                            : <React.Fragment>
                                                                <i class="fas fa-eye" onClick={() => this.hideInfo(item)}></i>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bank));
