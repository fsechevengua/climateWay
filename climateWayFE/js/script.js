// var dataX = ['x', '2016-06-26 17:00:00', '2016-06-26 17:10:00', '2016-06-26 17:20:00', '2016-06-26 17:30:00', '2016-06-26 17:40:00', '2016-06-26 17:50:00', '2016-06-26 18:00:00', '2016-06-26 18:10:00', '2016-06-26 18:20:00', '2016-06-26 18:30:00', '2016-06-26 18:40:00', '2016-06-26 18:50:00', '2016-06-26 19:00:00', '2016-06-26 19:10:00', '2016-06-26 19:20:00', '2016-06-26 19:30:00', '2016-06-26 19:40:00', '2016-06-26 19:50:00', '2016-06-26 20:00:00', '2016-06-26 20:10:00', '2016-06-26 20:20:00', '2016-06-26 20:30:00', '2016-06-26 20:40:00', '2016-06-26 20:50:00', '2016-06-26 21:00:00'];
//var dataX = ['x', '00:00:00', '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00'];
var dataX = ['x'];
var weatherDate = $.format.date(new Date(), "yyyy-MM-dd");

function generateTimeSeriesChart(DropAreaId, chartType, dataY) {
    var dataYAux = dataY.slice();
    var dataWihoutLabel = dataYAux.splice(1, dataYAux.length);
    var chart = c3.generate({
        bindto: "#" + DropAreaId,
        data: {
            x: 'x',
            xFormat: '%H:%M:%S',
            columns: [
                dataX,
                dataY,
            ],
            type: chartType
        },
        zoom: {
            enabled: true
        },
        axis: {
            x: {
                type: 'timeseries',
                localtime: true,
                tick: {
                    format: '%H:%M'
                },
            },
            y: {
                max: Math.max.apply(Math, dataWihoutLabel),
                min: Math.min.apply(Math, dataWihoutLabel),
            }
        }
    });
}

var viewData = [];

function generateTimeSeriesChartFullView(DropAreaId, chartType, dataY) {
    viewData = [dataX];
    var dataYAux = dataY.slice();
    var dataWihoutLabel = dataYAux.splice(1, dataYAux.length);
    viewData.push(dataY);
    console.log(Math.max.apply(Math, dataWihoutLabel));
    console.log(Math.min.apply(Math, dataWihoutLabel));

    var chart = c3.generate({
        bindto: "#" + DropAreaId,
        data: {
            x: 'x',
            xFormat: '%H:%M',
            columns: viewData
        },
        zoom: {
            enabled: true
        },
        axis: {
            x: {
                type: 'timeseries',
                localtime: true,
                tick: {
                    format: '%H:%M'
                },
            y: {
                max: Math.max.apply(Math, dataWihoutLabel) + 1,
                min: Math.min.apply(Math, dataWihoutLabel),
                }
            }
        }
    });
}

function generateChart(locator, xLabel, yLabel, chartType, dataY) {
    var dataYAux = dataY.slice();
    var dataWihoutLabel = dataYAux.splice(1, dataYAux.length);
    var chart = c3.generate({
        bindto: locator,
        size: {
            height: 600,
            width: 950
        },
        data: {
            x: 'x',
            xFormat: '%Y-%m-%d %H:%M:%S',
            columns: [
                dataX,
                dataY,
            ],
            type: chartType
        },
        zoom: {
            enabled: true
        },
        subchart: {
            show: true
        },
        axis: {
            x: {
                label: xLabel,
                type: 'timeseries',
                localtime: false,
                tick: {
                    format: '%H:%M'
                },
            },
            y: {
                label: yLabel,
                max: Math.max.apply(Math, dataWihoutLabel),
                min: Math.min.apply(Math, dataWihoutLabel),
            }
        }
    });
}

var lastChartModal = "";

$("#myModal").on('show.bs.modal', function(event) {

    d3.select("#chart svg").remove();
    var data = getWeatherData(event.relatedTarget.id);
   // var dataX = data[0];
    //var dataY = data[1];
    //$('.chart-name').html(dataY[0]);
    //lastChartModal = event.relatedTarget.id;
    //generateChart("#chart", "Tempo", dataY[0], 'area', dataY);
});

