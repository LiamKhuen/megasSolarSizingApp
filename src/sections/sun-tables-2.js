import React, { Component } from 'react';
import panels from '../data/panels';
import { panelsRequired, flowPerDay } from '../calc';
import panels from '../data/panels'

class SunTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      panels: panels
    }
  }

  getBatts = () => {
    const { autonomy, flowRate, batterySize, batteryEfficiency, safetyFactor } = this.props;
    const slope = +this.props.data['Slope'];
    const intercept = +this.props.data['Y Intercept'];

    // Previous Equation
    // const currentDraw = (flowRate * slope + intercept) * 24 * autonomy;

    // Sara's correction. currentDraw should be like in KOTesting.xlsx file. (flowRate * slope) + intercept. No other conversions.
    const currentDraw = flowRate * slope + intercept;

    // Previous Equation
    // const battWh = batterySize * (batteryEfficiency / 100) / safetyFactor;

    // Sara's correction. batterywattage =(C9*(C10/100))/C11
    const battWh = batterySize * (batteryEfficiency / 100) / safetyFactor;

    const batts = (currentDraw / battWh).toFixed(2);
    return batts;
  };

  /*
    getPanels has input panel_key, passed from inside the render function. Function should take the index key
    passed in as panel_key
  */

  getPanels = panel_key => {
    console.log('PANEL KEYS');
    console.log(panel_key);
    const { autonomy, runDuration, flowRate, safetyFactor, location } = this.props;
    const slope = +this.props.data['Slope'];
    const intercept = +this.props.data['Y Intercept'];

    return panelsRequired({
      autonomy, // # of days to run
      flowRate, // Pump flow rate used to calculate load
      safetyFactor, // autonomy safety factor used to derate battery
      runDuration, // number of hours to run a day (default is 24)
      sunlightType: this.props.type, // Min or Average
      panelType: panel, // Type of Panel 60W
      location, // Location object { }
      slope, // data from pump to calculate load based on flow
      intercept,
    }).toFixed(2);
  };

  getMaxGPD = numBatts => {
    const slope = +this.props.data['Slope'];
    const intercept = +this.props.data['Y Intercept'];
    const maxFlowRate = +this.props.data['Flow_max (GPD)'];
    return flowPerDay({
      numberOfBatteries: numBatts,
      slope, // data from pump to calculate load based on flow
      intercept, // data from pump to calulate load based on flow
      maxFlowRate,
      ...this.props,
    });
  };

  render() {
    const numBatts = this.getBatts();
    const maxGPD = this.getMaxGPD(numBatts);
    //TODO: need to replace panels variable with the value from fb
    const panelRows = Object.keys(panels)
      .sort(function(a, b) {
        return a - b;
      })
      .map((panel, idx) => {
        const numPanels = this.getPanels(panel);
        return (
          <tr key={idx}>
            <td>{maxGPD.toFixed(2)}</td>
            <td>{`${Math.ceil(numPanels)} (${numPanels})`}</td>
            <td>{`${Math.ceil(numBatts)} (${numBatts})`}</td>
          </tr>
        );
      });

    return (
      <div>
        {this.props.title && <h2>{this.props.title}</h2>}
        <table>
          <tbody>
            <tr>
              <th>Max Achievable Flow (GPD)</th>
              <th>Limiting Factor</th>
            </tr>
            {panelRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SunTable;
