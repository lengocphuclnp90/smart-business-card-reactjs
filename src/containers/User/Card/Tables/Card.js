import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Card.scss';
import './CardMobile.scss';
import { LANGUAGES, CURD_ACTIONS, CommonUtils, path } from "../../../../utils";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import _ from 'lodash';
import { updateInfoService, getListService } from '../../../../services/userService';
import html2canvas from "html2canvas";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { FormattedMessage } from 'react-intl';
class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrInfo: [],
            arrList: [],
            html: '',
            css: '',
            card: '', // Id của list card

            id: '',
            image: '', //image của card người dùng sẽ tải về
            name: '',
            link: '',
            number: '',
            security: 'S1',
            showForm: false,

            // phần render card
            qrcode: '',
            logo: '',

            isOpen: false,
            imgFullScreen: '',
        }
    }
    async componentDidMount() {
        this.getList();
        this.getInfo();
        await this.getBase64FromUrl('logo', path.LOGO_URL);
        // // tạo trước QRCODE và link
        // let link = await `${uuidv4()}-${this.props.userInfo.id}`;
        // this.setState({
        //     link: link,
        //     old_link: link,
        // }, async () => {
        //     await this.creatQrCodeLink();
        // })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            if (`${id}` === 'card') {
                let arrList = this.state.arrList;
                for (let i = 0; i < arrList.length; i++) {
                    if (`${arrList[i].id}` === this.state.card) {
                        this.setState({
                            html: arrList[i].html,
                            css: `<style>${arrList[i].css}</style>`,
                        }, () => {
                            this.reviewCard();
                        })
                    }
                }
            } else {
                this.reviewCard();
            }
            this.reviewCard();
        })

    }

    getList = async () => {
        let data = {
            type: 'card'
        };
        let res = await getListService(data);
        if (res) {
            this.setState({
                arrList: res,
                card: res[0].id,
                html: res[0].html,
                css: res[0].css
            })
        }
    }
    // thao tac

    // hien an form
    hideForm = (event) => {
        // hide form khi click ra ngoaif
        if (event.target.id === 'form-info') {
            this.setState({
                showForm: !this.state.showForm
            })
        }
    }
    // START Tạo hình ảnh
    getBase64FromUrl = async (id, url) => {
        let data = await fetch(url);
        let blob = await data.blob();
        let reader = new FileReader();
        await reader.readAsDataURL(blob);
        let base64data
        reader.onloadend = () => {
            base64data = reader.result;
            let copyState = { ...this.state };
            copyState[id] = base64data;
            this.setState({
                ...copyState
            })
        }
    }
    reviewCard = () => {
        try {
            document.getElementById('card-name').innerHTML = this.state.name;
        } catch (e) { }
        try {
            document.getElementById('cid').innerHTML = `${this.state.link}`;
        } catch (e) { }
        try {
            document.getElementById('name').innerHTML = `${this.props.userInfo.name}`;
        } catch (e) { }
        try {
            document.getElementById('logo').src = this.state.logo;
        } catch (e) { }
        try {
            document.getElementById('qrcode').src = this.state.qrcode;
        } catch (e) { }
        try {
            let imageBase64 = new Buffer(this.props.userInfo.image, 'base64').toString('binary');
            document.getElementById('avt').src = imageBase64;
        } catch (e) { }
        try {
            document.getElementById('intro').innerHTML = this.props.userInfo.intro;
        } catch (e) { }
    }
    creatQrCodeLink = async () => {
        // tao qrcode
        await this.getBase64FromUrl('qrcode', `https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=${path.BASE_URL}/card/${this.state.link}`);
    }
    openFromClear = async () => {
        // Tạo tiếp một link và qrcode cho lần thêm tiếp theo
        let link = await `${uuidv4()}-${this.props.userInfo.id}`;
        this.setState({
            link: link
        }, async () => {
            await this.creatQrCodeLink();
            await this.creatQrCodeLink();
            await this.reviewCard();
        })
        let arrList = this.state.arrList;
        this.setState({
            html: arrList[0].html,
            css: `<style>${arrList[0].css}</style>`,
            card: arrList[0].id,
            image: '',
            name: '',
            number: '10',
            security: 'S1',
            showForm: true,
            edit: false,
        }, async () => {
            try {
                document.getElementById("qrcode").src = this.state.qrcode;
                document.getElementById("logo").src = this.state.logo;
            } catch (e) { }
            await this.creatQrCodeLink();
            await this.reviewCard();
        })
    }
    openFromData = (item) => {
        let arrList = this.state.arrList;
        for (let i = 0; i < arrList.length; i++) {
            if (`${arrList[i].id}` === `${item.card}`) {
                let link = item.link;
                this.setState({
                    html: arrList[i].html,
                    css: `<style>${arrList[i].css}</style>`,
                    card: arrList[i].id,
                    link: link,
                    id: item.id,
                    image: '',
                    name: item.name,
                    number: item.number,
                    security: item.security,
                    showForm: true,
                    edit: true,
                }, async () => {
                    await this.creatQrCodeLink();
                    await this.creatQrCodeLink();
                    await this.reviewCard();
                    await this.reviewCard();
                })
            }
        }
    }
    downloadCard = async (link, name) => {
        let downloadLink = link;
        const a = document.createElement("a");
        a.href = downloadLink
        a.download = `Card_${name}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }
    getInfo = async () => {
        let newInfo = {
            table: 'card',
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
            let number = this.state.arrInfo.length;
            let show = 0;
            let view = 0;
            for (let i = 0; i < number; i++) {
                if ((res[i].number - res[i].view) === 0) {
                    show++;
                }
                view = view + (res[i].number - res[i].view);
            }
            this.props.checkView(number, show, view);
        }
    }
    saveInfo = async () => {
        // TAO IMAGE ;
        let canvas = await html2canvas(document.querySelector(`#card-custom-size`));
        let url = canvas.toDataURL("image/png", 1.0);
        const blob = await fetch(url).then(res => res.blob());
        let base64 = await CommonUtils.getBase64(blob);
        if (this.state.edit === false) {
            let data = await {
                table: 'card',
                type: 'new',
                user: this.props.userInfo.id,
                card: this.state.card,
                name: this.state.name,
                link: this.state.link,
                number: this.state.number,
                security: this.state.security,
                image: base64,
            }
            // console.log('img: ', data.image);
            // console.log('link: ', this.state.link);
            let res = await updateInfoService(data);
            if (!res || res.err) {
                toast.error("Đã xảy ra lỗi !");
            } else {
                await this.getInfo();
                toast.success("Thêm thông tin thành công !");
                this.setState({
                    showForm: false,
                })
            }
        } else {
            let data = await {
                table: 'card',
                type: 'update',
                id: this.state.id,
                user: this.props.userInfo.id,
                card: this.state.card,
                name: this.state.name,
                link: this.state.link,
                number: this.state.number,
                security: this.state.security,
                image: base64,
            }
            // console.log('img: ', data.image);
            // console.log('link: ', this.state.link);
            let res = await updateInfoService(data);
            if (!res || res.err) {
                toast.error("Đã xảy ra lỗi !");
            } else {
                await this.getInfo();
                toast.success("Cập nhật tin thành công !");
                this.setState({
                    showForm: false,
                })
            }
        }


    }
    deleteInfo = async (id) => {
        let newInfo = {
            table: 'card',
            type: 'delete',
            id: id,
            user: this.props.userInfo.id,
        }
        let res = await updateInfoService(newInfo);
        if (res && res.err) {
            toast.error("Đã xảy ra lỗi !");
        } else if (res.schedule) {
            toast.warning(`Không thể xóa danh thiếp này, vì có ${res.schedule} lịch hẹn chưa diễn ra!`);
        } else {
            await this.getInfo();
            toast.success("Xóa thông tin thành công !");
        }
    }
    imgFullScreen = (link) => {
        this.setState({
            imgFullScreen: link,
            isOpen: true,
        })
    }
    render() {
        let showForm = this.state.showForm;
        let arrList = this.state.arrList;
        let arrInfo = this.state.arrInfo;
        return (
            <React.Fragment>
                {showForm === true &&
                    <React.Fragment>
                        <div className='form-info-card' id='form-info' onClick={(event) => this.hideForm(event)}>
                            <div className='form-info-card-box'>
                                <div className='form-info-review-card'>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.css }} />
                                    <div dangerouslySetInnerHTML={{ __html: this.state.html }} id='card-custom-size' />
                                </div>
                                <div className='form-info-content-card'>
                                    <div className='header-form-card'>
                                        {this.state.edit === true ?
                                            <React.Fragment>
                                                <div className='card-input-title'><FormattedMessage id="card.edit" /></div>
                                            </React.Fragment> :
                                            <React.Fragment>
                                                <div className='card-input-title'><FormattedMessage id="card.edit" /></div>
                                            </React.Fragment>
                                        }
                                        <div className='card-input-btn'
                                            onClick={() => this.setState({
                                                showForm: false,
                                            })}
                                        ><i class="fas fa-times"></i></div>
                                    </div>
                                    <div className='body-form-card'>
                                        <div className='form-card-content'>
                                            <div className='card-sub-content-title'>
                                                <i class="far fa-address-card"></i> <FormattedMessage id="card.style" />
                                            </div>
                                            <div className='card-sub-content-input'>
                                                <select
                                                    value={this.state.card}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'card')}
                                                >
                                                    {arrList && arrList.length > 0 && arrList.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.id}>{item.name}</option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='form-card-content'>
                                            <div className='card-sub-content-title'>
                                                <i class="fas fa-pencil-alt"></i> <FormattedMessage id="card.name" />
                                            </div>
                                            <div className='card-sub-content-input'>
                                                <input
                                                    value={this.state.name}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                                ></input>
                                            </div>
                                        </div>
                                        <div className='form-card-content'>
                                            <div className='card-sub-content-title'>
                                                <i class="fas fa-th"></i> <FormattedMessage id="card.number" />
                                            </div>
                                            <div className='card-sub-content-input'>
                                                <input type='number' min="1"
                                                    value={this.state.number}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'number')}
                                                ></input>
                                            </div>
                                        </div>
                                        <div className='form-card-content'>
                                            <div className='card-sub-content-title'>
                                                <i class="fas fa-shield-alt"></i> <FormattedMessage id="card.security" />
                                            </div>
                                            <div className='card-sub-content-input'>
                                                <select
                                                    value={this.state.security}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'security')}
                                                >
                                                    <FormattedMessage id="card.low" >
                                                        {(message) => <option value='S1'>{message}</option>}
                                                    </FormattedMessage>
                                                    <FormattedMessage id="card.normal" >
                                                        {(message) => <option value='S2'>{message}</option>}
                                                    </FormattedMessage>
                                                    <FormattedMessage id="card.hight" >
                                                        {(message) => <option value='S3'>{message}</option>}
                                                    </FormattedMessage>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='submit-form-card'>
                                        <div className='form-card-submit-btn'
                                            onClick={() => this.saveInfo()}
                                        >
                                            <FormattedMessage id="card.btn-save" />
                                        </div>
                                    </div>
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
                            let imageBase64 = '';
                            if (item.image) {
                                imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                            }
                            return (
                                <React.Fragment>
                                    <div className='info-content'>
                                        <div className='title-type-card'>
                                            <img src={imageBase64}
                                                onClick={() => this.imgFullScreen(imageBase64)}
                                            ></img>
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="card.name" />:</b>
                                            {item.name}
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="card.number" />:</b>
                                            {item.number}
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="card.remain" />:</b>
                                            {(item.number - item.view) === 0 ?
                                                <React.Fragment>
                                                    <FormattedMessage id="card.end" />
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    {item.number - item.view}
                                                </React.Fragment>
                                            }
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="card.security" />:</b>
                                            {item.security === 'S1' &&
                                                <FormattedMessage id="card.S1" />
                                            }
                                            {item.security === 'S2' &&
                                                <FormattedMessage id="card.S2" />
                                            }
                                            {item.security === 'S3' &&
                                                <FormattedMessage id="card.S3" />
                                            }
                                        </div>
                                        <div className='info-content-sub'>
                                            <b><FormattedMessage id="card.link" />:</b>
                                            <a href={`${path.BASE_URL}/card/${item.link}`} target='_blank'><FormattedMessage id="card.open" /> <i class="fas fa-external-link-alt"></i></a>
                                        </div>
                                        <div className='info-content-tool-card'>
                                            <div className='tool-content-card'
                                                onClick={() => this.downloadCard(imageBase64, item.name)}
                                            >Tải xuống</div>
                                            <div className='tool-content-card'
                                                onClick={() => this.openFromData(item)}
                                            >Chỉnh sửa</div>
                                            <div className='tool-content-card'
                                                onClick={() => this.deleteInfo(item.id)}
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
                        <div className='right-table-title'><FormattedMessage id="card.myCard" /></div>
                        <div className='right-btn-new' onClick={() => this.openFromClear()}><FormattedMessage id="card.add" /><i class="fas fa-plus"></i></div>
                    </div>
                    <div className='right-body-card'>
                        <div className='body-table-content-card'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='table-title'></td>
                                        <td className='table-title long'><FormattedMessage id="card.name" /></td>
                                        <td className='table-title center very-small'><FormattedMessage id="card.number" /></td>
                                        <td className='table-title center very-small'><FormattedMessage id="card.remain" /></td>
                                        <td className='table-title center small'><FormattedMessage id="card.security" /></td>
                                        <td className='table-title center medium'><FormattedMessage id="card.link" /></td>
                                        <td className='table-title center'><FormattedMessage id="card.tool" /></td>
                                    </tr>
                                    {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.image) {
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                        }
                                        return (
                                            <React.Fragment>
                                                <tr key={index}>
                                                    <td className='table-content img'>
                                                        <img src={imageBase64}
                                                            onClick={() => this.imgFullScreen(imageBase64)}
                                                        ></img>
                                                    </td>
                                                    <td className='table-content long xx'><p>{item.name}</p></td>
                                                    {(item.number - item.view) === 0 ?
                                                        <React.Fragment>
                                                            <td className='table-content center very-small red'>{item.number}</td>
                                                            <td className='table-content center very-small red'><FormattedMessage id="card.end" /></td>
                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                            <td className='table-content center very-small'>{item.number}</td>
                                                            <td className='table-content center very-small'>{item.number - item.view}</td>
                                                        </React.Fragment>
                                                    }
                                                    {item.security === 'S1' &&
                                                        <td className='table-content center small'>
                                                            <FormattedMessage id="card.S1" />
                                                        </td>
                                                    }
                                                    {item.security === 'S2' &&
                                                        <td className='table-content center small'>
                                                            <FormattedMessage id="card.S2" />
                                                        </td>
                                                    }
                                                    {item.security === 'S3' &&
                                                        <td className='table-content center small'>
                                                            <FormattedMessage id="card.S3" />
                                                        </td>
                                                    }
                                                    <td className='table-content center medium'>
                                                        <a href={`${path.BASE_URL}/card/${item.link}`} target='_blank'><FormattedMessage id="card.open" /> <i class="fas fa-external-link-alt"></i></a>
                                                    </td>
                                                    <td className='table-content center medium'>
                                                        <i class="fas fa-download" onClick={() => this.downloadCard(imageBase64, item.name)}></i>
                                                        <i class="fas fa-pencil-alt" onClick={() => this.openFromData(item)}></i>
                                                        <i class="fas fa-trash-alt" onClick={() => this.deleteInfo(item.id)}></i>
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
                {
                    this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.imgFullScreen}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Card));