$(".chart-type").on('change', function() {
    $("select option:selected").each(function() {
        var data = getWeatherData(lastChartModal);
        var dataX = data[0];
        var dataY = data[1];
        generateChart("#chart", "Tempo", "Temperatura", $(this).val(), dataY);
    });
});

$("#myModal").on('hidden.bs.modal', function() {
    d3.select("#chart svg").remove();
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, ui) {
    ev.preventDefault();
    $('.chart-area').html("<div id=\"timeSeriesArea5\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\" class=\"drag-text\"><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></div>");
    var gridNumber = ev.dataTransfer.getData("text");
    var weatherVarName = document.getElementById(gridNumber).getElementsByClassName('location-font')[0].innerText;
    var sensor_code = document.getElementById(gridNumber).getAttribute('data-sensor');
    getWeatherData(gridNumber, weatherVarName, sensor_code, ev.currentTarget.id);
}

function windDirection() {
    var windDirection = 150;
    $('.towards-90-deg').removeClass('towards-90-deg').addClass('towards-' + windDirection + '-deg');
}

function generateLightnessBar(data) {
    var light = data;
    $('.progress-bar').gradientProgressBar({
        value: light * 100 / 100000, // percentage
        size: 150, // width
        fill: { // gradient fill
            gradient: ["yellow", "orange", "black"]
        }
    });
}

$('#datetimepicker1').datetimepicker({
    keepOpen: false,
    format: 'DD/MM/YYYY',
    useCurrent: true,
    defaultDate: new Date()
});

var changeDate = 0;

$("#datetimepicker1").on("dp.change", function(e) {
    if (changeDate === 0) {
        changeDate = 1;
        generateLightnessBar(200);
    } else {
        changeDate = 0;
        generateLightnessBar(560);
    }
    weatherDate = $.format.date(new Date(e.date), "yyyy-MM-dd");

    loadTableDate();
});

$("[name='my-checkbox']").bootstrapSwitch();

$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
    dataYFullView = [dataX];
    if (!state)
        $('.chart-area').html("<div id=\"timeSeriesArea5\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"><div class='drag-text'>Drag Here to generate chart</div></div>");
    else {
        $('.chart-area').html(
            "<div id=\"timeSeriesArea1\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\">" +
            "<div class='drag-text'>Drag Here to generate chart</div>" +
            "</div>" +
            "<div id=\"timeSeriesArea2\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\">" +
            "<div class='drag-text'>Drag Here to generate chart</div>" +
            "</div>" +
            "<div id=\"timeSeriesArea3\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\">" +
            "<div class='drag-text'>Drag Here to generate chart</div>" +
            "</div>" +
            "<div id=\"timeSeriesArea4\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\">" +
            "<div class='drag-text'>Drag Here to generate chart</div>" +
            "</div>");
    }
});

$(document).ready(function() {
    windDirection();
    generateLightnessBar(635);
});

document.addEventListener("getWeatherData", function(e) {
    var result = e.detail;
    var dataY = result.data;
    dataX = dataX.concat(result.dates);

    if (result.target == "timeSeriesArea5") {
        generateTimeSeriesChartFullView(result.target , "area", dataY);
    } else {
        generateTimeSeriesChart(result.target , "area", dataY);
    }
    $("#timeSeriesArea5").removeClass("drag-text");
});

function getWeatherData(chartId, weatherVarName, sensor_code, target) {

    var weatherDataCall = $.ajax({
        url: "http://localhost:9000/weatherData",
        type: "POST",
        data: {
            date: weatherDate,
            sensor_code: sensor_code
        }
    });
    var targetCellDrop = target;
    var weatherName = weatherVarName;
    var weatherDataPromise = Promise.resolve(weatherDataCall).then(function(data){
        var resObject = {
            data : [weatherName],
            dates:  [],
            target : ""
        };
        resObject.target = targetCellDrop;
        resObject.name = weatherName;
        data.payload.forEach(function(result) {
            resObject.data.push(result.payload);
            resObject.dates.push($.format.date(result.ts, "HH:mm"));
        });

        //Trigger event to send data to create chart
        var event = new CustomEvent("getWeatherData", { "detail": resObject });
        document.dispatchEvent(event);
    }, function(value) {
    });
}


function getCelcius() {
    var data = 29; //get data in database;
    return data;
}

