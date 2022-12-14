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
            toast.success("L???ch s??? tr???ng, h??y m??? r???ng m???i quan h??? !");
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
        let res = await getHistory(data);
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
            let res = await getHistory(data);
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
                <div className='history'>
                    <div className='history-header'>
                        <div className='history-title'>
                            <i class="fas fa-arrow-circle-left"
                                onClick={() => this.props.showUserInfo()}
                            ></i>
                            Th??ng Tin T??i Kho???n N??y ???? Xem
                        </div>
                        <div className='history-tool'>
                            <div className='tool-input'>
                                <div className='tool-content'>
                                    <div className='htitle'>Lo???i th??ng tin</div>
                                    <div className='hinput'>
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
                                    <div className='htitle'>T??n hi???n th???</div>
                                    <div className='hinput'>
                                        <input onChange={(event) => this.handleOnChangeInput(event, 'vname_filter')}
                                            value={this.state.vname_filter} ></input>
                                    </div>
                                </div>
                            </div>

                            <div className='tool-content'>
                                <div className='hsubmit' title='T??m ki???m'
                                    onClick={() => this.filter()}
                                ><i class="fas fa-search"></i></div>
                                <div className='hrefect' title='L??m m???i'
                                    onClick={() => this.getInfo()}
                                ><i class="fas fa-undo"></i></div>
                                <div className='hdelete' title='X??a t???t c???'
                                    onClick={() => this.deleteAll()}
                                ><i class="fas fa-trash-alt"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className='history-body'>
                        <div>
                            ??ang hi???n th???: <b>{showNumber}</b>/<b>{this.state.total}</b>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='table-title'>Th???i gian</td>
                                    <td className='table-title'>T??n hi???n th???</td>
                                    <td className='table-title center'>Li??n k???t</td>
                                    <td className='table-title center'>Lo???i th??ng tin</td>
                                    <td className='table-title center'>Thao t??c</td>
                                </tr>
                                {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><i class="fas fa-clock"></i> {item.time}</td>
                                            <td> {item.vname}</td>
                                            <td className='center'><a href={item.link} target='_blank'>M??? Link <i class="fas fa-external-link-alt"></i></a></td>
                                            {item.type === 'profile' ?
                                                <React.Fragment>
                                                    <td className='center'><i class="fas fa-user"></i> Trang c?? nh??n</td>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <td className='center'><i class="far fa-address-card"></i> Danh thi???p</td>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(History));
