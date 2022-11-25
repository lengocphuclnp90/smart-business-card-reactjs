import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './ListCustom.scss';
import { LANGUAGES, CURD_ACTIONS, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getListService } from '../../../../services/userService';
import { adminDashboardService } from '../../../../services/adminMenuService';

class ListCustom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrList: [],
            showForm: false,
            edit: false,
            image_preview: '',

            id: '',
            name: '',
            des: '',
            keyMap: '',
            image: '',
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
        }, () => {
            if (id === 'custom') {
                let arrList = this.state.arrList;
                for (let i = 0; i < arrList.length; i++) {
                    if (arrList[i].keyMap === this.state.custom) {
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
    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            console.log('base 64 test', base64);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                image_preview: objectUrl,
                image: base64
            })
        }
    }
    getList = async () => {
        let data = {
            type: 'custom'
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
                table: 'listCustom',
                type: 'new',
                name: this.state.name,
                des: this.state.des,
                keyMap: this.state.keyMap,
                image: this.state.image
            }
            let res = await adminDashboardService(newInfo);
            if (res && res.err) {
                if (res.err === 'EXIST') {
                    toast.error("Trùng khóa đại diện !");
                } else {
                    toast.error("Đã xảy ra lỗi !");
                }
            } else {
                await this.getList();
                toast.success("Thêm thông tin thành công !");
                this.setState({
                    showForm: false,
                })
            }
        } else if (type === 'update') {
            let newInfo = {
                table: 'listCustom',
                type: 'update',
                id: this.state.id,
                name: this.state.name,
                des: this.state.des,
                keyMap: this.state.keyMap,
                image: this.state.image
            }
            let res = await adminDashboardService(newInfo);
            if (res && res.err) {
                if (res.err === 'EXIST') {
                    toast.error("Trùng khóa đại diện !");
                } else {
                    toast.error("Đã xảy ra lỗi !");
                }
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
            table: 'listCustom',
            type: 'delete',
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
            des: '',
            keyMap: '',
            image: '',
            image_preview: '',
            showForm: true,
            edit: false,
        })
    }
    openFromData = (item) => {
        let imageBase64 = '';
        if (item.image) {
            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
        }
        this.setState({
            image: imageBase64
        })
        this.setState({
            id: item.id,
            name: item.name,
            des: item.des,
            keyMap: item.keyMap,
            image_preview: imageBase64,
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
                        <div className='form-info-list' id='form-info' onClick={(event) => this.hideForm(event)}>
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
                                            Ảnh đại diện
                                        </div>
                                        <div className='container-input'>
                                            <div className='upload-file'>
                                                <div>
                                                    <input id="upload-img" type="file" hidden
                                                        onChange={(event) => this.handleOnchangeImage(event)}
                                                    />
                                                    <label className="lable-upload" htmlFor="upload-img">Tải ảnh lên <i className="fa fa-upload" aria-hidden="true"></i></label>
                                                </div>
                                                {this.state.image_preview && <img src={this.state.image_preview}></img>}
                                            </div>
                                        </div>

                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            Tên hiển thị
                                        </div>
                                        <div className='container-input'>
                                            <input onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                                value={this.state.name}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            Mô tả
                                        </div>
                                        <div className='container-input'>
                                            <input onChange={(event) => this.handleOnChangeInput(event, 'des')}
                                                value={this.state.des}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='form-sub-container'>
                                        <div className='container-tile'>
                                            Khóa đại diện
                                        </div>
                                        <div className='container-input'>
                                            <input onChange={(event) => this.handleOnChangeInput(event, 'keyMap')}
                                                value={this.state.keyMap}
                                            ></input>
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
                <div className='right-box-content-list'>
                    <div className='right-header'>
                        <div className='right-table-title'>Danh Sách Loại Thông Tin Tùy Chỉnh</div>
                        <div className='right-btn-new' onClick={() => this.openFromClear()}>Thêm mới<i class="fas fa-plus"></i></div>
                    </div>
                    <div className='right-body'>
                        <div className='body-table-content'>
                            <div>
                                Hiện có: <b>{this.state.arrList.length}</b>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title'></td>
                                        <td className='table-title'>Loại thông tin</td>
                                        <td className='table-title'>Mô tả</td>
                                        <td className='table-title'>Khóa đại diện</td>
                                        <td className='table-title center'>Thao tác</td>
                                    </tr>
                                    {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.image) {
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                        }
                                        return (
                                            <React.Fragment>
                                                <tr key={index}>
                                                    <td className='table-content img'>
                                                        <img src={imageBase64}></img>
                                                    </td>
                                                    <td className='table-content fix'>{item.name}</td>
                                                    <td className='table-content name'>{item.des}</td>
                                                    <td className='table-content name'>{item.keyMap}</td>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListCustom));
