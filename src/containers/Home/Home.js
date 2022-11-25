import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Home.scss';
import './HomeMobile.scss';
import * as actions from '../../store/actions'
import { LANGUAGES, path } from "../../utils";
import { setLanguage } from '../../services/userService';
import Header from './Header';
import Footer from './Footer';
import { getListService } from '../../services/userService';
import cardGif from '../../assets/card.gif';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            card: {},
            cardPreview: {},
        }
    }

    async componentDidMount() {
        await this.getCard();
        let card = this.state.card;
        await this.setState({
            cardPreview: card[0]
        })
        let i = 1;
        setInterval(async () => {
            if (i === card.length) i = 0;
            await this.setState({
                cardPreview: card[i]
            })
            i++;
        }, 1500);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    changeLanguage = async (language) => {
        if (language === LANGUAGES.EN) {
            let data = {
                id: this.props.userInfo.id,
                language: LANGUAGES.EN
            }
            await setLanguage(data);
            this.props.changeLanguage(LANGUAGES.EN);
        } else {
            let data = {
                id: this.props.userInfo.id,
                language: LANGUAGES.VI
            }
            await setLanguage(data);
            this.props.changeLanguage(LANGUAGES.VI);
        }
    }
    getCard = async () => {
        let data = {
            type: 'card'
        };
        let res = await getListService(data);
        if (res) {
            this.setState({
                card: res,
            })
        }
    }
    render() {
        let card = this.state.cardPreview;
        let cardImage = '';
        if (card) {
            if (card.image) {
                cardImage = new Buffer(card.image, 'base64').toString('binary');
            }
        }
        return (
            <React.Fragment>
                <Header />
                <div className='home'>
                    <div className='home-body'>
                        <div className='home-body-1'>
                            <div className='body-1-left'>
                                {cardImage !== '' ?
                                    <img src={cardImage} className='card' /> :
                                    <i class="far fa-address-card"></i>
                                }
                            </div>
                            <div className='body-1-right'>
                                <div className='t1'><FormattedMessage id="home.title1" /></div>
                                <div className='t2'><i class="fas fa-check"></i><FormattedMessage id="home.content1" /></div>
                                <div className='t2'><i class="fas fa-check"></i><FormattedMessage id="home.content2" /></div>
                                <div className='t2'><i class="fas fa-check"></i><FormattedMessage id="home.content3" /></div>
                                <div className='right-btn'
                                    onClick={() => {
                                        window.location = `${path.BASE_URL}${path.USER_MANAGER}`;
                                    }}
                                ><i class="fas fa-pencil-alt"></i> <FormattedMessage id="home.btn1" /></div>
                            </div>
                        </div>
                        <div className='home-body-2'>
                            <div className='body-2-title'>
                                <FormattedMessage id="home.title2" />
                            </div>
                            <div className='body-2-content'>
                                <div className='content-line'>
                                    <div className='line-box'>
                                        <i class="fas fa-tachometer-alt"></i>
                                        <b><FormattedMessage id="home.box1t" /></b>
                                        <span><FormattedMessage id="home.box1c" /></span>
                                    </div>
                                    <div className='line-box'>
                                        <i class="fa fa-coffee" aria-hidden="true"></i>
                                        <b><FormattedMessage id="home.box2t" /></b>
                                        <span><FormattedMessage id="home.box2c" /></span>
                                    </div>
                                    <div className='line-box'>
                                        <i class="fa fa-id-card" aria-hidden="true"></i>
                                        <b><FormattedMessage id="home.box3t" /></b>
                                        <span><FormattedMessage id="home.box3c" /></span>
                                    </div>
                                </div>
                                <div className='content-line'>
                                    <div className='line-box'>
                                        <i class="fas fa-sync-alt"></i>
                                        <b><FormattedMessage id="home.box4t" /></b>
                                        <span><FormattedMessage id="home.box4c" /></span>
                                    </div>
                                    <div className='line-box'>
                                        <i class="fas fa-users"></i>
                                        <b><FormattedMessage id="home.box5t" /></b>
                                        <span><FormattedMessage id="home.box6c" /></span>
                                    </div>
                                    <div className='line-box'>
                                        <i class="far fa-calendar-check"></i>
                                        <b><FormattedMessage id="home.box6t" /></b>
                                        <span><FormattedMessage id="home.box6c" /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='home-body-3'>
                            <div className='body-3-content-img'>
                                <img src={cardGif} />
                            </div>
                            <div className='body-3-content-title'>
                                <FormattedMessage id="home.title3" />
                            </div>
                            <div className='body-3-content-btn'
                                onClick={() => {
                                    window.location = `${path.BASE_URL}${path.USER_MANAGER}`;
                                }}
                            >
                                <span><FormattedMessage id="home.btn2" /> </span><i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <Footer />
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
