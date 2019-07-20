function buildbubbleCharts(year) {
  d3.json(`/samplesforyear/${year}`).then((data) => {
      const Fertility = data.Fertility;
      const happiness = data.Happines_score;
      const country = data.Country;
      
    
   // Build a Bubble Chart
    var bubbleLayout = {
      title: 'Marker Size',
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "Happiness" },
      yaxis: { title: "Fertility" },
      height: 600,
      // width: 600
      
    };
    var bubbleData = [
      {
        x: happiness,
        y: Fertility,
        text: country,
        mode: "markers",
        marker: {
          size: Fertility,
           
          colorscale: "Earth"
          }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });

}

function buildMetadata(sample) {
    d3.json(`/samples/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });
  });
}


  function buildCharts(sample) {
    d3.json(`/samples/${sample}`).then((data) => {
      
      const Fertility = data.Fertility;
      const happiness = data.Happines_score;
      const country = data.Country;
      const fert1519 = data.Fertility_15_19;
      const fert2024 = data.Fertility_20_24;
      const fert2529 = data.Fertility_25_29;
      const fert3034 = data.Fertility_30_34;
      const fert3539 = data.Fertility_35_39;
      const fert4044 = data.Fertility_40_44;
      const fert4549 = data.Fertility_45_49;
      
      const fertlabels = ['15-19','20-24','25-29','30-34','35-39','40-44','45-49']
      const fertyear1 = [fert1519[0],fert2024[0],fert2529[0],fert3034[0],fert3539[0],fert4044[0],fert4549[0]]
      const fertyear2 = [fert1519[1],fert2024[1],fert2529[1],fert3034[1],fert3539[1],fert4044[1],fert4549[1]]
      const fertyear3 = [fert1519[2],fert2024[2],fert2529[2],fert3034[2],fert3539[2],fert4044[2],fert4549[2]]


       var trace1 = {
              x: ['2015', '2016', '2017'],
              y: Fertility,
              name: 'Fertility',
              type: 'bar'
            };
            
      var trace2 = {
              x: ['2015', '2016', '2017'],
              y: happiness,
              name: 'Happines',
              type: 'bar'
            };
            
      var data = [trace1, trace2];
      var layout = {barmode: 'group'};
            
      Plotly.newPlot('bar', data, layout);

     //Build a Pie Chart
     var pieData = [
       {
         values: fertyear1,
         labels: fertlabels,
         sort: false,
         type: "pie",
         name: '2015',
         domain: {
           row: 0,
           column: 0
         },
         hoverinfo: 'label+percent+name',
         textinfo: 'none'
       },
       {
        values: fertyear2,
        labels: fertlabels,
        sort: false,
        type: "pie",
        name: '2016',
        domain: {
          row: 0,
          column: 1
        },
        hoverinfo: 'label+percent+name',
        textinfo: 'none'
      },
      {
        values: fertyear3,
        labels: fertlabels,
        sort: false,
        type: "pie",
        name: '2017',
        domain: {
          row: 0,
          column: 2
        },
        hoverinfo: 'label+percent+name',
        textinfo: 'none'
      }
     ];

     var pieLayout = {
       title: 'Fertility by Age Group',
       margin: { t: 100, l: 0 },
       grid: {rows:1, columns: 3},
       annotations: [{
        "x": 0.15,
        "y": 0,
        "font": {
          "size": 16
        },
        "text": "2015",
        "xref": "paper",
        "yref": "paper",
        "xanchor": "center",
        "yanchor": "bottom",
        "showarrow": false
      },
      {
        "x": 0.5,
        "y": 0,
        "font": {
          "size": 16
        },
        "text": "2016",
        "xref": "paper",
        "yref": "paper",
        "xanchor": "center",
        "yanchor": "bottom",
        "showarrow": false
      },
      {
        "x": 0.85,
        "y": 0,
        "font": {
          "size": 16
        },
        "text": "2017",
        "xref": "paper",
        "yref": "paper",
        "xanchor": "center",
        "yanchor": "bottom",
        "showarrow": false
      }]
     };
     Plotly.plot("pie", pieData, pieLayout);
   });
 }

function init() {
  
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample)
        });
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
  });

  var selector1= d3.select("#selDataset1");
  d3.json("/years").then((sampleyear) => {
        sampleyear.forEach((years) => {
          selector1
            .append("option")
            .text(years) 
            .property("value", years)
        });
        const firstSampleyear = sampleyear[0];
        buildbubbleCharts(firstSampleyear);
  });
  
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  //buildMetadata(newSample);
}

function optionChanged2(newSampleyear) {
  // Fetch new data each time a new sample is selected
  buildbubbleCharts(newSampleyear);
};

// Initialize the dashboard
 init();
