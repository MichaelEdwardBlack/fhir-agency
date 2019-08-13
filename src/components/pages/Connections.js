import React from 'react';
import { connect } from 'react-redux';
import { authorize } from '../../actions';

class Connections extends React.Component {
  componentDidMount() {
    if (!this.props.isLoggedIn) {
      this.props.authorize();
    }
  }
  render() {
    const { isLoggedIn } = this.props;
    return (
      <div>
        {isLoggedIn && <div>My Connections</div>}
        {!isLoggedIn && <div>Not Authorized</div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    isLoggedIn: state.isLoggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authorize: () => {
      dispatch(authorize());
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Connections);
