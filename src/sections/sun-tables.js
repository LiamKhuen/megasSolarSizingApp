import React, { Component } from 'react';
import axios from 'axios';
import { panelsRequired, flowPerDay, batteriesRequired } from '../calc';

class SunTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panels: [],
    }

  }

  componentDidMount() {
    this.getData('panels');
  }

  getData(endpoint) {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}${endpoint}`)
      .then((res) => {
        this.setState({ [endpoint]: res.data.data.types });
      })
      .catch((err) => { console.log('Inside Suntablesjs  ' + err); });
  }

  getBatts = () => {
    const {
      autonomy,
      flowRate,
      batterySize,
      batteryEfficiency,
      safetyFactor,
      runDuration,
    } = this.props;

    const slope =+ this.props.data['Slope'];
    const intercept =+ this.props.data['Y Intercept'];
    return batteriesRequired({
      autonomy: autonomy, // # of days to run
      flowRate: flowRate, // Pump flow rate used to calculate load
      batterySize: batterySize, // Battery in Amp Hours
      batteryEfficiency: batteryEfficiency, // 0-100 used to derate battery
      safetyFactor: safetyFactor, // autonomy safety factor used to derate battery
      runDuration: runDuration, // number of hours to run a day (default is 24)
      slope, // data from pump to calculate load based on flow
      intercept, // data from pump to calulate load based on flow
    });
  };

  getPanels = panel_size => {
    // this is a hack solution to pass a value to the sunlightType, need to redo later
    const { autonomy, runDuration, flowRate, safetyFactor, location } = this.props;

    const slope =+ this.props.data['Slope'];
    const intercept =+ this.props.data['Y Intercept'];

    // test_panel.on("value", function(snapshot){
    //   console.log(snapshot.val()[panel_size]);
    // })
    return panelsRequired({
      autonomy: this.props.autonomy, // # of days to run
      flowRate: this.props.flowRate, // Pump flow rate used to calculate load
      safetyFactor: this.props.safetyFactor, // autonomy safety factor used to derate battery
      runDuration: this.props.runDuration, // number of hours to run a day (default is 24)
      sunlightType: this.props.sunlightType, // Min or Average
      panels: panel_size, // Type of Panel 60W
      location: this.props.location, // Location object { }
      slope, // data from pump to calculate load based on flow
      intercept,
    }).toFixed(2);
  };

  getMaxGPD = numBatts => {
    const slope =+ this.props.data['Slope'];
    const intercept =+ this.props.data['Y Intercept'];
    const maxFlowRate =+ this.props.data['Flow_max (GPD)'];
    const flowRate =+ this.props.flowRate;

    return flowPerDay({
      slope, // data from pump to calculate load based on flow
      intercept, // data from pump to calulate load based on flow
      flowRate,
      maxFlowRate,
      ...this.props,
    });
  };

  render() {
    const numBatts = this.getBatts();
    const maxGPD = this.getMaxGPD(numBatts);
    const panelRows = Object.keys(this.props.panels)
      .sort(function(a, b) {
        return a - b;
      })
      .map((panel, idx) => {
        const numPanels = this.getPanels(panel);
        return (
          <tr key={idx}>
            <td>{`${panel}W`}</td>
            <td>{`${Math.ceil(numPanels)} (${numPanels})`}</td>
            <td>{`${Math.ceil(numBatts)} (${numBatts})`}</td>
            <td>{maxGPD.toFixed(2)}</td>
          </tr>
        );
      });

    return (
      <div>
        {this.props.title && <h2>{this.props.title}</h2>}
        <table>
          <tbody>
            <tr>
              <th>Type</th>
              <th>Panels</th>
              <th>Batteries</th>
              <th>Max Estimated GPD</th>
            </tr>
            {panelRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SunTable;
