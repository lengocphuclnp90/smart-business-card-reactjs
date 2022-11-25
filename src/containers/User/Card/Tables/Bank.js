import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Bank.scss';
import './BankMobile.scss';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getListService } from '../../../../services/userService';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { FormattedMessage } from 'react-intl';
class Bank extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrInfo: [],
            arrList: [],
            arrItem: [],
            showForm: false,
            edit: false,

            id: '',
            bank: '',
            name: '',
            number: '',
            hide: 'OFF',

            cardId: '',
            cardImage: '',
            isOpen: false,
        }
    }
    async componentDidMount() {
        await this.getInfo();
        await this.getList();
        await this.getItem();
        await this.mapInfo();
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
                Cookies.set('cardChoose', event.target.value, {
                    expires: 999
                });
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
            await this.getItem();
            await this.mapInfo();
        })
    }
    getInfo = async () => {
        let newInfo = {
            table: 'bank',
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
        }
    }

    getList = async () => {
        let newInfo = {
            table: 'card',
            type: 'get',
            user: this.props.userInfo.id,
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
            if (Cookies.get('cardChoose')) {
                let arrList = res;
                for (let i = 0; i < arrList.length; i++) {
                    if (`${arrList[i].id}` === Cookies.get('cardChoose')) {
                        let imageBase64 = '';
                        if (arrList[i].image) {
                            imageBase64 = new Buffer(arrList[i].image, 'base64').toString('binary');
                        }
                        this.setState({
                            cardImage: imageBase64,
                            cardId: Cookies.get('cardChoose')
                        })
                    }
                }
                this.setState({
                    arrList: res
                })
            } else {
                let imageBase64 = '';
                if (res[0].image) {
                    imageBase64 = new Buffer(res[0].image, 'base64').toString('binary');
                }
                this.setState({
                    cardImage: imageBase64,
                    cardId: res[0].id,
                    arrList: res
                })
            }
        }
    }

    getItem = async () => {
        let newInfo = {
            table: 'item',
            type: 'get',
            typeInfo: 'bank',
            card: this.state.cardId,
            user: this.props.userInfo.id,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            if (res.err === 'NOT') {
                this.setState({
                    arrItem: {}
                })
            } else {
                toast.error("Server trả về mã lỗi !");
            }
        } else {
            this.setState({
                arrItem: res
            })
        }
    }
    // thao tac
    deleteItem = async (itemId) => {
        let newInfo = {
            user: this.props.userInfo.id, // dư thừa, để vô cho bên kia check đủ biến, xài chung
            table: 'item',
            type: 'delete',
            id: itemId,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            toast.error("Server trả về mã lỗi !");
        } else {
            await this.getItem();
            await this.mapInfo();
            // toast.success("Cập nhật thành công !");
        }
    }
    newItem = async (id) => {
        let newInfo = {
            user: this.props.userInfo.id, // dư thừa, để vô cho bên kia check đủ biến, xài chung
            table: 'item',
            type: 'new',
            card: this.state.cardId,
            info: id,
            infoType: 'bank',
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            toast.error("Server trả về mã lỗi !");
        } else {
            await this.getItem();
            await this.mapInfo();
            // toast.success("Cập nhật thành công !");
        }
    }
    mapInfo = () => {
        let arrInfo = this.state.arrInfo;
        let arrItem = this.state.arrItem;
        for (let i = 0; i < arrInfo.length; i++) {
            arrInfo[i].show = false;
            arrInfo[i].itemId = 'NULL';
            for (let j = 0; j < arrItem.length; j++) {
                if (arrInfo[i].id === arrItem[j].info) {
                    arrInfo[i].show = true;
                    arrInfo[i].itemId = arrItem[j].id;
                }
            }
        }
        console.log(arrInfo);
        this.setState({
            arrInfo: arrInfo,
        })
        return true;
    }
    // hien an form
    render() {
        let arrInfo = this.state.arrInfo;
        let arrList = this.state.arrList;
        return (
            <React.Fragment>
                <div className='right-box-content-mobile'>
                    <div className='right-header'>
                        <div className='right-select-card'>
                            {arrList && arrList.length > 0 &&
                                <React.Fragment>
                                    <select
                                        value={this.state.cardId}
                                        onChange={(event) => this.handleOnChangeInput(event, 'cardId')}
                                    >
                                        {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                            return (
                                                <React.Fragment>
                                                    <option key={item.index} value={item.id}>{item.name}</option>
                                                </React.Fragment>
                                            )
                                        })}
                                    </select>
                                    <img src={this.state.cardImage} onClick={() => this.setState({ isOpen: true })}></img>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                    <div className='right-body'>
                        {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                            let imageBase64 = '';
                            if (item.data.image) {
                                imageBase64 = new Buffer(item.data.image, 'base64').toString('binary');
                            }
                            return (
                                <React.Fragment>
                                    <div className='info-content'>
                                        <div className='title-type'>
                                            <img src={imageBase64}></img>
                                            <b>{item.data.name}</b>
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.account" />:</b>
                                            {item.name}
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.accountNumber" />:</b>
                                            {item.number}
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.viewNumber" />:</b>
                                            {item.view}
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="info.state" />:</b>
                                            {item.show === true ?
                                                <React.Fragment>
                                                    <i class="fas fa-eye" onClick={() => this.deleteItem(item.itemId)}></i>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <i class="fas fa-eye-slash" onClick={() => this.newItem(item.id)}></i>
                                                </React.Fragment>
                                            }
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className='right-box-content'>
                    <div className='right-header'>
                        <div className='right-table-title'>
                            <FormattedMessage id="info.bank" />
                        </div>
                        <div className='right-select-card'>
                            {arrList && arrList.length > 0 &&
                                <React.Fragment>
                                    <select
                                        value={this.state.cardId}
                                        onChange={(event) => this.handleOnChangeInput(event, 'cardId')}
                                    >
                                        {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                            return (
                                                <React.Fragment>
                                                    <option key={item.index} value={item.id}>{item.name}</option>
                                                </React.Fragment>
                                            )
                                        })}
                                    </select>
                                    <img src={this.state.cardImage} onClick={() => this.setState({ isOpen: true })}></img>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                    <div className='right-body'>
                        <div className='body-table-content'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title'></td>
                                        <td className='table-title'><FormattedMessage id="info.bank" /></td>
                                        <td className='table-title'><FormattedMessage id="info.account" /></td>
                                        <td className='table-title'><FormattedMessage id="info.accountNumber" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.infoView" /></td>
                                        <td className='table-title center'><FormattedMessage id="info.status" /></td>
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
                                                        <img src={imageBase64} ></img>
                                                    </td>
                                                    <td className='table-content fix'>{item.data.name}</td>
                                                    <td className='table-content name'>{item.name}</td>
                                                    <td className='table-content fix'>{item.number}</td>
                                                    <td className='table-content center fix'>{item.view}</td>
                                                    <td className='table-content center fix'>
                                                        {item.show === true ?
                                                            <React.Fragment>
                                                                <i class="fas fa-eye" onClick={() => this.deleteItem(item.itemId)}></i>
                                                            </React.Fragment> :
                                                            <React.Fragment>
                                                                <i class="fas fa-eye-slash" onClick={() => this.newItem(item.id)}></i>
                                                            </React.Fragment>
                                                        }
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
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.cardImage}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bank));
