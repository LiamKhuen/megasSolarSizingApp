import React, {Component} from 'react';
//Changed from './App.css' to './index.css'
//import './index.css';   ---Commented out for testing purposes
import RequiredInfo from './sections/required-info';
import RunOptions from './sections/run-options';
import Pressure from './sections/pressure';
import Equipment from './sections/equipment';
import {Tab, TabButtonGroup, TabContent} from './components/tabs';
import ReportModal from './sections/report-modal';
import sizing from './data/sizing';
import locations from './data/solar-locations';



class App extends Component {
  constructor(props) {
    window.debug = () => {console.log(this.state);};
    super(props);
    this.state = {
      // Tabs
      tab: 'pressure',
      // Report modal
      showReport: false,
      // Inputs
      pressure: '0',
      location: [],
      locations: locations,
      runDuration: 24,
      autonomy: 3,
      batterySize: 100,
      batteryEfficiency: 80,
      safetyFactor: 1.2,
      flowRate: 0,
      panel: 60,

      batteries: 0,
      panels: 0,

      filterMotor: '',
      filterPlunger: '',
      filterHead: '',
      filterControl: '',

      sizing: sizing
    };

    this.changeTab = this.changeTab.bind(this);
    this.changePressureTab = this.changeTab('pressure');
    this.changeEquipmentTab = this.changeTab('equipment');
    this.showReport = this.setter.bind(this, 'showReport');

    this.setPressure = this.setter.bind(this, 'pressure');
    this.setRunDuration = this.setter.bind(this, 'runDuration');
    this.setAutonomy = this.setter.bind(this, 'autonomy');
    this.setBatterySize = this.setter.bind(this, 'batterySize');
    this.setBatteryEfficiency = this.setter.bind(this, 'batteryEfficiency');
    this.setSafetyFactor = this.setter.bind(this, 'safetyFactor');
    this.setFlowRate = this.setter.bind(this, 'flowRate');
    this.setPanel = this.setter.bind(this, 'panel');

    this.setPanels = this.setter.bind(this, 'panels');
    this.setBatteries = this.setter.bind(this, 'batteries');

    this.setFilterMotor = this.setter.bind(this, 'filterMotor');
    this.setFilterPlunger = this.setter.bind(this, 'filterPlunger');
    this.setFilterHead = this.setter.bind(this, 'filterHead');
    this.setFilterControl = this.setter.bind(this, 'filterControl');

    this.setLocation = this.setLocation.bind(this);
    this.getSizingData = this.getSizingData.bind(this);
    this.getFilteredSizing = this.getFilteredSizing.bind(this);
    this.getEquipFilteredSizing = this.getEquipFilteredSizing.bind(this);
  }

  componentDidMount() {
    this.sortLocations();
    this.setLocation(this.state.locations[0].Location);
  }

  sortLocations() {
    const solarLocations = this.state.locations.sort(function(a, b) {
      return a.Location.localeCompare(b.Location);
    });
    // This sets state correctly, but doesnt update the dropdown itself
    this.setState({locations: solarLocations});
  }

  setLocation(input) {
    const solarLocations = this.state.locations;
    const loc = solarLocations.find(l => {
      return l.Location === input;
    });
    this.setState({location: loc,});
  }

  getFilteredSizing() {
    const filterPressureAndFlowRate = row => {
      return (row['Pressure'] === this.state.pressure && (parseFloat(row['Flow_min (GPD)']) <= parseFloat(this.state.flowRate) && parseFloat(row['Flow_max (GPD)']) >= parseFloat(this.state.flowRate)));
    };
    // filters are named by attr stored in react state
    // cols are column names in solar-sizing.js
    const filterBy = (attr, col) => result => this.state[attr] === '' || this.state[attr] === result[col];

    this.setState({
      'sizing': sizing
    }, () => {
          const tmp_sizing = this.state.sizing;

          let filtered_tmp_sizing = tmp_sizing
            .filter(filterPressureAndFlowRate)
            .filter(filterBy('filterMotor', 'Motor'))
            .filter(filterBy('filterPlunger', 'Plunger'))
            .filter(filterBy('filterHead', 'Head'))
            .filter(filterBy('filterControl', 'Controls'));

          this.setState({
            'sizing': filtered_tmp_sizing
          }, () => { });
        })
  }

