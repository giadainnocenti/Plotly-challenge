function UpdatedID(){
    d3.event.preventDefault();
    PlotData();
};

function PlotData(){
// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as fullData
    d3.json("../../samples.json").then((fullData) => {
        // controlling the data
        console.log(fullData)
        //list of all the ids
        var ids = fullData.names;
        // getting only the dataset exclusing information not relevant
        var sampleData = fullData.samples
        console.log(sampleData)
        // Creating a drop down menu containing the ids
        ids.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));
        // storing the selected ID in a variable 
        var selectedID = d3.selectAll("#selDataset").node().value;
        console.log(selectedID)
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
    });
};
// run plot data to show somthing when the page loads.
PlotData();