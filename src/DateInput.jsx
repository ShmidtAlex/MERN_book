import React from 'react';
import PropTypes from 'prop-types';

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    //state for date field initially not focused, and valid, because of shows valid data
    this.state = { value: this.editFormat(props.value), focused: false, valid: true };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(newProps) {
  //newProps here is edited by user date field. if it was editet, this.state knows about this new values
    if (newProps.value !== this.props.value) {
      this.setState({ value: this.editFormat(newProps.value) });
    }
  }
  onFocus() {
    //this one only changed the focused value in this.state, when user clicked on date field
    this.setState({ focused: true });
  }
  onBlur(e) {
    //if user typed wrong date, value will be null/ if correct, it will be new date, which he typed
    const value = this.unformat(this.state.value);
    //if user type wrong date, valid will be false/ if correct, it will be true
    const valid = this.state.value === '' || value != null;
    //if this.state.value != '' && this.unformat(this.state.value) != null
    //and also if there is any value in onValidityChange prop from parent component
    if (valid !== this.state.valid && this.props.onValidityChange) {
      //that parent component recieves two arguments, including 'valid' (this.unformat(this.state value))
      this.props.onValidityChange(e, valid);
    }
    //then we miss focuse, and confirm that valid is true
    this.setState({ focused: false, valid });
    if (valid) {
      //setting parent's onChange with the edited by user and correct date
      this.props.onChange(e, value);
    }
  }
  onChange(e) {
    //if new value from user corresponding to RegExp, this value can exist in this field, otherwise it even doesn't typing in
    if (e.target.value.match(/^[\d-]*$/)) {
      this.setState({ value: e.target.value });
    }
  }
  displayFormat(date) {
    return (date != null) ? date.toDateString() : '';
  }
  editFormat(date) {
    //if there is any date, convert it to string ISO standart from 0 index to 9 (10 symb.length)
    return (date != null) ? date.toISOString().substr(0, 10) : '';
  }
  unformat(str) {
    //this one check is new unsetted state is a number, and if it is, allows it exist in this field
    const val = new Date(str);
    return isNaN(val.getTime()) ? null : val;
  }
  render() {
  {/*define the conditions for clasName='invalid' (for next styling it and showing to user, that it is)*/}
   
    const value = (this.state.focused || !this.state.valid) ? this.state.value : this.displayFormat(this.props.value);
    const childProps = Object.assign({}, this.props); {/*clone parent props to const childProps*/}
    delete childProps.onValidityChange; {/*remove unnecessary property onValidityChange*/}
    return (
      <input type="text" {...childProps} value={value} 
      placeholder={this.state.focused ? 'yyyy-mm-dd' : null} 
      onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} />
    );
  }
}
DateInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onValidityChange: PropTypes.func,
  name: PropTypes.string.isRequired,
}