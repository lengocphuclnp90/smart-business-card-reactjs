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
                                <div className='title'>QUY ĐỊNH VÀ ĐIỀU KHOẢN SỬ DỤNG</div>
                                <div className='t1'>1. Quy định sử dụng</div>
                                <ul>
                                    <li>Không sử dụng website cho mục đích xấu</li>
                                    <li>Không cung cấp các thông tin độc hại cho người khác</li>
                                    <li>Tuân thủ các quy định pháp luật về an ninh mạng</li>
                                    <li>Không mạo danh cá nhân tổ chức khác</li>
                                </ul>
                                <div className='t1'>2. Điều khoản sử dụng</div>
                                <ul>
                                    <li>Khi sử dụng website có nghĩa bạn đã đọc và đồng ý tất cả quy định và điều khoản</li>
                                    <li>Tài khoản của bạn sẽ bị khóa nếu vi phạm quy định và điều khoản.</li>
                                    <li>Tất cả các thông tin bạn cung cấp sẽ được hiển thị với quản trị viên vì mục đích quản lý, an toàn cho người sử dụng</li>
                                    <li>Thông tin của bạn có thể sẽ bị xóa mà không báo trước nếu vi phạm quy định.</li>
                                    <li>Chúng tôi không cam kết đảm bảo an toàn khi truy cập sử dụng các thông tin do người dùng cung cấp.</li>
                                    <li>Chúng tôi không cam kết chính xác thông tin cá nhân trên tất cả các tài khoản.</li>
                                    <li>Chúng tôi không chịu trách nhiệm về các hoạt động, hành vi lừa đảo thông tin trên website.</li>
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