function getPressure() {
    var data = 1.02; //get data in database;
    return data;
}

function getHumidity() {
    var data = "94%"; //get data in database;
    return data;
}

function getPrecipitation() {
    var data = 101; //get data in database;
    return data;
}

function getWindDirection() {
    var data = 145; //get data in database;
    return data;
}

function getWindSpeed() {
    var data = 11; //get data in database;
    return data;
}

function getLuminocity() {
    var data = 635; //get data in database;
    return data;
}

function getWaterLevel() {
    var data = 38; //get data in database;
    return data;
}

function getUV() {
    var data = 3; //get data in database;
    return data;
}

function getCO2() {
    var data = 302; //get data in database;
    return data;
}

function getCO() {
    var data = 239; //get data in database;
    return data;
}

function getSO2() {
    var data = 200; //get data in database;
    return data;
}

function getPM() {
    var data = 1000; //get data in database;
    return data;
}

function getRaining() {
    var data = 1; //get data in database;
    if (data == 1)
        return "Sim";
    else
        return "Não";
}

function loadTableDate() {
    if (changeDate == 0) {
        $(".celcius-data").html(getCelcius());
        $(".pressure-data").html(getPressure());
        $(".humidity-data").html(getHumidity());
        $(".precipitation-data").html(getPrecipitation());
        $('.towards-90-deg').removeClass('towards-90-deg').addClass('towards-' + getWindDirection() + '-deg');
        $(".wind-direction-data").html(getWindDirection());
        $(".wind-speed-data").html(getWindSpeed());
        $(".luminocity-data").html(getLuminocity());
        $(".uv-data").html(getUV());
        $(".co2-data").html(getCO2());
        $(".co-data").html(getCO());
        $(".so2-data").html(getSO2());
        $(".pm-data").html(getPM());
        $(".water-level-data").html(getWaterLevel());
        $(".pricipitation-data").html(getPrecipitation());
        $(".raining-data").html(getRaining());
    } else {
        $(".celcius-data").html(16);
        $(".pressure-data").html(1.01);
        $(".humidity-data").html("60%");
        $(".precipitation-data").html(75);
        $('.towards-90-deg').removeClass('towards-90-deg').addClass('towards-' + 100 + '-deg');
        $(".wind-direction-data").html(100);
        $(".wind-speed-data").html(4);
        $(".luminocity-data").html(200);
        $(".uv-data").html(2);
        $(".co2-data").html(212);
        $(".co-data").html(220);
        $(".so2-data").html(175);
        $(".pm-data").html(980);
        $(".water-level-data").html(37);
        $(".raining-data").html(getRaining());
    }
}

$(document).ready(function() {
    loadTableDate();
});

$("#dayslist a").click(function (e) {
  e.preventDefault()
  $(this).tab('show')
  if (changeDate === 0) {
        changeDate = 1;
        generateLightnessBar(200);
    } else {
        changeDate = 0;
        generateLightnessBar(560);
    }
    loadTableDate();
})

$( "li[role='presentation'] a" ).each(function( index ) {
    var now = new Date();
    now.setDate(now.getDate() + index - 6);
    now = $.format.date(now, "dd/MM/yyyy");
    this.append(now);
});

function generateMiniCharts(){
    var colors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    for(i=0; i < 12; i++){
        var minichart = c3.generate({
            bindto: "#minicharttest" + i,
            size: {
                height: 60,
                width: 200
            },
            data: {
                columns: [
                    ['sample', 30, 200, 100, 400, 150, 250]
                ],
                type: 'area-spline',
            },
            axis:{
                x:{
                    show:false
                },
                y:{
                    show:false
                }
            },
            legend: {
                show: false
            },
            color: {
                pattern: [colors[Math.floor(Math.random()*colors.length)]]
            },
            point: {
                show: false
            }
            
        });
    }
}
generateMiniCharts();


