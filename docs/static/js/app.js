url = window.location.href
console.log(url)
dataurl = url + '/samples.json'
//function to show something on the page
function inizialization(){
    PlotData();
};


// I am not sure this function will actually update anything since the node select the first value. I need to understand better the assignment
function optionChanged(){
    PlotData();
};


function PlotData(){
// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as fullData
    d3.json(dataurl).then((fullData) => {
        console.log(fullData);
        //saving the IDs for the dropdown menu
        ids = fullData.names;
        console.log(ids);
        // getting only the dataset exclusing information not relevant
        var sampleData = fullData.samples
        console.log(sampleData)
        var sampleMetadata = fullData.metadata
        // creating the dropdown menu
        // Creating a drop down menu containing the ids
        var dropdown = d3.select('#selDataset');
        dropdown.selectAll('option')
            .data(ids)
            .enter()
            .append('option')
            .text(id =>id)
            .attr("value", id=>id);
        // getting the selectedID        
       //dropdown.on('change', optionChanged()),
       var selectedID = d3.selectAll("#selDataset").node().value;
        console.log(selectedID)
        
        //filter the data for the current ID to get relavant information
        var filteredID = sampleData.filter(row => row.id == selectedID);
        var filteredMetadata = sampleMetadata.filter(row => row.id == selectedID);
        console.log(filteredID)
        console.log(filteredMetadata)
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

          //Display the sample metadata - individual demographic information
          // create a demographics object to add to panel body
        var dem = [
            `id: ${filteredMetadata[0].id}`,
            `ethnicity: ${filteredMetadata[0].ethnicity}`,
            `gender: ${filteredMetadata[0].gender}`,
            `age: ${filteredMetadata[0].age}`,
            `location: ${filteredMetadata[0].location}`,
            `bbtype: ${filteredMetadata[0].bbtype}`,
            `wfreq: ${filteredMetadata[0].wfreq}`
        ]
        //select the id to append the key value pair under demographics panel
        panelBody = d3.select("#sample-metadata")

        // remove the current demographic info to make way for new currentID
        panelBody.html("")
        
        //append the key value pairs from demographics into the demographics panel
        panelBody.append("body").html(dem.join("<br>"))
    });
};
inizialization();
