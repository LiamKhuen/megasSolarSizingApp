import React, { Component } from 'react';
import { TreeNode } from '../components/tree-node';
import ReportDetail from './report-detail';

const directionMap = {
  '1': 'east',
  '2': 'west',
};

class ReportModal extends Component {
  render() {
    const className = this.props.visible ? 'report in' : 'report';
    const location = this.props.location;

    const filtered = this.props.sizing.reduce((sizing, el, idx) => {
      sizing[el.Motor] = sizing[el.Motor] || {};
      sizing[el.Motor][el.Controls] = sizing[el.Motor][el.Controls] || [];
      sizing[el.Motor][el.Controls].push(el);
      return sizing;
    }, {});

    const tree = Object.keys(filtered)
      .sort()
      .map((motor, midx) => {
        const ctrls = Object.keys(filtered[motor]).map((ctrl, cidx) => {
          const rows = filtered[motor][ctrl].map(row => {
            return <ReportDetail key={`row-${row['ID']}`} row={row} {...this.props} />;
          });

          return (
            <TreeNode key={`ctrl-${cidx}`} value={`Controls: ${ctrl}`}>
              {rows}
            </TreeNode>
          );
        });

        return (
          <TreeNode key={`motor-${midx}`} value={`Motor: ${motor}`}>
            {ctrls}
          </TreeNode>
        );
      });

    return (
      <div className={className}>
        <div className="container">
          <h1>
            Solar Sizing Report{' '}
            <button className="btn" onClick={() => this.props.setVisible(false)}>
              x
            </button>
          </h1>
          <h2>Location: {this.props.location.Location}</h2>
          <h2>PSI Discharge Pressure: {this.props.pressure}</h2>
          <h2>GPD Flowrate: {this.props.flowRate}</h2>
          <div className="half">
            <dl>
              <dt>Autonomy (Days):</dt>
              <dd>{this.props.autonomy}</dd>
              <dt>Run Duration (Hrs):</dt>
              <dd>{this.props.runDuration}</dd>
              <dt>Battery Size (Ah):</dt>
              <dd>{this.props.batterySize}</dd>
              <dt>Battery Efficiency (%):</dt>
              <dd>{this.props.batteryEfficiency}</dd>
              <dt>Safety Factor:</dt>
              <dd>{this.props.safetyFactor}</dd>
            </dl>
          </div>
          <div className="half">
            <dl>
              <dt>Sunlight, Min (Hrs):</dt>
              <dd>{location['Sunlight, Min']}</dd>
              <dt>Sunlight, Avg (Hrs):</dt>
              <dd>{location['Sunlight, Avg']}</dd>
              <dt>Panel Direction:</dt>
              <dd>
                {location['Declination']} deg. {directionMap[location['Declination Direction']]} of
                south
              </dd>
              <dt>Panel Tilt Angle:</dt>
              <dd>{location['Tilt Angle']} deg.</dd>
            </dl>
          </div>
          <div>{tree}</div>
          <button className="btn" onClick={() => this.props.setVisible(false)}>
            Close Report
          </button>
        </div>
      </div>
    );
  }
}

export default ReportModal;
