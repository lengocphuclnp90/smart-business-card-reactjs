import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Viewer.scss';
import { LANGUAGES, CommonUtils, path } from "../../../../../../utils";
import { toast } from "react-toastify";
import _ from 'lodash';
import { getViewer } from "../../../../../../services/userService";

class Viewer extends Component {

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
        let total = await getViewer(data);
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
        let res = await getViewer(data);
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
            toast.success("B???n ch??a c?? l?????t xem n??o !");
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
        let res = await getViewer(data);
        if (!res || res.err === 'NOT') {
            toast.success("Kh??ng t??m th???y th??ng tin h???p l??? !");
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
        let res = await getViewer(data);
        if (res.err) {
            toast.error("???? x???y ra l???i !!!");
        } else {
            await this.getInfo();
        }
    }
    deleteAll = async () => {
        let warning = prompt("B???n c?? ch???c ch???n mu???n x??a h???t t???t c??? ? Nh???p YES ????? x??c nh???n ho???c b???m b???t k?? ????? h??y.", "");
        if (warning === "YES") {
            let data = {
                type: 'delete-all',
                user: this.props.id,
            }
            let res = await getViewer(data);
            if (res.err) {
                toast.error("???? x???y ra l???i !!!");
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
                <div className='viewer'>
                    <div className='viewer-header'>
                        <div className='viewer-title'>
                            <i class="fas fa-arrow-circle-left"
                                onClick={() => this.props.showUserInfo()}
                            ></i>
                            Nh???ng Ng?????i ???? Xem Th??ng Tin C???a T??i Kho???n N??y
                        </div>
                        <div className='viewer-tool'>
                            <div className='tool-content'>
                                <div className='vtitle'>Ng?????i d??ng</div>
                                <div className='vinput'>
                                    <select
                                        onChange={(event) => this.handleOnChangeInput(event, 'link_filter')}
                                        value={this.state.link_filter}
                                    >
                                        <option value=''>T???t c???</option>
                                        <option value='user'>C?? t??i kho???n</option>
                                        <option value='hide'>???n danh</option>
                                    </select>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <div className='vtitle'>Lo???i th??ng tin</div>
                                <div className='vinput'>
                                    <select
                                        onChange={(event) => this.handleOnChangeInput(event, 'type_filter')}
                                        value={this.state.type_filter}
                                    >
                                        <option value=''>T???t c???</option>
                                        <option value='profile'>Trang c?? nh??n</option>
                                        <option value='card'>Danh thi???p</option>
                                    </select>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <div className='vtitle'>T??n ng?????i xem</div>
                                <div className='vinput'>
                                    <input onChange={(event) => this.handleOnChangeInput(event, 'vname_filter')}
                                        value={this.state.vname_filter} ></input>
                                </div>
                            </div>
                            <div className='tool-content'>
                                <div className='vsubmit' title='T??m ki???m'
                                    onClick={() => this.filter()}
                                ><i class="fas fa-search"></i></div>
                                <div className='vrefect' title='L??m m???i'
                                    onClick={() => this.getInfo()}
                                ><i class="fas fa-undo"></i></div>
                                <div className='vdelete' title='X??a t???t c???'
                                    onClick={() => this.deleteAll()}
                                ><i class="fas fa-trash-alt"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className='viewer-body'>
                        <div>
                            ??ang hi???n th???: <b>{showNumber}</b>/<b>{this.state.total}</b>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='table-title'>Th???i gian</td>
                                    <td className='table-title'>Ng?????i xem</td>
                                    <td className='table-title'>Email</td>
                                    <td className='table-title center'>Lo???i th??ng tin</td>
                                    <td className='table-title center'>Thao t??c</td>
                                </tr>
                                {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><i class="fas fa-clock"></i> {item.time}</td>
                                            {item.vname === 'hide' ?
                                                <React.Fragment>
                                                    <td className='hide'><i class="fas fa-user-secret"></i> ???n danh</td>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    {item.email === 'hide' ?
                                                        <React.Fragment>
                                                            <td><i class="fas fa-user-secret"></i> {item.vname}</td>
                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                            <td><a href={item.link} target='_blank'><i class="fas fa-user"></i> {item.vname}</a></td>
                                                        </React.Fragment>
                                                    }
                                                </React.Fragment>
                                            }
                                            {item.email === 'hide' ?
                                                <React.Fragment>
                                                    <td className='hide'><i class="fas fa-user-secret"></i> ???n danh</td>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <td><i class="fas fa-envelope"></i> {item.email}</td>
                                                </React.Fragment>
                                            }
                                            {item.type === 'profile' ?
                                                <React.Fragment>
                                                    <td className='center'><a href={item.content} target='_blank'><i class="fas fa-id-card-alt"></i> Trang c?? nh??n</a></td>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <td className='center'><a href={item.content} target='_blank'><i class="far fa-address-card"></i> Danh thi???p</a></td>
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
                            <div className='pre' onClick={() => this.showMore('pre')}><i class="fas fa-minus"></i> ???n b???t</div>
                            <div className='default' onClick={() => this.showMore('default')}><i class="fas fa-sync-alt"></i> M???c ?????nh</div>
                            <div className='next' onClick={() => this.showMore('next')}> <i class="fas fa-plus"></i> Xem th??m</div>
                            <div>
                                ??ang hi???n th???: <b>{showNumber}</b>/<b>{this.state.total}</b>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Viewer));
