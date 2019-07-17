import React, { Component } from 'react';
import { TreeNode } from '../components/tree-node';
import SunTable from './sun-tables';

class ReportDetail extends Component {
  render() {
    const { flowRate, row } = this.props;
    const slope = parseFloat(row['Slope']);
    const intercept = parseFloat(row['Y Intercept']);
    const currentDraw = parseFloat(flowRate) * slope + intercept;

    return (
      <TreeNode value={`Plunger: ${row.Plunger} Head: ${row.Head}`}>
        <div className="third">
          <h3>Parameters</h3>
          <dl>
            <dt>Motor:</dt>
            <dd>{row.Motor}</dd>
            <dt>Controls:</dt>
            <dd>{row.Controls}</dd>
            <dt>Plunger:</dt>
            <dd>{row.Plunger}</dd>
            <dt>Head:</dt>
            <dd>{row.Head}</dd>
          </dl>
        </div>
        <div className="third">
          <h3>Pump Physical Characteristics</h3>
          <dl>
            <dt>Min Flow Rate (GPD):</dt>
            <dd>{row['Flow_min (GPD)']}</dd>
            <dt>Max Flow Rate (GPD):</dt>
            <dd>{row['Flow_max (GPD)']}</dd>
          </dl>
        </div>
        <div className="third">
          <h3>Specified Flow Characteristics</h3>
          <dl>
            <dt>Current Draw (Ah):</dt>
            <dd>{currentDraw.toFixed(2)}</dd>
          </dl>
        </div>

        <div className="half">
          <SunTable title="Minimum Sun" type="Sunlight, Min" data={row} {...this.props} />
        </div>

        <div className="half">
          <SunTable title="Average Sun" type="Sunlight, Avg" data={row} {...this.props} />
        </div>
      </TreeNode>
    );
  }
}
export default ReportDetail;
