/*eslint angular/di: [2,"array"]*/
/*eslint max-len: [2,100]*/
/**
 * DatePickerCtrl Controller
 */
(function() {

angular
    .module('search_datepicker_component', [])
    .directive('datePicker', datePicker);

    function datePicker() {
      var directive = {
        controller: ExampleController,
        templateUrl: 'app/components/datepicker/datepicker.html',
        // template: '{{initialDateOptions}}',
        restrict: 'EA'
      };
      return directive;
    }

    ExampleController.$inject = ['HeatMapSourceGenerator', '$uibModal', '$scope'];
    function ExampleController(HeatMapSourceGeneratorService, $uibModal, $scope) {

            var vm = $scope;

            vm.initialDateOptions = {
                minDate: new Date('2013-01-01'),
                maxDate: new Date('2013-12-31')
            };

            vm.dateString = '[2000-01-01T00:00:00 TO 2016-12-31T00:00:00]';

            vm.dateOptions = {
                minDate: HeatMapSourceGeneratorService.getSearchObj().minDate,
                maxDate: HeatMapSourceGeneratorService.getSearchObj().maxDate,
                startingDay: 1, // Monday
                showWeeks: false
            };

            /**
             * Will be called on click on start datepicker.
             * `minDate` will be reset to the initial value (e.g. 2000-01-01),
             * `maxDate` will be adjusted with the `$scope.dte` value to
             *  restrict it not to be below the `minDate`.
             */
            vm.openStartDate = function() {
                vm.startDate.opened = true;
                vm.dateOptions.minDate = vm.initialDateOptions.minDate;
                vm.dateOptions.maxDate = vm.dte;
            };

            /**
             * Will be called on click on end datepicker.
             * `maxDate` will be reset to the initial value (e.g. 2016-12-31),
             * `minDate` will be adjusted with the `$scope.dts` value to
             *  restrict it not to be bigger than the `maxDate`.
             */
            vm.openEndDate = function() {
                vm.endDate.opened = true;
                vm.dateOptions.maxDate = vm.initialDateOptions.maxDate;
                vm.dateOptions.minDate = vm.dts;
            };

            vm.startDate = {
                opened: false
            };

            vm.endDate = {
                opened: false
            };

            /**
             * Set initial values for min and max dates in both of datepicker.
             */
            vm.setInitialDates = function(){
                vm.dts = vm.dateOptions.minDate;
                vm.dte = vm.dateOptions.maxDate;
            };

            vm.setInitialDates();

            /**
             * Will be fired after the start date was chosen.
             */
            vm.onChangeStartDate = function(){
                vm.setDateRange(vm.dts, vm.dte);
                HeatMapSourceGeneratorService.performSearch();
            };

            /**
             * Will be fired after the end date was chosen.
             */
            vm.onChangeEndDate = function(){
                vm.setDateRange(vm.dts, vm.dte);
                HeatMapSourceGeneratorService.performSearch();
            };

            /**
             * Help method that updates `searchObj` of the heatmap with
             * the current min and max dates.
             * @param {Date} minDate date value of the start datepicker
             * @param {Date} maxDate date value of the end datepicker
             */
            vm.setDateRange = function(minDate, maxDate){
                HeatMapSourceGeneratorService.setMinDate(minDate);
                HeatMapSourceGeneratorService.setMaxDate(maxDate);

                vm.dateString = '[' + minDate.toISOString().replace('.000Z','') + ' TO ' +
                                                maxDate.toISOString().replace('.000Z','') + ']';
            };

            vm.showInfo = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'infoPopup.html',
                    controller: 'InfoWindowController',
                    size: 'lg',
                    resolve: {
                        infoMsg: function(){
                            return solrHeatmapApp.instructions.datepicker.instruction;
                        },
                        toolName: function(){
                            return solrHeatmapApp.instructions.datepicker.toolTitle;
                        }
                    }
                });
            };

        }

})();
