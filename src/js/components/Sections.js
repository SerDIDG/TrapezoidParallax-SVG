cm.define('App.Sections', {
    'modules' : [
        'Params',
        'Events',
        'DataConfig',
        'DataNodes',
        'Stack'
    ],
    'events' : [
        'onRender'
    ],
    'params' : {
        'node' : cm.Node('div'),
        'name' : '',
        'angle' : 7,
        'parallax' : true
    }
},
function(params){
    var that = this;

    that.nodes = {
        'sections' : []
    };

    that.itemsLenth = 0;
    that.items = [];
    that.pageSize = {};
    that.scrollTop = 0;

    var init = function(){
        that.setParams(params);
        that.convertEvents(that.params['events']);
        that.getDataNodes(that.params['node']);
        that.getDataConfig(that.params['node']);
        render();
        that.addToStack(that.params['node']);
        that.triggerEvent('onRender');
    };

    var render = function(){
        process();
        cm.addEvent(window, 'resize', resizeEvent);
        if(that.params['parallax']){
            window.addEventListener('scroll', scrollEvent);
        }
    };

    var process = function(){
        var item;
        that.pageSize = cm.getPageSize();
        that.scrollTop = cm.getScrollTop(window);
        that.itemsLenth = that.nodes['sections'].length;
        cm.forEach(that.nodes['sections'], function(section, i){
            item = {
                'index' : i,
                'nodes' : section
            };
            resizeSection(item);
            if(that.params['parallax']){
                scrollSection(item);
            }
            that.items.push(item);
        });
    };

    var resizeSection = function(item){
        var points = [];
        // Get dimensions
        getSectionDimensions(item);
        // Set points
        if(!cm.isEven(item['index'])){
            points = [
                [0, item['cathetus']].join(','),
                [item['svgWidth'], 0].join(','),
                [item['svgWidth'], item['svgHeight']].join(','),
                [0, item['angleHeight']].join(',')
            ];
        }else{
            points = [
                [0, 0].join(','),
                [item['svgWidth'], item['cathetus']].join(','),
                [item['svgWidth'], item['angleHeight']].join(','),
                [0, item['svgHeight']].join(',')
            ];
        }
        // Resize svg
        item['nodes']['svg'].style.top = [-item['cathetusHalf'], 'px'].join('');
        item['nodes']['svg'].style.bottom = [-item['cathetusHalf'], 'px'].join('');
        item['nodes']['svg'].style.height = [item['svgHeight'], 'px'].join('');
        // Resize image
        item['nodes']['svg-image'].setAttribute('width', item['svgWidth']);
        item['nodes']['svg-image'].setAttribute('height', item['svgHeight']);
        // Prevent positions for first and last section
        if(item['index'] == 0){
            item['nodes']['svg'].style.top = 0;
            points[0] = [0, 0].join(',');
            points[1] = [item['svgWidth'], 0].join(',');
        }else if(item['index'] == that.itemsLenth -1){
            item['nodes']['svg'].style.bottom = 0;
            points[2] = [item['svgWidth'], item['svgHeight']].join(',');
            points[3] = [0, item['svgHeight']].join(',');
        }
        // Apply points
        item['nodes']['svg-mask'].setAttribute('points', points.join(' '));
    };

    var getSectionDimensions = function(item){
        item['rect'] = cm.getRect(item['nodes']['container']);
        item['cathetus'] = item['rect']['width'] * Math.tan(cm.toRadians(that.params['angle']));
        item['cathetusHalf'] = item['cathetus'] / 2;
        item['svgWidth'] = item['rect']['width'];
        item['svgHeight'] = (
            item['rect']['height'] +
            (
                item['index'] == 0 || item['index'] == that.itemsLenth - 1 ?
                    item['cathetusHalf'] :
                    item['cathetus']
            )
        );
        item['angleHeight'] = item['svgHeight'] - item['cathetus'];
        item['offsetTop'] = cm.getY(item['nodes']['container']);
    };

    var resizeAction = function(){
        that.pageSize = cm.getPageSize();
        that.scrollTop = cm.getScrollTop(window);
        cm.forEach(that.items, function(item){
            resizeSection(item);
            if(that.params['parallax']){
                scrollSection(item);
            }
        });
    };

    var scrollSection = function(item){
        //cm.setCSSTranslate(item['nodes']['svg-image'], 0, [that.scrollTop - item['offsetTop'], 'px'].join(''));
        item['nodes']['svg-image'].setAttribute('y', (that.scrollTop - item['offsetTop']));
    };

    var scrollAction = function(){
        that.scrollTop = cm.getScrollTop(window);
        cm.forEach(that.items, function(item){
            scrollSection(item);
        });
    };

    var resizeEvent = function(){
        animFrame(resizeAction);
    };

    var scrollEvent = function(){
        scrollAction();
    };

    /* ******* PUBLIC ******* */

    init();
});