/*function generateChart(locator) {
    var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var format = d3.format("123");

    var x = d3.scale.ordinal()
        .rangeRoundBands([10, width], 0.2);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(format);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Temperatura:</strong> <span style='color:red'>" + d.temperature + "</span>";
      })

    var svg = d3.select(locator).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    // The new data variable.
    var data = [
      {letter: "20:21", temperature: 16},
      {letter: "20:19", temperature: 17},
      {letter: "20:17", temperature: 16},
      {letter: "20:15", temperature: 16},
      {letter: "20:13", temperature: 16},
      {letter: "20:11", temperature: 17},
      {letter: "20:09", temperature: 17},
      {letter: "20:07", temperature: 17},
      {letter: "20:05", temperature: 17},
      {letter: "20:03", temperature: 17},
      {letter: "20:01", temperature: 18},
      {letter: "19:59", temperature: 18},
      {letter: "19:57", temperature: 17},
      {letter: "19:55", temperature: 17},
      {letter: "19:53", temperature: 16},
      {letter: "19:51", temperature: 15},
      {letter: "19:49", temperature: 14},
      {letter: "19:47", temperature: 16},
      {letter: "19:45", temperature: 16},
      {letter: "19:43", temperature: 16}
    ];

    // The following code was contained in the callback function.
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.temperature; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("temperature");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.temperature); })
        .attr("height", function(d) { return height - y(d.temperature); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    function type(d) {
      d.temperature = +d.temperature;
      return d;
    }
}*/

/*function drop(ev, target) {
    ev.preventDefault();
    console.log(target.id);
    generateTimeSeriesChart(ev.target.id);

    //generateChart("#div1");
}*/




////////
/*var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.temperature); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [
  {time: "20:21", temperature: 16.00},
  {time: "20:19", temperature: 17.00},
  {time: "20:17", temperature: 16.00},
  {time: "20:15", temperature: 16.00},
  {time: "20:13", temperature: 16.00},
  {time: "20:11", temperature: 17.00},
  {time: "20:09", temperature: 17.00},
  {time: "20:07", temperature: 17.00},
  {time: "20:05", temperature: 17.00},
  {time: "20:03", temperature: 17.00},
  {time: "20:01", temperature: 18.00},
  {time: "19:59", temperature: 18.00},
  {time: "19:57", temperature: 17.00},
  {time: "19:55", temperature: 17.00},
  {time: "19:53", temperature: 16.00},
  {time: "19:51", temperature: 15.00},
  {time: "19:49", temperature: 14.00},
  {time: "19:47", temperature: 16.00},
  {time: "19:45", temperature: 16.00},
  {time: "19:43", temperature: 16.00},
  {time: "19:41", temperature: 16.00},
  {time: "19:39", temperature: 15.00},
  {time: "19:37", temperature: 15.00},
  {time: "19:35", temperature: 16.00},
  {time: "19:33", temperature: 16.00},
  {time: "19:31", temperature: 16.00}
];

x.domain(data.map(function(d) { return d.time; }));
y.domain([0, d3.max(data, function(d) { return d.temperature; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

function type(d) {
  d.time = d.time;
  d.temperature = +d.temperature;
  return d;
}*/
////
/*var data = [ { label: "Data Set 1",
               x: [0, 1, 2, 3, 4],
               y: [0, 1, 2, 3, 4] } ] ;
var xy_chart = d3_xy_chart()
    .width(960)
    .height(500)
    .xlabel("X Axis")
    .ylabel("Y Axis") ;
var svg = d3.select("body").append("svg")
    .datum(data)
    .call(xy_chart) ;

function d3_xy_chart() {
    var width = 640,
        height = 480,
        xlabel = "X Axis Label",
        ylabel = "Y Axis Label" ;

    function chart(selection) {
        selection.each(function(datasets) {
            //
            // Create the plot.
            //
            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var x_scale = d3.scale.linear()
                .range([0, innerwidth])
                .domain([ d3.min(datasets, function(d) { return d3.min(d.x); }),
                          d3.max(datasets, function(d) { return d3.max(d.x); }) ]) ;

            var y_scale = d3.scale.linear()
                .range([innerheight, 0])
                .domain([ d3.min(datasets, function(d) { return d3.min(d.y); }),
                          d3.max(datasets, function(d) { return d3.max(d.y); }) ]) ;

            var color_scale = d3.scale.category10()
                .domain(d3.range(datasets.length)) ;

            var x_axis = d3.svg.axis()
                .scale(x_scale)
                .orient("bottom") ;

            var y_axis = d3.svg.axis()
                .scale(y_scale)
                .orient("left") ;

            var x_grid = d3.svg.axis()
                .scale(x_scale)
                .orient("bottom")
                .tickSize(-innerheight)
                .tickFormat("") ;

            var y_grid = d3.svg.axis()
                .scale(y_scale)
                .orient("left")
                .tickSize(-innerwidth)
                .tickFormat("") ;

            var draw_line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x_scale(d[0]); })
                .y(function(d) { return y_scale(d[1]); }) ;

            var svg = d3.select(this)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

            svg.append("g")
                .attr("class", "x grid")
                .attr("transform", "translate(0," + innerheight + ")")
                .call(x_grid) ;

            svg.append("g")
                .attr("class", "y grid")
                .call(y_grid) ;

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerheight + ")")
                .call(x_axis)
                .append("text")
                .attr("dy", "-.71em")
                .attr("x", innerwidth)
                .style("text-anchor", "end")
                .text(xlabel) ;

            svg.append("g")
                .attr("class", "y axis")
                .call(y_axis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .text(ylabel) ;

            var data_lines = svg.selectAll(".d3_xy_chart_line")
                .data(datasets.map(function(d) {return d3.zip(d.x, d.y);}))
                .enter().append("g")
                .attr("class", "d3_xy_chart_line") ;

            data_lines.append("path")
                .attr("class", "line")
                .attr("d", function(d) {return draw_line(d); })
                .attr("stroke", function(_, i) {return color_scale(i);}) ;

            data_lines.append("text")
                .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                .attr("transform", function(d) {
                    return ( "translate(" + x_scale(d.final[0]) + "," +
                             y_scale(d.final[1]) + ")" ) ; })
                .attr("x", 3)
                .attr("dy", ".35em")
                .attr("fill", function(_, i) { return color_scale(i); })
                .text(function(d) { return d.name; }) ;

        }) ;
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.xlabel = function(value) {
        if(!arguments.length) return xlabel ;
        xlabel = value ;
        return chart ;
    } ;

    chart.ylabel = function(value) {
        if(!arguments.length) return ylabel ;
        ylabel = value ;
        return chart ;
    } ;

    return chart;
}*/

