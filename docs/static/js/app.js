//function to show something on the page
var selectedID = 0
function inizialization(){
    PlotData();
};

// I am not sure this function will actually update anything since the node select the first value. I need to understand better the assignment
function UpdatePage_selection(){
    PlotData();
};
function PlotData(){
// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as fullData
    d3.json("../../samples.json").then((fullData) => {
        console.log(fullData);
        //saving the IDs for the dropdown menu
        ids = fullData.names;
        console.log(ids);
        // getting only the dataset exclusing information not relevant
        var sampleData = fullData.samples
        console.log(sampleData)
        // creating the dropdown menu
        // Creating a drop down menu containing the ids
        ids.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));
        // getting the selectedID
        if (selectedID === 0){
            selectedID = d3.selectAll("#selDataset").node().value;
        }else{
        selectedID = d3.select("#selDataset").property("optionChanged");
    }
        console.log(selectedID)
        d3.select("selected").remove();
        
        //filter the data for the current ID to get relavant information
        var filteredID = sampleData.filter(row => row.id == selectedID);
        console.log(filteredID)
        // create Trace for the horizontal bar chart
        var trace1 = {
            x: filteredID[0].sample_values.slice(0,10).reverse(),
            y: filteredID[0].otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString()),
            text: filteredID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h'
        };

        // data
        var dataPlot = [trace1];

        // Layout
        var layout = {
            title : 'Top 10 OTU samples',
            margin: {
                l: 75,
                r: 75,
                t: 60,
                b: 60
            }

        };
        // plotting the bar plot
        Plotly.newPlot("bar", dataPlot, layout);
        // working on the bubble chart
        var trace2 = {
            x: filteredID[0].otu_ids,
            y: filteredID[0].sample_values,
            text: filteredID[0].otu_labels,
            mode: 'markers',
            marker: {
              color: filteredID[0].otu_ids,
              size: filteredID[0].sample_values
            }
          };
          
          var data = [trace2];
          
          var layout = {
            title: `Results for test subject ID ${selectedID}`,
            showlegend: false,
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('bubble', data, layout);
    });
};
inizialization();
