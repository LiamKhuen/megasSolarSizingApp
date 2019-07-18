import React, { Component } from 'react';
import { flowPerDay, panelsDailyOutput } from '../calc'; //--- Removed batteriesRequired and panelsRequired since they are unused
import sizing from '../data/sizing';
import motors from '../data/motors';
import plungers from '../data/plungers';
import controls from '../data/controls';
import heads from '../data/heads';
import panels from '../data/panels';

const optsFactory = list =>
  ['', ...list].map((item, idx) => {
    return (
      <option key={idx} value={item}>
        {item}
      </option>
    );
  });


class EquipmentTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      motors : motors,
      plungers: plungers,
      controls: controls,
      heads: heads,
      panels: panels,
    }

    this.clearFilters = this.clearFilters.bind(this);
    this.calcFlow = this.calcFlow.bind(this);
    this.calcLimitMinSun = this.calcLimiter('Sunlight, Min').bind(this);
    this.calcLimitAvgSun = this.calcLimiter('Sunlight, Avg').bind(this);
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


  calcFlow(row) {
    const slope =+ row['Slope'];
    const intercept =+ row['Y Intercept'];
    const maxFlowRate =+ row['Flow_max (GPD)'];
    const flowRate =+ this.props.flowRate;

    return flowPerDay({
      slope, // data from pump to calculate load based on flow
      intercept, // data from pump to calulate load based on flow
      flowRate,
      maxFlowRate, // data from pump max flow rate
    });
  }


//I do not think this method is necessary. For the equipment tab the user sets the panels, thus to list out a Min and Avg # of panels
//does not makes sense. Will ask Dave first.

  calcLimiter(sunlightType) {
    return (row, flowRate) => {

      const {
        autonomy,
        batteryEfficiency,
        batterySize,
        runDuration,
        safetyFactor,
        panel,
        panelCount,
        location,
      } = this.props;

      //const slope =+ row['Slope'];
      //const intercept =+ row['Y Intercept'];
      //const currentPerDay = {};
      //^^^Removed because not used^^^

      const panelOutput = panelsDailyOutput({
        numberOfPanels: panelCount, // number of panels
        panelType: panel, // Type of Panel 60W
        location: location, // Location object { }
        sunlightType, // Min or Average
        safetyFactor: safetyFactor, // autonomy safety factor used to derate battery
      });
      const batteries = batteries * (batterySize * (batteryEfficiency / 100.0) / safetyFactor) / autonomy;
      const pump = runDuration * row['Flow_max (GPD)'];

      if (panelOutput < batteries && panelOutput < pump) {
        return `panels (${panelOutput}, ${batteries}, ${pump})`;
      }
      else if (batteries < panelOutput && batteries < pump) {
        return `batteries (${panelOutput}, ${batteries}, ${pump})`;
      }
      else {
        return `pump (${panelOutput}, ${batteries}, ${pump})`;
      }

    };

  }


  render() {
    const motorOpts = optsFactory(this.state.motors);
    const plungerOpts = optsFactory(this.state.plungers); //--- Was:const plungerOpts = optsFactory(Object.keys(this.state.plungers));
    const controlOpts = optsFactory(this.state.controls);
    const headOpts = optsFactory(this.state.heads);

    const resultsRows = sizing.map((result, idx) => {
      const flowRate = this.calcFlow(result);
      const limiterMin = this.calcLimitMinSun(result, flowRate);
      const limiterAvg = this.calcLimitAvgSun(result, flowRate);
      return (
        <tr key={idx} onClick={() => console.log(result)}>
          <td>{result.Motor}</td>
          <td>{result.Plunger}</td>
          <td>{result.Head}</td>
          <td>{result.Controls}</td>
          <td>{flowRate}</td>
          <td>{limiterMin}</td>
          <td>{limiterAvg}</td>
        </tr>
      );
    });
    return (
      <div>
        {resultsRows.length === 0 && (
          <div>
            <h1>Enter number of solar panels and batteries to get started.</h1>
          </div>
        )}
        {resultsRows.length > 0 && (
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
                  <th>Flow Rate (GPD)</th>
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

export default EquipmentTable;
