window.Collector = new Com.Collector();

window.Collector.add('sections', function(node){
    new App.Sections({
        'node' : node
    });
});