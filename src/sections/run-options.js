import React, { Component } from 'react';

class RunOptions extends Component {
  constructor() {
    super();

    this.state = {
      runDurationError: false,
      autonomyError: false,
      batterySizeError: false,
      batteryEfficiencyError: false,
      safetyFactorError: false,
    };
  }

  changeHandler(method, e) {
    if (this.props[method]) {
      this.props[method](e.target.value);
    }
  }

  validationHandler(type, e) {
    const value = parseFloat(e.target.value);

    switch (type) {
      case 'runDuration':
        // RunDuration should be in invervals of half, and between 0 and 24 hours
        value % 0.5 !== 0 || value < 0 || value > 24
          ? this.setState({ runDurationError: true })
          : this.setState({ runDurationError: false });
        break;

      case 'autonomy':
        // Autonomy should be an integer and be between 0 and 10 days
        !Number.isInteger(value) || value < -1 || value > 11
          ? this.setState({ autonomyError: true })
          : this.setState({ autonomyError: false });
        break;

      case 'batterySize':
        // Battery size should be only 50, 100, 200, 250
        const batterySize = [50, 100, 200, 250];
        batterySize.indexOf(value) === -1
          ? this.setState({ batterySizeError: true })
          : this.setState({ batterySizeError: false });
        break;

      case 'batteryEfficiency':
        // Battery efficiency should be between 70% and 95%
        value < 0.7 || value > 0.95
          ? this.setState({ batteryEfficiencyError: true })
          : this.setState({ batteryEfficiencyError: false });
        break;

      case 'safetyFactor':
        // Safety Factor should be a decimal and no greater than 200%
        value < 0.0 || value > 2.0
          ? this.setState({ safetyFactorError: true })
          : this.setState({ safetyFactorError: false });
        break;

      default:
        console.error('no validation case written');
        break;
    }
  }

  render() {
    return (
      <div>
        <h2>Adjust Run Options</h2>

        <div className="form-control">
          <label>Run Duration (Hrs/Day)</label>
          <input
            type="text"
            name="runDuration"
            value={this.state.runDuration}
            onChange={
              (this.changeHandler.bind(this, 'setRunDuration'),
              this.validationHandler.bind(this, 'runDuration'))
            }
            className={this.state.runDurationError ? 'error' : ''}
            placeholder="24"
          />
          <div className={this.state.runDurationError ? 'show' : 'hide'}>
            <h2 className="msg">
              Run Duration should be in invervals of half (0.5) and between 0 to 24 hours. Contact
              support@megasmfg.com for other run duration cases.
            </h2>
          </div>
        </div>

        <div className="form-control">
          <label>Autonomy (Days)</label>
          <input
            type="text"
            value={this.state.autonomy}
            onChange={
              (this.changeHandler.bind(this, 'setAutonomy'),
              this.validationHandler.bind(this, 'autonomy'))
            }
            className={this.state.autonomyError ? 'error' : ''}
            placeholder="3"
          />
          <div className={this.state.autonomyError ? 'show' : 'hide'}>
            <h2 className="msg">
              Autonomy should be an integer and be between 0 and 10 days. Contact
              support@megasmfg.com for other autonomy cases.
            </h2>
          </div>
        </div>

        <div className="form-control">
          <label>Battery Size (Ah)</label>
          <input
            type="text"
            value={this.state.batterySize}
            onChange={
              (this.changeHandler.bind(this, 'setBatterySize'),
              this.validationHandler.bind(this, 'batterySize'))
            }
            className={this.state.batterySizeError ? 'error' : ''}
            placeholder="100"
          />
          <div className={this.state.batterySizeError ? 'show' : 'hide'}>
            <h2 className="msg">
              Battery size should be 50, 100, 200, or 250. Contact support@megasmfg.com for other
              battery size cases.
            </h2>
          </div>
        </div>

        <div className="form-control">
          <label>Battery Efficiency (%)</label>
          <input
            type="text"
            value={this.state.batteryEfficiency}
            onChange={
              (this.changeHandler.bind(this, 'setBatteryEfficiency'),
              this.validationHandler.bind(this, 'batteryEfficiency'))
            }
            className={this.state.batteryEfficiencyError ? 'error' : ''}
            placeholder="0.8"
          />
          <div className={this.state.batteryEfficiencyError ? 'show' : 'hide'}>
            <h2 className="msg">
              Battery efficiency should be between 70% and 95%. Contact support@megasmfg.com for
              other battery efficiency cases.
            </h2>
          </div>
        </div>

        <div className="form-control">
          <label>Safety Factor</label>
          <input
            type="text"
            value={this.state.safetyFactor}
            onChange={
              (this.changeHandler.bind(this, 'setSafetyFactor'),
              this.validationHandler.bind(this, 'safetyFactor'))
            }
            className={this.state.safetyFactorError ? 'error' : ''}
            placeholder="1.2"
          />
          <div className={this.state.safetyFactorError ? 'show' : 'hide'}>
            <h2 className="msg">
              Safety Factor should be a decimal and no greater than 2 (200%). Contact
              support@megasmfg.com for other safety factor cases.
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default RunOptions;
