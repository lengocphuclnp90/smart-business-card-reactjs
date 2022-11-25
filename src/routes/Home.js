import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Home extends Component {

    render() {
        const { isAdmin } = this.props;
        let linkToRedirect = isAdmin ? '/system/user-manage' : '/home';

        return (
            <Redirect to={linkToRedirect} />
        );
    }

}

const mapStateToProps = state => {
    return {
        isAdmin: state.user.isAdmin
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
