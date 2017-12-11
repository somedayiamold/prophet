new Vue({
    el: '#app',
    data: function () {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                   }
                },
                {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            spanLeft: 5,
            spanRight: 19,
            collapse: false,
            menuOpeneds: ['modules'],
            type: 1,
            typeClick: false,
            idcs: [],
            idc: 1,
            format: 'YYYY-MM-DD HH:mm:ss',
            dateRange: [],
            timeFormatter: function (param) {
                let value = param.value;
                if (typeof(value) === 'undefined') {
                    return;
                }
                return '时间: ' + value[0] + '<br />数值: ' + value[1] + '<br />版本: '
                    + value[2];
            },
            versionFormatter: function (param) {
                let value = param.value;
                if (typeof(value) === 'undefined') {
                    return;
                }
                return '版本: ' + value[0] + '<br />数值: ' + value[1] + '<br />时间: '
                    + value[2];
            },
            tendencyChart: null,
            radarChart: null,
            typeName: '',
            tableData: []
        }
    },
    methods: {
        hideNavbar: function () {
            if (this.collapse) {
                this.collapse = false;
                this.spanLeft = 5;
                this.spanRight = 19;
            } else {
                this.collapse = true;
                this.spanLeft = 2;
                this.spanRight = 22;
            }
        },
        reload: function () {
            let _this = this;
            // get time trend
            let start = moment(this.dateRange[0]).format(this.format);
            let end = moment(this.dateRange[1]).format(this.format);
            let url = '/getTendency/?idcId=' + _this.idc + '&typeId=' + _this.type + '&start='
                + start + '&end=' + end;
            axios.get(url).then(function (response) {
                console.log(response.data);
                if (response.data.title.text.indexOf('时间维度') >= 0) {
                    response.data.tooltip.formatter = _this.timeFormatter;
                }
                if (response.data.title.text.indexOf('版本维度') >= 0) {
                    response.data.tooltip.formatter = _this.versionFormatter;
                }
                _this.tendencyChart = echarts.init(document.getElementById('trend'));
                _this.tendencyChart.setOption(response.data);
            }).catch(function (error) {
                console.log(error);
            });
            axios.get('/getRadar/?idcId=' + _this.idc + '&typeId=' + _this.type + '&start='
                + start + '&end=' + end).then(function (response) {
                console.log(response.data);
                _this.radarChart = echarts.init(document.getElementById('radar'));
                _this.radarChart.setOption(response.data);
            }).catch(function (error) {
                console.log(error);
            });
            axios.get('/getTable/?idcId=' + _this.idc + '&typeId=' + _this.type + '&start='
                + start + '&end=' + end).then(function (response) {
                console.log(response.data);
                _this.typeName = response.data.typeName;
                _this.tableData = response.data.tableData;
            }).catch(function (error) {
                console.log(error);
            });
            // get radar
            /*axios.get('/api/shell_cgi.sh?method=' + _this.module + '_time_radar1&idc=' + _this.idc + '&arg1=&arg2')
                .then(function (response) {
                var legend = []
                var selected = {}
                response.data.series.forEach(v => {
                	v.type = 'line'; 
                	v.areaStyle = {normal: {}}; 
                	v.smooth = true; 
                	legend.push(v.name);
                	selected[v.name] = false;
                });
                response.data.select.forEach( v => {selected[v] = true;});
                console.log(selected);
                _this.chartOption.xAxis[0].data = response.data.time;
                _this.chartOption.legend.data = legend;
                _this.chartOption.legend.selected = selected;
                _this.chartOption.series = response.data.series;
                var myChart = echarts.init(document.getElementById('radar1'));
                console.log(_this.radarOption);
                myChart.setOption(_this.radarOption);
            })
            .catch(function (error) {
                console.log(error);
            });*/
        },
        menuChange: function (menu) {
            console.log(menu);
            this.type = menu;
            console.log(this.typeClick);
            if (!this.typeClick) {
                return;
            }
            let _this = this;
            axios.get('/getIdcs/?typeId=' + menu).then(function (response) {
                _this.idcs = response.data;
                _this.idc = response.data[0].idc_id;
                _this.reload();
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        subMenuOpen: function (module) {
            console.log(module);
            // this.menuOpeneds = [];
            // this.menuOpeneds.push(module);
            this.typeClick = true;
        },
        subMenuClose: function (module) {
            console.log(module);
            // this.menuOpeneds = [];
            this.typeClick = false;
        },
        tabChange: function (tab) {
            console.log(tab.name);
            this.idc = tab.name;
            this.reload();
        },
        timeChange: function () {
            if (!this.typeClick) {
                return;
            }
            this.reload();
        }
    },
    mounted: function () {
        let dateArr = [];
        dateArr[0] = moment().add(-7, 'days');
        dateArr[1] = moment().format(this.format);
        this.dateRange = dateArr;
    }
})