  getEquipFilteredSizing() {
    // filters are named by attr stored in react state
    // cols are column names in solar-sizing.js
    const filterBy = (attr, col) => result => this.state[attr] === '' || this.state[attr] === result[col];

    return sizing
      .filter(filterBy('filterMotor', 'Motor'))
      .filter(filterBy('filterPlunger', 'Plunger'))
      .filter(filterBy('filterHead', 'Head'))
      .filter(filterBy('filterControl', 'Controls'));
  }

  changeTab(name) {
    return e => {
      this.setState({tab: name,});
    };
  }

  setter(attr, input) {
    this.setState({
      [attr]: input
    }, () => {
          this.getFilteredSizing();
        });
  }

  getSizingData() {
    if (this.state.tab === 'equipment') {
      return this.getEquipFilteredSizing();
    } else{
        return this.getFilteredSizing();
      }
  }

  render() {
    // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    // if this becomes performance problem add something like memoize-one
    return (
      <div className = "App" > {' '} {
        this.state.showReport && (
          <ReportModal
            visible = { this.state.showReport}
            setVisible = { this.showReport }
            sizing = { this.state.sizing }
          { ...this.state } />
        )}
        {' '}
        {!this.state.showReport && (
          <div>
            <div className = "main-left">
              <div className = "left-container">
                {' '}
                <RequiredInfo
                  { ...this.state }
                  setPressure = { this.setPressure }
                setLocation = { this.setLocation } />
                {' '}
                <RunOptions
                  { ...this.state }
                  setRunDuration = { this.setRunDuration }
                  setAutonomy = { this.setAutonomy }
                  setBatterySize = { this.setBatterySize }
                  setBatteryEfficiency = { this.setBatteryEfficiency }
                  setSafetyFactor = { this.setSafetyFactor } />
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div className = "main-right">
              <div className = "right-container">
                <TabButtonGroup>
                  <Tab active = { this.state.tab === 'pressure' } onClick = { this.changePressureTab} >
                    Size by Application
                    {' '}
                  </Tab>
                  {' '}
                  <Tab active = { this.state.tab === 'equipment' } onClick = { this.changeEquipmentTab } >
                    Size by Equipment
                    {' '}
                  </Tab>
                  {' '}
                </TabButtonGroup>
                  {' '}
                  <TabContent active = { this.state.tab === 'pressure'} >
                    <Pressure
                      sizing = { this.state.sizing}
                      { ...this.state }
                      showReport = { this.showReport }
                      setPanel = { this.setPanel }
                      setFlowRate = { this.setFlowRate }
                      setFilterMotor = { this.setFilterMotor }
                      setFilterPlunger = { this.setFilterPlunger }
                      setFilterHead = { this.setFilterHead }
                      setFilterControl = { this.setFilterControl } />
                    {' '}
                </TabContent>
                {' '}
                <TabContent active = { this.state.tab === 'equipment' } >
                  <Equipment
                    sizing = { this.state.sizing }
                    { ...this.state }
                    showReport = { this.showReport }
                    setPanel = { this.setPanel }
                    setPanels = { this.setPanels }
                    setBatteries = { this.setBatteries }
                    setFilterMotor = { this.setFilterMotor }
                    setFilterPlunger = { this.setFilterPlunger }
                    setFilterHead = { this.setFilterHead }
                    setFlowRate = { this.setFlowRate }
                    setFilterControl = { this.setFilterControl } />
                  {' '}
                </TabContent>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
        )}
      {' '}
      </div>
    );}
}

export default App;
