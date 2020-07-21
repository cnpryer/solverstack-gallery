// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

function buildVrpMap(data) {

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var pallets = unpack(data, 'pallets'),
        lat = unpack(data, 'latitude'),
        lon = unpack(data, 'longitude'),
        cluster = unpack(data, 'cluster'),
        vehicle = unpack(data, 'vehicle_id'),
        stop_num = unpack(data, 'stop_num')
        size = [],
        hoverText = [],
        //scale = 2.* Math.max(null, pallets) / (100**2);
        scale = 2;

    for ( var i = 0 ; i < pallets.length; i++) {
        var currentSize = pallets[i] / scale;
        var currentText = "pallets: " + pallets[i]  
          + "<br>cluster: " + cluster[i] 
          + "<br>vehicle: " + vehicle[i]
          + "<br>seq: " + sequence[i]
          + "<br>stop_distance: " + stop_distance[i]
          + "<br>stop_load: " + stop_load[i];
        size.push(currentSize);
        hoverText.push(currentText);
    }
    
    // iterate over vehicles to add new traces
    var data = [];
    var vehicle_lat = [];
    var vehicle_lon = [];
    var vehicle_hover = [];
    var vehicle_bubble_size = [];
    var last_vehicle = vehicle[0];
    for ( var i = 0 ; i < pallets.length; i++) {
        if (vehicle[i] == last_vehicle) {

          vehicle_lat.push(lat[i]);
          vehicle_lon.push(lon[i]);
          vehicle_hover.push(hoverText[i]);
          vehicle_bubble_size.push(size[i]);

        } else {

          data.push({
            type: 'scattergeo',
            locationmode: 'USA-states',
            lat: vehicle_lat,
            lon: vehicle_lon,
            hoverinfo: 'text',
            text: vehicle_hover,
            name: last_vehicle,
            marker: {
                size: vehicle_bubble_size,
                line: {
                    color: 'black',
                    width: 0.5
                },
              }
            })
            
          var vehicle_lat = [lat[i]];
          var vehicle_lon = [lon[i]];
          var vehicle_hover = [hoverText[i]];
          var vehicle_bubble_size = [size[i]];
          var last_vehicle = vehicle[i];
         }
      }

    var layout = {
        title: 'dbscan segmented ortools vrp basic routing',
        showlegend: true,
        autosize: true,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 30,
            pad: 4
        },
        geo: {
            scope: 'usa',
            projection: {
                type: 'albers usa'
            },
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            subunitwidth: 1,
            countrywidth: 1,
            subunitcolor: 'rgb(255,255,255)',
            countrycolor: 'rgb(255,255,255)'
        },
    };
}