/*var data = [
  {time: "24-Apr-07", temperature: 16.00},
  {time: "23-Apr-07", temperature: 17.00},
  {time: "22-Apr-07", temperature: 16.00},
  {time: "21-Apr-07", temperature: 16.00},
  {time: "20-Apr-07", temperature: 16.00},
  {time: "19-Apr-07", temperature: 17.00},
  {time: "18-Apr-07", temperature: 17.00},
  {time: "17-Apr-07", temperature: 17.00},
  {time: "16-Apr-07", temperature: 17.00},
  {time: "15-Apr-07", temperature: 17.00},
  {time: "14-Apr-07", temperature: 18.00},
  {time: "13-Apr-07", temperature: 18.00},
  {time: "12-Apr-07", temperature: 17.00},
  {time: "11-Apr-07", temperature: 17.00},
  {time: "10-Apr-07", temperature: 16.00},
  {time: "09-Apr-07", temperature: 15.00},
  {time: "08-Apr-07", temperature: 14.00},
  {time: "07-Apr-07", temperature: 16.00},
  {time: "06-Apr-07", temperature: 16.00},
  {time: "05-Apr-07", temperature: 16.00},
  {time: "04-Apr-07", temperature: 16.00},
  {time: "03-Apr-07", temperature: 15.00},
  {time: "02-Apr-07", temperature: 15.00},
  {time: "01-Apr-07", temperature: 16.00}
];

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d-%b-%y");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.temperature); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.tsv("data.tsv", type, function(error, data) {
//  if (error) throw error;

//x.domain(d3.extent(data, function(d) { return d.time; }));
//y.domain(d3.extent(data, function(d) { return d.temperature; }));
x.domain(d3.extent(data, function(d) { return d.time; }));
y.domain(d3.extent(data, function(d) { return d.temperature; }));
//x.domain(data.map(function(d) { return d.time; }));
//y.domain([0, d3.max(data, function(d) { return d.temperature; })]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Price ($)");

svg.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);


function type(d) {
  d.time = formatDate.parse(d.time);
  d.temperature = +d.temperature;
  return d;
}*/
