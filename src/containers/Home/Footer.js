import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Footer.scss';
import './FooterMobile.scss';
import * as actions from '../../store/actions'
import { LANGUAGES, path } from "../../utils";
import { setLanguage } from '../../services/userService';
import { getListService } from '../../services/userService';
import logo from '../../assets/logo_01.png';

class Footer extends Component {

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
                <div className='footer'>
                    <div className='footer-logo'>
                        <img src={logo}
                            onClick={() => {
                                window.location = `${path.BASE_URL}/`;
                            }}
                        />
                    </div>
                    <div className='footer-menu'>
                        <a href={`${path.BASE_URL}${path.POST_GUIDE}`}><FormattedMessage id="home.guide" /></a>
                        <a href={`${path.BASE_URL}${path.POST_RULE}`}><FormattedMessage id="home.rule" /></a>
                        <a href=''><FormattedMessage id="home.verifie" /></a>
                        <a href=''><FormattedMessage id="home.report" /></a>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
