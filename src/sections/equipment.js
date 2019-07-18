import React, { Component } from 'react';
import panels from '../data/panels';
import { batteriesRequired, panelsRequired, flowPerDay, panelsDailyOutput } from '../calc';
import sizing from '../data/sizing';

// filterable opts
import motors from '../data/motors';
import plungers from '../data/plungers';
import controls from '../data/controls';
import heads from '../data/heads';

import EquipmentTable from './equipment-table';

const panelOpts = Object.keys(panels).map((panel, idx) => {
  return (
    <option key={idx} value={panel}>
      {`${panel}W Panel(s)`}
    </option>
  );
});

class Equipment extends Component {
  constructor(props) {
    super(props);
    this.clearFilters = this.clearFilters.bind(this);
  }

  clearFilters() {
    this.props.setFilterHead('');
    this.props.setFilterMotor('');
    this.props.setFilterPlunger('');
    this.props.setFilterControl('');
  }

  changeHandler(method, e) {
    if (this.props[method]) {
      this.props[method](e.target.value);
    }
  }

  render() {
    return (
      <div>
        <div className="flex-container">
          <div className="flex-action">
            <p>
              Enter the number of Batteries and Panels, then set filters below to find the
              calculated output.
            </p>
            <label>Batteries:</label>
            <input
              type="text"
              value={this.props.batteryCount}
              onChange={this.changeHandler.bind(this, 'setBatteries')}
            />
          </div>
          <div className="flex-action">
            <label>Panels:</label>
            <input
              type="text"
              value={this.props.panels}
              onChange={this.changeHandler.bind(this, 'setPanels')}
            />
            <label>Panel Size:</label>
            <select value={this.props.panel} onChange={this.changeHandler.bind(this, 'setPanel')}>
              {panelOpts}
            </select>
          </div>
        </div>
        <EquipmentTable {...this.props} />
      </div>
    );
  }
}

export default Equipment;
