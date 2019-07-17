
import React, {Component} from 'react';
//import axios from 'axios'; ---Is defined but never used
import {batteriesRequired, panelsRequired} from '../calc';
import motors from '../data/motors'
import plungers from '../data/plungers'
import controls from '../data/controls'
import heads from '../data/heads'
import panels from '../data/panels'

class Pressure extends Component {
  constructor(props) {
    super(props);

    this.state = {
      motors: motors,
      plungers: plungers,
      controls: controls,
      heads: heads,
      panels: panels,
      flowRateError: false
    }

    this.clearFilters = this.clearFilters.bind(this);
    this.calcBatts = this.calcBatts.bind(this);
    this.calcPercentRun = this.calcPercentRun.bind(this);
    this.calcPanelsMinSun = this.calcPanels('Sunlight, Min').bind(this);
    this.calcPanelsAvgSun = this.calcPanels('Sunlight, Avg').bind(this);
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

  validationHandler(e) {
    const value = parseInt(e.target.value); //Compiler says there is a missing 'radix' parameter

    // FlowRate should be greater than 0 and less than 200
    if ( value < 0 || value > 200 ) {
      this.setState({ 'flowRateError': true });
      console.log('Flow Rate Error');
    } else {
      // this.setState({ 'flowRateError': false });
      console.log('No Flow Rate Error');
    }
  }

  calcBatts(row) {
    const {
      autonomy,
      flowRate,
      batterySize,
      batteryEfficiency,
      safetyFactor,
      runDuration
    } = this.props;
    const slope = +row['Slope'];
    const intercept = +row['Y Intercept'];
    return batteriesRequired({
      autonomy, // # of days to run
      flowRate, // Pump flow rate used to calculate load
      batterySize, // Battery in Amp Hours
      batteryEfficiency, // 0-100 used to derate battery
      safetyFactor, // autonomy safety factor used to derate battery
      runDuration, // number of hours to run a day (default is 24)
      slope, // data from pump to calculate load based on flow
      intercept, // data from pump to calulate load based on flow
    }).toFixed(2);
  }

  calcPanels(sunlightType) {
    return row => {
      const {
        autonomy,
        runDuration,
        flowRate,
        safetyFactor,
        panel,
        location
      } = this.props;
      const slope = +row['Slope'];
      const intercept = +row['Y Intercept'];
      if (Object.keys(location).length !== 0) {
        // console.log('Location in Pressure  '   +  Object.keys(location));
        return panelsRequired({
          autonomy, // # of days to run
          flowRate, // Pump flow rate used to calculate load
          safetyFactor, // autonomy safety factor used to derate battery
          runDuration, // number of hours to run a day (default is 24)
          sunlightType, // Min or Average
          panelType: panel, // Type of Panel 60W
          location, // Location object { }
          slope, // data from pump to calculate load based on flow
          intercept,
        }).toFixed(2);
      };
    }
  }

  calcPercentRun(row) {
    const maxFlowRate = row['Flow_max (GPD)'];
    if (!maxFlowRate) {
      return 0.0;
    }
    const percent = this.props.flowRate / maxFlowRate * 100;
    return percent.toFixed(2);
  }

  render() {
    const panelOpts = Object.keys(this.state.panels).map((panel, idx) => {
      return (
        <option key={idx} value={panel}>
          {`${panel}W Panel(s)`}
        </option>
      );
    });

    const optsFactory = list =>
      ['', ...list].map((item, idx) => {
        return (
          <option key={idx} value={item}>
            {item}
          </option>
        );
      });

    const motorOpts = optsFactory(this.state.motors);
    const plungerOpts = optsFactory(Object.keys(this.state.plungers));
    const controlOpts = optsFactory(this.state.controls);
    const headOpts = optsFactory(this.state.heads);

    const resultsRows = this.props.sizing.map((result, idx) => {
      const battery = this.calcBatts(result);
      const panelsMin = this.calcPanelsMinSun(result);
      const panelsAvg = this.calcPanelsAvgSun(result);
      return (
        <tr key={idx} onClick={() => console.log(result)}>
          <td>{result.Motor}</td>
          <td>{result.Plunger}</td>
          <td>{result.Head}</td>
          <td>{result.Controls}</td>
          <td>{this.calcPercentRun(result)}</td>
          <td>{`${Math.ceil(battery)} (${battery})`}</td>
          <td>{`${Math.ceil(panelsMin)} (${panelsMin})`}</td>
          <td>{`${Math.ceil(panelsAvg)} (${panelsAvg})`}</td>
        </tr>
      );
    });
    return (
      <div>
        <div className="flex-container">
          <div className="flex-action">
            <label>Flow Rate (GPD):</label>
            <input
              type="text"
              value={this.props.flowRate}
              onChange={this.changeHandler.bind(this, 'setFlowRate')}
              className={this.state.flowRateError ? 'error' : ''}
            />
            <div className={this.state.flowRateError ? 'show' : 'hide'}>
              <h2 className="msg">
                Flow Rate should be between 0 to 200 Gallons Per Day. Contact
                support@megasmfg.com for other flow rate cases.
              </h2>
            </div>
          </div>
          <div className="flex-action">
            <label>Panel Size:</label>
            <select value={this.props.panel} onChange={this.changeHandler.bind(this, 'setPanel')}>
              {panelOpts}
            </select>
          </div>
        </div>
        {resultsRows.length === 0 && (
          <div>
            <h1>
              Enter Flow Rate and the required info to get started.{' '}
              <button onClick={this.clearFilters} className="btn">
                Clear Filters
              </button>
            </h1>
          </div>
        )}
        {resultsRows.length > 0 && this.state.flowRate !== 0 &&(
          <div>
            <button onClick={() => this.props.showReport(true)} className="btn">
              View Report
            </button>&nbsp;
            <button onClick={this.clearFilters} className="btn">
              Clear Filters
            </button>&nbsp;
            <table>
              <tbody>
                <tr>
                  <th>
                    Motor
                    <select
                      value={this.props.filterMotor}
                      onChange={this.changeHandler.bind(this, 'setFilterMotor')}
                    >
                      {motorOpts}
                    </select>
                  </th>
                  <th>
                    Plunger
                    <select
                      value={this.props.filterPlunger}
                      onChange={this.changeHandler.bind(this, 'setFilterPlunger')}
                    >
                      {plungerOpts}
                    </select>
                  </th>
                  <th>
                    Heads
                    <select
                      value={this.props.filterHead}
                      onChange={this.changeHandler.bind(this, 'setFilterHead')}
                    >
                      {headOpts}
                    </select>
                  </th>
                  <th>
                    Controls
                    <select
                      value={this.props.filterControl}
                      onChange={this.changeHandler.bind(this, 'setFilterControl')}
                    >
                      {controlOpts}
                    </select>
                  </th>
                  <th>% Run</th>
                  <th>Batteries</th>
                  <th>Min Sun</th>
                  <th>Avg Sun</th>
                </tr>
                {resultsRows}
              </tbody>
            </table>
            <button onClick={() => this.props.showReport(true)} className="btn">
              View Report
            </button>&nbsp;
            <button onClick={this.clearFilters} className="btn">
              Clear Filters
            </button>&nbsp;
          </div>
        )}
      </div>
    );
  }
}

export default Pressure;
