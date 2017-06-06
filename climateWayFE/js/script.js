// var dataX = ['x', '2016-06-26 17:00:00', '2016-06-26 17:10:00', '2016-06-26 17:20:00', '2016-06-26 17:30:00', '2016-06-26 17:40:00', '2016-06-26 17:50:00', '2016-06-26 18:00:00', '2016-06-26 18:10:00', '2016-06-26 18:20:00', '2016-06-26 18:30:00', '2016-06-26 18:40:00', '2016-06-26 18:50:00', '2016-06-26 19:00:00', '2016-06-26 19:10:00', '2016-06-26 19:20:00', '2016-06-26 19:30:00', '2016-06-26 19:40:00', '2016-06-26 19:50:00', '2016-06-26 20:00:00', '2016-06-26 20:10:00', '2016-06-26 20:20:00', '2016-06-26 20:30:00', '2016-06-26 20:40:00', '2016-06-26 20:50:00', '2016-06-26 21:00:00'];
//var dataX = ['x', '00:00:00', '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00'];
var dataX = [];
var weatherDate = $.format.date(new Date(), "yyyy-MM-dd");

//Gerar gráfico em diálogo
var dialogData;
var dataYDialog;
function generateChartDialog(DropAreaId, chartType, dataY) {
    dialogData = [dataX];
    dataYDialog = dataY.slice();
    var dataWihoutLabel = dataYDialog.splice(1, dataYDialog.length);
    dialogData.push(dataY);
    c3.generate({
            bindto: "#" + DropAreaId,
            size: {
                height: 600,
                width: 950
            },
            data: {
                x: 'x',
                xFormat: '%H:%M',
                columns: dialogData,
                type: 'line'
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
};

//Trocar tipo de gráfico
$(".chart-type").on('change', function() {
    $("select option:selected").each(function() {
        var dataWihoutLabel = dataYDialog.splice(1, dataYDialog.length);
        c3.generate({
            bindto: "#chart-modal",
            size: {
                height: 600,
                width: 950
            },
            data: {
                x: 'x',
                xFormat: '%H:%M',
                columns: dialogData,
                type: $(this).val()
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
    });
});


//Cruzamento de dados
var viewData = [];

function generateChartDrop(DropAreaId, chartType, dataY) {
    if(viewData.length == 0)
        viewData = [dataX];
    var dataYAux = dataY.slice();
    var dataWihoutLabel = dataYAux.splice(1, dataYAux.length);
    viewData.push(dataY);
    c3.generate({
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

$("#myModal").on('show.bs.modal', function(ev) {
    d3.select("#chart-modal svg").remove();
    var gridNumber = ev.relatedTarget.id
    var weatherVarName = document.getElementById(gridNumber).getElementsByClassName('location-font')[0].innerText;
    var sensor_code = document.getElementById(gridNumber).getAttribute('data-sensor');
    $('#chart-modal').html("<div style='text-align: center; width: 950px; height: 600px; line-height: 600px; font-size: 30px;'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></div>");
    getWeatherData(weatherVarName, sensor_code, "chart-modal");
});

$("#myModal").on('hidden.bs.modal', function() {
    d3.select("#chart-modal svg").remove();
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
    getWeatherData(weatherVarName, sensor_code, ev.currentTarget.id);
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

$(document).ready(function() {
    windDirection();
    generateLightnessBar(635);
});

document.addEventListener("getWeatherData", function(e) {
    var result = e.detail;
    var dataY = result.data;
    //Limpa a variável x para receber as novas datas
    dataX = [];
    dataX.push("x");
    dataX = dataX.concat(result.dates);
    if (result.target == "timeSeriesArea5") {
        generateChartDrop(result.target , "area", dataY);
        $("#timeSeriesArea5").removeClass("drag-text");
    } else {
        generateChartDialog(result.target , "area", dataY);
    }
});

function getWeatherData(weatherVarName, sensor_code, target) {

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