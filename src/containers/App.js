import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated, IsSignIn, IsUser } from '../hoc/authentication';
import { path } from '../utils'
import SignIn from './Home/SignIn';
import SignUp from './Home/SignUp';
import { CustomToastCloseButton } from '../components/CustomToast';
import Home from './Home/Home.js';
import CustomScrollbars from '../components/CustomScrollbars';
import Profile from './User/Profile';
import Card from './User/Card';
import UserManager from './User/UserManage';
import verifi from '../../src/containers/Verifi/verifi'
import PostGuide from './Post/PostGuide';
import PostRule from './Post/PostRule';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.HOMEPAGE} component={Home} />
                                    <Route path={path.PROFILE} component={Profile} />
                                    <Route path={path.CARD} component={Card} />
                                    <Route path={path.USER_LOGIN} component={IsSignIn(SignIn)} />
                                    <Route path={path.SIGN_UP} component={IsSignIn(SignUp)} />
                                    <Route path={path.USER_MANAGER} component={IsUser(UserManager)} />
                                    <Route path={path.VERIFI} component={verifi} />
                                    <Route path={path.POST_GUIDE} component={PostGuide} />
                                    <Route path={path.POST_RULE} component={PostRule} />
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        {/* <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        /> */}
                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isAdmin: state.user.isAdmin
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);