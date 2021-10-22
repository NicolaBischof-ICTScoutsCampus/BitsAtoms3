console.log('Loading...');

let table;

const canvasWidth = 600;
const canvasHeight = 600;



// https://p5js.org/reference/#/p5/loadTable
function preload() {
  table = loadTable('future_cities_data_truncated.csv', 'csv', 'header');
}


function setup() {
  createCanvas(canvasWidth, canvasHeight);

  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print('All cities:', table.getColumn('current_city'));
}

function draw() {
  background('#000000');
  noStroke();
  var maxTempMonthFuture = table.getColumn('future_Max_Temperature_of_Warmest_Month');
  let xVal = 100;
  let yVal = 150;
  fill(255,0,255);
  maxTempMonthFuture.forEach(element => {
    circle(xVal,yVal,int(element));
    xVal += 50;
    if(xVal >= 500){
      yVal += 50;
      xVal = 100;
    }
  });
  xVal = 100;
  yVal = 150;
  fill(0,0,0);
  var maxTempMonth = table.getColumn('Max_Temperature_of_Warmest_Month');
  maxTempMonth.forEach(element => {
    circle(xVal,yVal,int(element));
    xVal += 50;
    if(xVal >= 500){
      yVal += 50;
      xVal = 100;
    }
  });
  
}
