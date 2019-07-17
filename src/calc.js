//Commented out the import because compiler say it is not used
//import panels from './data/panels.js';

export function batteriesRequired(props) {
  // How many batteries are required for the the load
  const {autonomy, flowRate, batterySize, batteryEfficiency, safetyFactor, runDuration, slope, intercept} = props;
  // derate battery capacity based on efficiency and safety factor
  const batteryCapacity = batterySize * (batteryEfficiency / 100.0) / safetyFactor;
  // calculate pump load based desired flowRate and how long it is to run
  const currentDraw = (flowRate * slope + intercept) * runDuration * autonomy;

  //Adding some commas since this is a return statement
  return (currentDraw/batteryCapacity);
}

export function panelsRequired(props) {
  const {flowRate, safetyFactor, runDuration, sunlightType, panelType, location, slope, intercept} = props;
  // Solar panel output in A
  const panelOutput = panelType;
  // Sunlight received in hours
  const sunlight =+ props.location[sunlightType];
  const dailyOutput = (panelOutput * sunlight) / safetyFactor;
  // Calc current draw (Adays)
  const currentDraw = (flowRate * slope + intercept) * runDuration;
  const panelsRequired = currentDraw / dailyOutput;

  return panelsRequired;
}

export function flowPerDay(props) {
  const {slope, intercept, flowRate, maxFlowRate} = props;
  const dailyFlowRate = (Math.round(slope, 2) * Math.round(flowRate, 2)) + Math.round(intercept);

  if (dailyFlowRate > maxFlowRate) {
    return maxFlowRate;
  }
  console.log('dailyFlowRate  ' + dailyFlowRate);
  return dailyFlowRate;
}

export function panelsDailyOutput(props) {
  // Daily output for the panel array
  const {numberOfPanels, panelType, location, sunlightType, safetyFactor} = props;
  // Solar panel output in A
  const panelOutput = panelType;
  // Sunlight received in hours
  const sunlight = +location[sunlightType];
  const dailyOutput = ((panelOutput * sunlight) / safetyFactor) * numberOfPanels;

  return dailyOutput;
}
