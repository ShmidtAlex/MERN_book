import React from 'react';
import PropTypes from 'prop-types';

export default class NumInput extends React.Component {
  constructor(props) {
    super(props);
    //local state with transient state
    this.state = { value: this.format(props.value) };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({ value: this.format(newProps.value) });
  }
  onBlur(e) {
    //pass local, transient state to parent after user finished edit, where it became persistence one
    this.props.onChange(e, this.unformat(this.state.value));
  }
  onChange(e) {
    //change persistent state accordingly local state, if it's validated successfully
    if(e.target.value.match(/^\d*$/)) {
      this.setState({ value: e.target.value });
    }
  }
  format(num) {
    //convert number to string, otherwise leave the field empty
    return num !=null ? num.toString() : '';
  }
  unformat(str) {
    //convert string to a number, check if it is a number really, and put it 
    //into the field, otherwise put null value to the field
    const val = parseInt(str, 10);
    console.log(val);
    return isNaN(val) ? null : val;
  }
  render() {
    return(
      //{...this.props} passing parent's properties into this input's properties
      //Note, that it is very significant, where we place it concerning native properties, first one overrided by last one
      <input type='text' {...this.props} value={this.state.value} onBlur={this.onBlur} onChange={this.onChange}/>
    )
  }
}
NumInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}