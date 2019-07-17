import {
  batteriesRequired,
  panelsRequired,
  panelsDailyOutput,
  flowPerDay
} from '../calc';

test('batteriesRequired', function() {
  let autonomy = 3;
  let flowRate = 40;
  let batterySize = 100;
  let batteryEfficiency = 80;
  let safetyFactor = 1.2;
  let runDuration = 24;
  let slope = 0.13669;
  let intercept = -0.8337;

  let batteries = batteriesRequired({
    autonomy,
    flowRate,
    batterySize,
    batteryEfficiency,
    safetyFactor,
    runDuration,
    slope,
    intercept,
  });

  expect(batteries).toBeCloseTo(5.00, 2);

  autonomy = 1;
  batteries = batteriesRequired({
    autonomy,
    flowRate,
    batterySize,
    batteryEfficiency,
    safetyFactor,
    runDuration,
    slope,
    intercept,
  });

  expect(batteries).toBeCloseTo(1.67, 2);

  autonomy = 2;
  batteries = batteriesRequired({
    autonomy,
    flowRate,
    batterySize,
    batteryEfficiency,
    safetyFactor,
    runDuration,
    slope,
    intercept,
  });
  expect(batteries).toBeCloseTo(3.34, 2);

  autonomy = 2;
  batteryEfficiency = 40;
  batteries = batteriesRequired({
    autonomy,
    flowRate,
    batterySize,
    batteryEfficiency,
    safetyFactor,
    runDuration,
    slope,
    intercept,
  });
  expect(batteries).toBeCloseTo(6.67, 2);
});

test('panelsRequired', function() {
  let flowRate = 40;
  let safetyFactor = 1.2;
  let runDuration = 24;
  let slope = 0.13669;
  let intercept = -0.8337;
  let location = {
    State: 'Tx',
    City: 'Kenedy',
    'Sunlight, Min': '3.83',
    'Sunlight, Avg': '5.00',
    Location: 'Tx - Kenedy',
    Latitude: '28.81',
    Longitude: '-97.84',
    Declination: '4',
    'Tilt Angle': '25.00',
    'Declination Direction': '1',
  };
  let sunlightType = 'Sunlight, Min';
  let panelType = '60';

  let battery_test_1 = panelsRequired({
    flowRate,
    safetyFactor,
    runDuration,
    sunlightType, // Min or Average
    panelType, // Type of Panel 60W
    location, // Location object { }
    slope,
    intercept,
  });
  expect(battery_test_1).toBeCloseTo(0.58, 2);

  sunlightType = 'Sunlight, Avg';

  let battery_test_2 = panelsRequired({
    flowRate,
    safetyFactor,
    runDuration,
    sunlightType, // Min or Average
    panelType, // Type of Panel 60W
    location, // Location object { }
    slope,
    intercept,
  });
  expect(battery_test_2).toBeCloseTo(0.44, 2);
});

// Test the Flow Per Day function. This leads to the Max Flow Rate.
test('flowPerDay', function() {
  let flowRate = 40;
  let slope = 0.13669;
  let intercept = -0.8337;
  let maxFlowRate = 120;

  let rate = flowPerDay({
    slope, // data from pump to calculate load based on flow
    intercept, // data from pump to calulate load based on flow
    flowRate,
    maxFlowRate, // data from pump max flow rate
  });

  expect(rate).toBeCloseTo(4.6337, 3);
});

test('panelsDailyOutput', function() {
  let numberOfPanels = 2; // number of panels
  let panelType = 60; // Type of Panel 60W
  let location = {
    State: 'Tx',
    City: 'Kenedy',
    'Sunlight, Min': '3.83',
    'Sunlight, Avg': '5.00',
    Location: 'Tx - Kenedy',
    Latitude: '28.81',
    Longitude: '-97.84',
    Declination: '4',
    'Tilt Angle': '25.00',
    'Declination Direction': '1',
  };
  let sunlightType = 'Sunlight, Min'; // Min or Average
  let safetyFactor = 1.2; // autonomy safety factor used to derate battery

  let output = panelsDailyOutput({
    numberOfPanels, // number of panels
    panelType, // Type of Panel 60W
    location, // Location object { }
    sunlightType, // Min or Average
    safetyFactor, // autonomy safety factor used to derate battery
  });

  expect(output).toBeCloseTo(383.00, 2);
});
