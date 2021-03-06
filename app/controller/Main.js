/*eslint angular/no-services: [2,{"directive":["$http","$q"],"controller":["$resource"]}]*/
/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,110]*/
/**
 * Main Controller
 */
(function() {
    angular
    .module('SolrHeatmapApp')
    .controller('MainController', ['Map', 'HeatMapSourceGenerator' , '$http', '$scope', '$rootScope',
        function(MapService, HeatMapSourceGeneratorService, $http, $scope, $rootScope) {

            var vm = this;

            solrHeatmapApp = vm;

            //  get the app config
            $http.get('./config/appConfig.json').
                success(function(data, status, headers, config) {
                    if (data && data.mapConfig) {
                        var mapConf = data.mapConfig,
                            appConf = data.appConfig,
                            bopwsConfig = data.bopwsConfig,
                            instructions = data.instructions;

                        // create the map with the given config
                        MapService.init({
                            mapConfig: mapConf
                        });
                        solrHeatmapApp.appConfig = appConf;
                        solrHeatmapApp.initMapConf = mapConf;
                        solrHeatmapApp.bopwsConfig = bopwsConfig;
                        solrHeatmapApp.instructions = instructions;

                        // fire event mapReady
                        $rootScope.$broadcast('mapReady', MapService.getMap());

                        MapService.getMap().getView()
                            .on('change:resolution', function(evt){
                                var existingHeatMapLayers = MapService.getLayersBy('name', 'HeatMapLayer');
                                if (existingHeatMapLayers &&
                                        existingHeatMapLayers.length > 0){
                                    var radius = 500 * evt.target.getResolution();
                                    var hmLayer = existingHeatMapLayers[0];
                                    if (radius > 15) {
                                        radius = 15;
                                    }
                                    hmLayer.setRadius(radius);
                                    hmLayer.setBlur(radius*2);
                                }

                                // check box of transform interaction
                                MapService.checkBoxOfTransformInteraction();
                            });
                        /*
                        * register some events
                        */
                        MapService.getMap().on('moveend', function(evt){
                            HeatMapSourceGeneratorService.performSearch();
                        });

                        MapService.getInteractionsByClass(ol.interaction.Transform)[0].on(
                            ['translateend', 'scaleend'], function (e) {
                                HeatMapSourceGeneratorService.performSearch();
                            });

                      // Prepared featureInfo (display number of elements)
                      //solrHeatmapApp.map.on('singleclick',
                      //                          MapService.displayFeatureInfo);

                    } else {
                        throw 'Could not find the mapConfig';
                    }
                }).
                error(function(data, status, headers, config) {
                    throw 'Error while loading the config.json';
                });
        }]
);
})();
