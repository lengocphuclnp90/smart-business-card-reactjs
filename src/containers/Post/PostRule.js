import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Post.scss';
import './PostMobile.scss';
import * as actions from '../../store/actions'
import { LANGUAGES, path } from "../../utils";
import Header from '../Home/Header';
import Footer from '../Home/Footer';

class PostRule extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {

        return (
            <React.Fragment>
                <Header />
                <div className='post'>
                    <div className='post-box'>
                        {this.props.language === LANGUAGES.EN ?
                            <React.Fragment>
                                <div className='title'>RULES AND TERMS OF USE</div>
                                <div className='t1'>1. Terms of use</div>
                                <ul>
                                    <li>Do not use the site for malicious purposes</li>
                                    <li>Do not provide malicious information to others</li>
                                    <li>Compliance with legal regulations on network security</li>
                                    <li>Cannot impersonate other organizations</li>
                                </ul>
                                <div className='t1'>2. Terms of Use</div>
                                <ul>
                                    <li>By using the website you have read and agree to all terms and conditions</li>
                                    <li>Your account will be locked if you violate the terms and conditions.</li>
                                    <li>All the information you provide will be visible to the administrator for management purposes, which is entirely user-friendly</li>
                                    <li>Your information may be deleted without notice if it violates regulations.</li>
                                    <li> We are not committed to ensuring the safety of accessing user-provided information.</li>
                                    <li> We do not guarantee the accuracy of personal information on all accounts.</li>
                                    <li> We are not responsible for activities, fraudulent information on the website.</li>
                                </ul>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className='title'>QUY ?????NH V?? ??I???U KHO???N S??? D???NG</div>
                                <div className='t1'>1. Quy ?????nh s??? d???ng</div>
                                <ul>
                                    <li>Kh??ng s??? d???ng website cho m???c ????ch x???u</li>
                                    <li>Kh??ng cung c???p c??c th??ng tin ?????c h???i cho ng?????i kh??c</li>
                                    <li>Tu??n th??? c??c quy ?????nh ph??p lu???t v??? an ninh m???ng</li>
                                    <li>Kh??ng m???o danh c?? nh??n t??? ch???c kh??c</li>
                                </ul>
                                <div className='t1'>2. ??i???u kho???n s??? d???ng</div>
                                <ul>
                                    <li>Khi s??? d???ng website c?? ngh??a b???n ???? ?????c v?? ?????ng ?? t???t c??? quy ?????nh v?? ??i???u kho???n</li>
                                    <li>T??i kho???n c???a b???n s??? b??? kh??a n???u vi ph???m quy ?????nh v?? ??i???u kho???n.</li>
                                    <li>T???t c??? c??c th??ng tin b???n cung c???p s??? ???????c hi???n th??? v???i qu???n tr??? vi??n v?? m???c ????ch qu???n l??, an to??n cho ng?????i s??? d???ng</li>
                                    <li>Th??ng tin c???a b???n c?? th??? s??? b??? x??a m?? kh??ng b??o tr?????c n???u vi ph???m quy ?????nh.</li>
                                    <li>Ch??ng t??i kh??ng cam k???t ?????m b???o an to??n khi truy c???p s??? d???ng c??c th??ng tin do ng?????i d??ng cung c???p.</li>
                                    <li>Ch??ng t??i kh??ng cam k???t ch??nh x??c th??ng tin c?? nh??n tr??n t???t c??? c??c t??i kho???n.</li>
                                    <li>Ch??ng t??i kh??ng ch???u tr??ch nhi???m v??? c??c ho???t ?????ng, h??nh vi l???a ?????o th??ng tin tr??n website.</li>
                                </ul>
                            </React.Fragment>
                        }
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isUser: state.user.isUser,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: (language) => dispatch(actions.changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostRule);
