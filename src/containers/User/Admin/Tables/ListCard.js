import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './ListCard.scss';
import { LANGUAGES, CURD_ACTIONS, CommonUtils, path } from "../../../../utils";
import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getListService } from '../../../../services/userService';
import { adminDashboardService } from '../../../../services/adminMenuService';
import html2canvas from "html2canvas";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import avt from '../../../../assets/avt.png';
class ListCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrList: [],
            id: 0,
            name: '',
            image: '',
            new: false,
            showReview: true,
            rendering: false,

            html: '',
            css: '',
            code_html: '',
            code_css: '',

            qrcode: '',
            logo: '',

            isOpen: false,
            err: [],
        }
    }
    async componentDidMount() {
        this.getList();
        await this.getBase64FromUrl('qrcode', `https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=${path.BASE_URL}`);
        await this.getBase64FromUrl('logo', path.LOGO_URL);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    // START Tạo hình ảnh
    getBase64FromUrl = async (id, url) => {
        let data = await fetch(url);
        let blob = await data.blob();
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            let base64data = reader.result;
            let copyState = { ...this.state };
            copyState[id] = base64data;
            this.setState({
                ...copyState
            })
        }
    }

    downloadImageFormId = async (id) => {
        let canvas = await html2canvas(document.querySelector(`#${id}`));
        let url = canvas.toDataURL("image/png", 1.0);
        const blob = await fetch(url).then(res => res.blob());

        // DOWNLOAD THẲNG VỀ MÁY
        // let downloadLink = await URL.createObjectURL(blob);
        // const a = document.createElement("a");
        // a.href = downloadLink
        // a.download = `card.png`;
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);

        // LƯU TRÊN SERVER
        let base64 = await CommonUtils.getBase64(blob);
        this.setState({
            image: base64,
        })

    }

    // END Tạo hình ảnh
    getList = async () => {
        let data = {
            type: 'card'
        };
        let res = await getListService(data);
        if (!_.isEmpty(res)) {
            this.setState({
                arrList: res,
            }, () => {
                this.setState({
                    id: res[0].id,
                    name: res[0].name,
                    code_css: res[0].css,
                    code_html: res[0].html,
                    new: false,
                }, async () => {
                    await this.reviewCard();
                    await this.reviewCard();
                })
            })
        } else {
            this.setState({
                id: '',
                name: '',
                code_css: '',
                code_html: '',
                new: true,
            })
        }
    }
    reviewCard = () => {
        let css = `<style>${this.state.code_css}</style>`
        this.setState({
            showReview: true,
            css: css,
            html: this.state.code_html,
            err: []
        }, async () => {
            let err = this.state.err;
            try {
                document.getElementById('cid').innerHTML = 'SHSI-HSJX-AJAB-XHYS';
            } catch (e) {
                err.push("Chưa có ID danh thiếp !");
            }
            try {
                document.getElementById('card-name').innerHTML = 'CÔNG TY TNHH 1 THÀNH VIÊN ITHOME';
            } catch (e) {
                err.push("Chưa có tên danh thiếp !");
            }
            try {
                document.getElementById('name').innerHTML = 'NGUYỄN VĂN A';
            } catch (e) {
                err.push("Chưa có tên người dùng !");
            }
            try {
                document.getElementById("qrcode").src = this.state.qrcode;
            } catch (e) {
                err.push("Chưa có QR CODE !");
            }
            try {
                document.getElementById("logo").src = this.state.logo;
            } catch (e) {
                err.push("Chưa có logo website !");
            }
            try {
                document.getElementById("avt").src = avt;
            } catch (e) {
                err.push("Chưa có ảnh đại diện người dùng !");
            }
            try {
                document.getElementById("intro").innerHTML = "Làm việc tại học viện hàng không Việt Nam";
            } catch (e) {
                err.push("Chưa có giới thiệu người dùng !");
            }
            this.setState({
                err: err
            })
        })
    }
    deleteInfo = async () => {
        let warning = prompt("Bạn có chắc chắn muốn xóa mẫu này? Nhập YES để xác nhận hoặc bấm bất kì để hùy.", "");
        if (warning === "YES") {
            let data = {
                table: 'listCard',
                type: 'delete',
                id: this.state.id,
            }
            console.log('id', this.state.id);
            let res = await adminDashboardService(data);
            if (res && res.err) {
                toast.error("Đã xảy ra lỗi !");
            } else {
                this.setState({
                    id: '',
                    name: '',
                    code_css: '',
                    code_html: '',
                    new: false,
                }, async () => {
                    await this.getList();
                    toast.success("Xóa thông tin thành công !");
                })
            }
        }
    }
    saveInfo = async () => {
        if (this.state.new === true) {
            if (this.state.name === '' || this.state.code_css === '' || this.state.code_hml) {
                toast.error('Thông tin rỗng !!!');
            } else {
                await this.downloadImageFormId('card-custom-size');
                let data = {
                    table: 'listcard',
                    type: 'newlistcard',
                    name: this.state.name,
                    html: this.state.code_html,
                    css: this.state.code_css,
                    image: this.state.image,
                }
                let old_name = this.state.name;
                let res = await adminDashboardService(data);
                if (res.err) {
                    if (res.err === 'EXIST') {
                        toast.error("Trùng tên với danh thiếp khác !");
                    } else {
                        toast.error("Đã xảy ra lỗi !");
                    }
                } else {
                    await this.getList();
                    let arrList = this.state.arrList;
                    for (let i = 0; i < arrList.length; i++) {
                        if (`${arrList[i].name}` === `${old_name}`) {
                            this.setState({
                                id: arrList[i].id,
                                name: arrList[i].name,
                                code_css: arrList[i].css,
                                code_html: arrList[i].html,
                                image: arrList[i].image,
                                new: false,
                            })
                        }
                    }
                    toast.success("Thêm thông tin thành công !");
                    this.reviewCard();
                }
            }
        } else {
            if (this.state.name === '' || this.state.code_css === '' || this.state.code_hml) {
                toast.error('Thông tin rỗng !!!');
            } else {
                await this.downloadImageFormId('card-custom-size');
                let data = {
                    table: 'listcard',
                    type: 'updatelistcard',
                    id: this.state.id,
                    name: this.state.name,
                    html: this.state.code_html,
                    css: this.state.code_css,
                    image: this.state.image,
                }
                let old_name = this.state.name;
                let res = await adminDashboardService(data);
                if (res.err) {
                    toast.error("Đã xảy ra lỗi !");
                } else {
                    await this.getList();
                    let arrList = this.state.arrList;
                    for (let i = 0; i < arrList.length; i++) {
                        if (`${arrList[i].name}` === `${old_name}`) {
                            console.log("old_name", old_name);
                            this.setState({
                                id: arrList[i].id,
                                name: arrList[i].name,
                                code_css: arrList[i].css,
                                code_html: arrList[i].html,
                                image: arrList[i].image,
                                new: false,
                            }, () => {
                                console.log("id", this.state.id);
                            })
                        }
                    }
                    this.reviewCard();
                    toast.success("Cập nhật thông tin thành công !");
                }
            }
        }
    }
    redoCode = () => {
        let arrList = this.state.arrList;
        for (let i = 0; i < arrList.length; i++) {
            if (`${arrList[i].id}` === `${this.state.id}`) {
                this.setState({
                    name: arrList[i].name,
                    code_css: arrList[i].css,
                    code_html: arrList[i].html,
                    new: false,
                }, () => {
                    this.reviewCard();
                })
            }
        }
    }
    newCard = () => {
        this.setState({
            new: true,
            name: '',
            code_html: '',
            code_css: '',
        }, () => {
            this.reviewCard();
        })
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            if (this.state.rendering === true) {
                if (id === 'code_html' || id === 'code_css') {
                    this.reviewCard();
                }
            }
            if (id === 'id') {
                let arrList = this.state.arrList;
                for (let i = 0; i < arrList.length; i++) {
                    if (`${arrList[i].id}` === `${this.state.id}`) {
                        this.setState({
                            name: arrList[i].name,
                            code_css: arrList[i].css,
                            code_html: arrList[i].html,
                        }, () => {
                            this.reviewCard();
                        })
                    }
                }

            }
        })

    }
    openPreviewImg = () => {
        this.setState({
            isOpen: true
        })
    }
    render() {
        let arrList = this.state.arrList;
        console.log(arrList);
        let imageBase64 = '';
        for (let i = 0; i < arrList.length; i++) {
            if (`${arrList[i].id}` === `${this.state.id}`) {
                if (arrList[i].image) {
                    if (arrList[i].image) {
                        imageBase64 = new Buffer(arrList[i].image, 'base64').toString('binary');
                    }
                }
            }
        }
        let err = this.state.err;
        return (
            <React.Fragment>
                <div className='list-card'>
                    {this.state.showReview === true &&
                        <React.Fragment>
                            <div className='review-card'>
                                <div className='review-title'>Bản xem trước thiết kế: 400px:250px</div>
                                <div className='review-render'>
                                    {/* <div className='card-custom-size'>
                                        
                                    </div> */}
                                    <div dangerouslySetInnerHTML={{ __html: this.state.css }} />
                                    <div dangerouslySetInnerHTML={{ __html: this.state.html }} id='card-custom-size' />
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    <div className='tool-card'>
                        {this.state.new === false ?
                            <React.Fragment>
                                <div className='card-title'><i class="fas fa-cogs"></i> Chỉnh sửa mẫu</div>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className='card-title'><i class="fas fa-plus"></i> Thêm mẫu mới</div>
                            </React.Fragment>
                        }
                        <div className='card-select'>
                            {!_.isEmpty(arrList) && this.state.new === false ?
                                <select value={this.state.id}
                                    onChange={(event) => this.handleOnChangeInput(event, 'id')}
                                >
                                    {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        );
                                    })}
                                </select> :
                                <React.Fragment></React.Fragment>
                            }
                            {this.state.new === true ?
                                <React.Fragment>
                                    <div className='btn-new'
                                        onClick={() => this.redoCode()}
                                    ><i class="fas fa-cogs"></i></div>
                                </React.Fragment> :
                                <React.Fragment>
                                    <div className='btn-new'
                                        onClick={() => this.newCard()}
                                    ><i class="fas fa-plus"></i></div>
                                </React.Fragment>

                            }
                        </div>
                    </div>
                    <div className='custom-card'>
                        <div className='custom-name'>
                            <div className='card-name-input'>
                                <b>Tên hiển thị: </b><input className='input-name'
                                    value={this.state.name}
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                ></input>
                            </div>
                            <div className='card-name-tool'>
                                <div className='btn-save'
                                    onClick={() => this.saveInfo()}
                                ><i class="far fa-save"></i></div>
                                {this.state.new === false && !_.isEmpty(arrList) ?
                                    <React.Fragment>
                                        <div className='btn-del'
                                            onClick={() => this.deleteInfo()}
                                        ><i class="far fa-trash-alt"></i></div>
                                    </React.Fragment> :
                                    <React.Fragment>

                                    </React.Fragment>
                                }
                                {this.state.new === false &&
                                    <div className='btn-redo'
                                        onClick={() => this.redoCode()}
                                    ><i class="fas fa-undo"></i></div>
                                }
                                {this.state.rendering === true ?
                                    <React.Fragment>
                                        <div className='btn-rendering active'
                                            onClick={() => this.setState({
                                                rendering: false,
                                            })}
                                        ><i class="fas fa-tv"></i></div>
                                        <div className='btn-render'
                                        ><i class="fas fa-play"></i></div>
                                        <div className='btn-review-hide'
                                        ><i class="fas fa-eye-slash"></i></div>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <div className='btn-rendering'
                                            onClick={() => {
                                                this.setState({
                                                    rendering: true,
                                                    showReview: true,
                                                }, async () => {
                                                    await this.reviewCard();
                                                })
                                            }}
                                        ><i class="fas fa-tv"></i></div>
                                        <div className='btn-render active'
                                            onClick={() => this.reviewCard()}
                                        ><i class="fas fa-play"></i></div>
                                        {this.state.showReview === true ?
                                            <React.Fragment>
                                                <div className='btn-review-hide active'
                                                    onClick={() => this.setState({ showReview: false })}
                                                ><i class="fas fa-eye-slash"></i></div>
                                            </React.Fragment> :
                                            <React.Fragment>
                                                <div className='btn-review-hide active'
                                                    onClick={() => { this.setState({ showReview: true }); this.reviewCard() }}
                                                ><i class="fas fa-eye"></i></div>
                                            </React.Fragment>

                                        }
                                    </React.Fragment>

                                }
                            </div>
                        </div>
                        <div className='code-doc'>
                            {this.state.new === false &&
                                <div className='doc-img'
                                    onClick={() => this.setState({ isOpen: true })}
                                >
                                    <img src={imageBase64}></img>
                                    <span>Kiểu đã lưu</span>
                                </div>
                            }
                            <div className='doc-copy'>
                                <span className='doc-copy-title'>Quy ước:</span>
                                <div className='sub-doc'>
                                    <b>Logo img:</b>
                                    <span>id='logo'</span>
                                    <div className='btn-copy'
                                        onClick={() => { navigator.clipboard.writeText(`id='logo'`); toast.success("Đã sao chép !") }}
                                    ><i class="far fa-copy"></i></div>
                                </div>
                                <div className='sub-doc'>
                                    <b>QrCode img:</b>
                                    <span>id='qrcode'</span>
                                    <div className='btn-copy'
                                        onClick={() => { navigator.clipboard.writeText(`id='qrcode'`); toast.success("Đã sao chép !") }}
                                    ><i class="far fa-copy"></i></div>
                                </div>
                                <div className='sub-doc'>
                                    <b>Avt img:</b>
                                    <span>id='avt'</span>
                                    <div className='btn-copy'
                                        onClick={() => { navigator.clipboard.writeText(`id='avt'`); toast.success("Đã sao chép !") }}
                                    ><i class="far fa-copy"></i></div>
                                </div>
                                <div className='sub-doc'>
                                    <b>Tên danh thiếp:</b>
                                    <span>id='card-name'</span>
                                    <div className='btn-copy'
                                        onClick={() => { navigator.clipboard.writeText(`id='card-name'`); toast.success("Đã sao chép !") }}
                                    ><i class="far fa-copy"></i></div>
                                </div>
                                <div className='sub-doc'>
                                    <b>Tên người dùng:</b>
                                    <span>id='name'</span>
                                    <div className='btn-copy'
                                        onClick={() => { navigator.clipboard.writeText(`id='name'`); toast.success("Đã sao chép !") }}
                                    ><i class="far fa-copy"></i></div>
                                </div>
                                <div className='sub-doc'>
                                    <b>CID:</b>
                                    <span>id='cid'</span>
                                    <div className='btn-copy'
                                        onClick={() => { navigator.clipboard.writeText(`id='cid'`); toast.success("Đã sao chép !") }}
                                    ><i class="far fa-copy"></i></div>
                                </div>
                                <div className='sub-doc'>
                                    <b>Giới thiệu:</b>
                                    <span>id='intro'</span>
                                    <div className='btn-copy'
                                        onClick={() => { navigator.clipboard.writeText(`id='intro'`); toast.success("Đã sao chép !") }}
                                    ><i class="far fa-copy"></i></div>
                                </div>
                            </div>
                            <div className='doc-err'>
                                <div className='err-title'>Chuẩn đoán:</div>
                                {err && err.length > 0 && err.map((item, index) => {
                                    return (
                                        <React.Fragment>
                                            <span key={index}><i class="fas fa-bug"></i><div id='err'>{item}</div></span>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='custom-code'>
                            <div className='code-html'>
                                <b>HTML <i class="fas fa-code"></i></b>
                                <textarea rows='20'
                                    value={this.state.code_html}
                                    onChange={(event) => this.handleOnChangeInput(event, 'code_html')}
                                ></textarea>
                            </div>
                            <div className='code-css'>
                                <b>CSS <i class="fas fa-code"></i></b>
                                <textarea rows='20'
                                    value={this.state.code_css}
                                    onChange={(event) => this.handleOnChangeInput(event, 'code_css')}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div >
                {
                    this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={imageBase64}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListCard));
