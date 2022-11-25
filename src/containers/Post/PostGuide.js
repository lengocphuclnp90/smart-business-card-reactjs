import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Post.scss';
import './PostMobile.scss';
import * as actions from '../../store/actions'
import { LANGUAGES, path } from "../../utils";
import Header from '../Home/Header';
import Footer from '../Home/Footer';

class PostGuide extends Component {

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
                        <React.Fragment>
                            <div className='title'>HƯỚNG DẪN SỬ DỤNG WEBSITE</div>
                            <div className='t1'>1. Hướng dẫn đăng ký tài khoản</div>
                            <div className='youtube'>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div className='t1'>2. Hướng dẫn quản lý tài khoản</div>
                            <div className='youtube'>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div className='t1'>3. Hướng dẫn tạo thông tin cá nhân</div>
                            <div className='youtube'>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div className='t1'>4. Hướng dẫn tạo danh thiếp</div>
                            <div className='youtube'>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div className='t1'>5. Hướng dẫn đặt lịch hẹn</div>
                            <div className='youtube'>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/9opUyihQ2NQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                        </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(PostGuide);
