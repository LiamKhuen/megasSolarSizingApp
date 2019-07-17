import React, { Component } from 'react';
import Pressure  from '../data/pressure'

class RequiredInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressure: Pressure,
    }

    this.onPressureChange = this.onPressureChange.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
  }

  onPressureChange(e) {
    this.props.setPressure(e.target.value);
  }

  onLocationChange(e) {
    this.props.setLocation(e.target.value);
  }

  render() {
    const pressureOpts = this.state.pressure.map(pressure => {
      return <option key={pressure}>{pressure}</option>;
    });
    const locationOpts = this.props.locations.map((location, idx) => {
      return <option key={`loc-${idx}`}>{location.Location.replace(/"/g, '')}</option>;
    });
    return (
      <div>
        <h2>Required Info</h2>
        <div className="form-control">
          <label>Pressure (PSI)</label>
          <select onChange={this.onPressureChange}>
            {pressureOpts}
          </select>
        </div>
        <div className="form-control">
          <label>Location</label>
          <select value={this.props.location.Location} onChange={this.onLocationChange}>
            {locationOpts}
          </select>
        </div>
      </div>
    );
  }
}

export default RequiredInfo;
