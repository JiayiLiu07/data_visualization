// 图表相关功能模块
class ChartManager {
    constructor() {
        this.charts = {};
        this.currentChartType = 'heatmap';
        this.currentModalChart = null; // 跟踪当前弹窗图表
    }

    // 初始化所有图表
    initCharts() {
        this.initHeatmap();
        this.initRadarChart();
        this.initPieChart();
        this.initLineChart();
        this.initBarChart();
    }

    // 热力图
    initHeatmap() {
        const chart = echarts.init(document.getElementById('main-chart'));
        
        const heatmapData = this.generateHeatmapData();
        const categories = ['18-25岁', '26-35岁', '36-45岁', '46-55岁', '56+岁'];
        const obesityLevels = ['体重不足', '正常体重', '一级超重', '二级超重', '肥胖I', '肥胖II', '肥胖III'];

        const option = {
            backgroundColor: 'transparent',
            title: {
                text: '年龄-肥胖等级分布热力图',
                textStyle: { color: '#fff', fontSize: 16 },
                left: 'center',
                top: 10
            },
            tooltip: {
                position: 'top',
                formatter: function(params) {
                    return `${categories[params.data[0]]} - ${obesityLevels[params.data[1]]}<br/>人数: ${params.data[2]}`;
                }
            },
            grid: {
                height: '70%',
                top: '15%'
            },
            xAxis: {
                type: 'category',
                data: categories,
                splitArea: {
                    show: true
                },
                axisLabel: { color: '#fff', fontSize: 10 }
            },
            yAxis: {
                type: 'category',
                data: obesityLevels,
                splitArea: {
                    show: true
                },
                axisLabel: { color: '#fff', fontSize: 10 }
            },
            visualMap: {
                min: 0,
                max: 50,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '5%',
                textStyle: { color: '#fff' },
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                }
            },
            series: [{
                name: '肥胖分布',
                type: 'heatmap',
                data: heatmapData,
                label: {
                    show: true,
                    color: '#fff',
                    fontSize: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        chart.setOption(option);
        this.charts.mainChart = chart;
    }

    // 气泡图
    initBubbleChart() {
        const chart = echarts.init(document.getElementById('main-chart'));
        
        const bubbleData = [];
        const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '西安', '重庆'];
        
        cities.forEach((city, index) => {
            const weight = 60 + Math.random() * 40;
            const height = 1.6 + Math.random() * 0.3;
            const bmi = weight / (height * height);
            const obesityLevel = Math.floor(Math.random() * 7);
            const population = Math.floor(Math.random() * 1000) + 100;
            
            bubbleData.push({
                name: city,
                value: [weight, height, population],
                obesity_level: obesityLevel,
                bmi: bmi,
                itemStyle: {
                    color: this.getObesityColor(obesityLevel)
                }
            });
        });

        const option = {
            backgroundColor: 'transparent',
            title: {
                text: '城市肥胖风险气泡图',
                textStyle: { color: '#fff', fontSize: 16 },
                left: 'center',
                top: 10
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return `${params.data.name}<br/>
                            体重: ${params.data.value[0].toFixed(1)}kg<br/>
                            身高: ${params.data.value[1].toFixed(2)}m<br/>
                            样本数: ${params.data.value[2]}<br/>
                            BMI: ${params.data.bmi.toFixed(1)}<br/>
                            肥胖等级: ${this.getObesityLevelDescription(params.data.obesity_level)}`;
                }.bind(this)
            },
            xAxis: {
                type: 'value',
                name: '体重(kg)',
                nameTextStyle: { color: '#fff' },
                axisLabel: { color: '#fff' },
                axisLine: { lineStyle: { color: '#444' } },
                splitLine: { lineStyle: { color: '#333' } }
            },
            yAxis: {
                type: 'value',
                name: '身高(m)',
                nameTextStyle: { color: '#fff' },
                axisLabel: { color: '#fff' },
                axisLine: { lineStyle: { color: '#444' } },
                splitLine: { lineStyle: { color: '#333' } }
            },
            series: [{
                type: 'scatter',
                data: bubbleData,
                symbolSize: function (val) {
                    return val[2] / 20;
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 2,
                        shadowBlur: 10
                    }
                }
            }]
        };
        chart.setOption(option);
        this.charts.mainChart = chart;
    }

    // 矩形树图
    initTreemap() {
        const chart = echarts.init(document.getElementById('main-chart'));
        
        const treemapData = {
            name: '肥胖风险分布',
            children: [
                {
                    name: '体重不足',
                    value: 150,
                    itemStyle: { color: '#00ff00' }
                },
                {
                    name: '正常体重',
                    value: 300,
                    itemStyle: { color: '#ffff00' }
                },
                {
                    name: '一级超重',
                    value: 250,
                    itemStyle: { color: '#ffa500' }
                },
                {
                    name: '二级超重',
                    value: 200,
                    itemStyle: { color: '#ff4500' }
                },
                {
                    name: '肥胖类型I',
                    value: 180,
                    itemStyle: { color: '#ff0000' }
                },
                {
                    name: '肥胖类型II',
                    value: 120,
                    itemStyle: { color: '#8b0000' }
                },
                {
                    name: '肥胖类型III',
                    value: 80,
                    itemStyle: { color: '#4b0082' }
                }
            ]
        };

        const option = {
            backgroundColor: 'transparent',
            title: {
                text: '肥胖等级分布矩形树图',
                textStyle: { color: '#fff', fontSize: 16 },
                left: 'center',
                top: 10
            },
            tooltip: {
                formatter: '{b}: {c}人'
            },
            series: [{
                type: 'treemap',
                data: [treemapData],
                label: {
                    color: '#fff',
                    fontSize: 12
                },
                breadcrumb: {
                    show: false
                }
            }]
        };
        chart.setOption(option);
        this.charts.mainChart = chart;
    }

    // 旭日图
    initSunburst() {
        const chart = echarts.init(document.getElementById('main-chart'));
        
        // 基于真实数据生成旭日图数据
        const sunburstData = this.generateSunburstData();

        const option = {
            backgroundColor: 'transparent',
            title: {
                text: '肥胖风险分层旭日图',
                textStyle: { color: '#fff', fontSize: 16 },
                left: 'center',
                top: 10
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}人'
            },
            series: [{
                type: 'sunburst',
                data: [sunburstData],
                radius: ['20%', '90%'],
                label: {
                    color: '#fff',
                    fontSize: 10
                },
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                levels: [
                    {
                        // 第一层：肥胖风险（红色）
                        itemStyle: {
                            color: '#ff0000',
                            borderWidth: 0
                        },
                        label: {
                            rotate: 'tangential'
                        }
                    },
                    {
                        // 第二层：风险等级（蓝色、黄色、橙色）
                        itemStyle: {
                            color: function(params) {
                                const colors = ['#00d4ff', '#ffff00', '#ffa500'];
                                return colors[params.dataIndex % colors.length];
                            },
                            borderWidth: 0
                        }
                    },
                    {
                        // 第三层：具体肥胖等级（绿色系）
                        itemStyle: {
                            color: function(params) {
                                const colors = ['#00ff00', '#90ee90', '#32cd32', '#228b22', '#006400', '#004d00', '#003300'];
                                return colors[params.dataIndex % colors.length];
                            },
                            borderWidth: 0
                        }
                    }
                ]
            }]
        };
        chart.setOption(option);
        this.charts.mainChart = chart;
    }

    // 生成旭日图数据
    generateSunburstData() {
        if (!window.realData || window.realData.length === 0) {
            return {
                name: '肥胖风险',
                children: [
                    {
                        name: '低风险',
                        children: [
                            { name: '体重不足', value: 50 },
                            { name: '正常体重', value: 100 }
                        ]
                    },
                    {
                        name: '中风险',
                        children: [
                            { name: '一级超重', value: 80 },
                            { name: '二级超重', value: 60 }
                        ]
                    },
                    {
                        name: '高风险',
                        children: [
                            { name: '肥胖类型I', value: 40 },
                            { name: '肥胖类型II', value: 30 },
                            { name: '肥胖类型III', value: 20 }
                        ]
                    }
                ]
            };
        }

        // 统计各肥胖等级的人数
        const obesityStats = {};
        window.realData.forEach(item => {
            const level = item.obesity_level;
            obesityStats[level] = (obesityStats[level] || 0) + 1;
        });

        // 动态压缩数据范围，根据数据量调整压缩因子
        const maxValue = Math.max(...Object.values(obesityStats));
        let compressionFactor = 1;
        
        if (maxValue > 1000) {
            compressionFactor = maxValue / 50; // 压缩到最大50
        } else if (maxValue > 500) {
            compressionFactor = maxValue / 30; // 压缩到最大30
        } else if (maxValue > 200) {
            compressionFactor = maxValue / 20; // 压缩到最大20
        } else if (maxValue > 100) {
            compressionFactor = maxValue / 15; // 压缩到最大15
        } else {
            compressionFactor = 1; // 不压缩
        }
        
        const compressedStats = {};
        Object.keys(obesityStats).forEach(level => {
            compressedStats[level] = Math.max(1, Math.round(obesityStats[level] / compressionFactor));
        });

        // 按风险等级分组
        const lowRisk = [
            { name: '体重不足', value: compressedStats[0] || 0 },
            { name: '正常体重', value: compressedStats[1] || 0 }
        ];
        const mediumRisk = [
            { name: '一级超重', value: compressedStats[2] || 0 },
            { name: '二级超重', value: compressedStats[3] || 0 }
        ];
        const highRisk = [
            { name: '肥胖类型I', value: compressedStats[4] || 0 },
            { name: '肥胖类型II', value: compressedStats[5] || 0 },
            { name: '肥胖类型III', value: compressedStats[6] || 0 }
        ];

        return {
            name: '肥胖风险',
            children: [
                {
                    name: '低风险',
                    children: lowRisk
                },
                {
                    name: '中风险',
                    children: mediumRisk
                },
                {
                    name: '高风险',
                    children: highRisk
                }
            ]
        };
    }

    // 桑基图
    initSankey() {
        const chart = echarts.init(document.getElementById('main-chart'));
        
        const option = {
            backgroundColor: 'transparent',
            title: {
                text: '肥胖风险流向图',
                textStyle: { color: '#fff', fontSize: 16 },
                left: 'center',
                top: 10
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [{
                type: 'sankey',
                layout: 'none',
                data: [
                    { name: '18-25岁' },
                    { name: '26-35岁' },
                    { name: '36-45岁' },
                    { name: '46-55岁' },
                    { name: '56+岁' },
                    { name: '体重不足' },
                    { name: '正常体重' },
                    { name: '一级超重' },
                    { name: '二级超重' },
                    { name: '肥胖类型I' },
                    { name: '肥胖类型II' },
                    { name: '肥胖类型III' }
                ],
                links: [
                    { source: '18-25岁', target: '正常体重', value: 80 },
                    { source: '18-25岁', target: '一级超重', value: 20 },
                    { source: '26-35岁', target: '正常体重', value: 60 },
                    { source: '26-35岁', target: '一级超重', value: 30 },
                    { source: '26-35岁', target: '二级超重', value: 10 },
                    { source: '36-45岁', target: '一级超重', value: 40 },
                    { source: '36-45岁', target: '二级超重', value: 30 },
                    { source: '36-45岁', target: '肥胖类型I', value: 20 },
                    { source: '46-55岁', target: '二级超重', value: 35 },
                    { source: '46-55岁', target: '肥胖类型I', value: 40 },
                    { source: '46-55岁', target: '肥胖类型II', value: 25 },
                    { source: '56+岁', target: '肥胖类型I', value: 30 },
                    { source: '56+岁', target: '肥胖类型II', value: 35 },
                    { source: '56+岁', target: '肥胖类型III', value: 35 }
                ],
                emphasis: {
                    focus: 'adjacency'
                },
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5
                },
                label: {
                    color: '#fff',
                    fontSize: 10
                }
            }]
        };
        chart.setOption(option);
        this.charts.mainChart = chart;
    }

    // 雷达图
    initRadarChart() {
        const chart = echarts.init(document.getElementById('radar-chart'));
        
        const option = {
            backgroundColor: 'transparent',
            radar: {
                indicator: [
                    { name: '运动频率', max: 3 },
                    { name: '蔬菜摄入', max: 3 },
                    { name: '水分摄入', max: 3 },
                    { name: '高热量食物', max: 1 },
                    { name: '电子设备使用', max: 2 },
                    { name: '家族肥胖史', max: 1 }
                ],
                radius: '60%',
                splitNumber: 4,
                axisName: {
                    color: '#fff',
                    fontSize: 10
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            series: [{
                type: 'radar',
                data: [{
                    value: [1.5, 2.0, 1.8, 0.6, 1.2, 0.4],
                    name: '当前指标',
                    itemStyle: {
                        color: '#00d4ff'
                    },
                    areaStyle: {
                        color: 'rgba(0, 212, 255, 0.3)'
                    }
                }]
            }]
        };
        chart.setOption(option);
        this.charts.radarChart = chart;
    }

    // 饼图
    initPieChart() {
        const chart = echarts.init(document.getElementById('pie-chart'));
        
        const obesityDistribution = {};
        window.realData.forEach(item => {
            const level = item.obesity_level;
            const desc = this.getObesityLevelDescription(level);
            obesityDistribution[desc] = (obesityDistribution[desc] || 0) + 1;
        });

        const pieData = Object.entries(obesityDistribution).map(([name, value]) => ({
            name,
            value,
            itemStyle: {
                color: this.getObesityColor(Object.keys(obesityDistribution).indexOf(name))
            }
        }));

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [{
                name: '肥胖等级分布',
                type: 'pie',
                radius: '60%',
                data: pieData,
                label: {
                    color: '#fff',
                    fontSize: 10
                },
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                }
            }]
        };
        chart.setOption(option);
        this.charts.pieChart = chart;
    }

    // 折线图
    initLineChart() {
        const chart = echarts.init(document.getElementById('line-chart'));
        
        // 生成基于真实数据的BMI趋势
        const bmiTrendData = this.generateBMITrendData();
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function(params) {
                    return `时间: ${params[0].name}<br/>平均BMI: ${params[0].value.toFixed(2)}`;
                }
            },
            xAxis: {
                type: 'category',
                data: bmiTrendData.labels,
                axisLabel: { color: '#fff', fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                name: 'BMI',
                nameTextStyle: { color: '#fff', fontSize: 10 },
                axisLabel: { color: '#fff', fontSize: 10 },
                axisLine: { lineStyle: { color: '#444' } },
                splitLine: { lineStyle: { color: '#333' } },
                min: Math.floor(Math.min(...bmiTrendData.values) - 1),
                max: Math.ceil(Math.max(...bmiTrendData.values) + 1)
            },
            series: [{
                data: bmiTrendData.values,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { 
                    color: '#00d4ff',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                lineStyle: { 
                    color: '#00d4ff', 
                    width: 3,
                    shadowColor: 'rgba(0, 212, 255, 0.5)',
                    shadowBlur: 10
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
                        ]
                    }
                }
            }]
        };
        chart.setOption(option);
        this.charts.lineChart = chart;
    }

    // 生成BMI趋势数据
    generateBMITrendData() {
        if (!window.realData || window.realData.length === 0) {
            return {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                values: [25.0, 25.2, 25.5, 25.8, 26.0, 26.2]
            };
        }

        // 按时间分段计算平均BMI
        const timeSegments = 6;
        const segmentSize = Math.ceil(window.realData.length / timeSegments);
        const labels = [];
        const values = [];

        for (let i = 0; i < timeSegments; i++) {
            const startIndex = i * segmentSize;
            const endIndex = Math.min((i + 1) * segmentSize, window.realData.length);
            const segmentData = window.realData.slice(startIndex, endIndex);
            
            // 计算该时间段的平均BMI
            const avgBMI = segmentData.reduce((sum, item) => {
                const bmi = item.Weight / (item.Height * item.Height);
                return sum + bmi;
            }, 0) / segmentData.length;
            
            // 生成时间标签
            const hour = Math.floor((i / timeSegments) * 24);
            const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
            
            labels.push(timeLabel);
            values.push(avgBMI);
        }

        return { labels, values };
    }

    // 柱状图
    initBarChart() {
        const chart = echarts.init(document.getElementById('bar-chart'));
        
        // 生成基于真实数据的年龄分布
        const ageDistributionData = this.generateAgeDistributionData();
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return `年龄组: ${params[0].name}<br/>人数: ${params[0].value}`;
                }
            },
            xAxis: {
                type: 'category',
                data: ageDistributionData.labels,
                axisLabel: { color: '#fff', fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                name: '人数',
                nameTextStyle: { color: '#fff', fontSize: 10 },
                axisLabel: { color: '#fff', fontSize: 10 },
                axisLine: { lineStyle: { color: '#444' } },
                splitLine: { lineStyle: { color: '#333' } }
            },
            series: [{
                data: ageDistributionData.values,
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#00d4ff' },
                            { offset: 1, color: '#0099cc' }
                        ]
                    },
                    borderRadius: [4, 4, 0, 0]
                }
            }]
        };
        chart.setOption(option);
        this.charts.barChart = chart;
    }

    // 生成年龄分布数据
    generateAgeDistributionData() {
        if (!window.realData || window.realData.length === 0) {
            return {
                labels: ['18-25', '26-35', '36-45', '46-55', '56+'],
                values: [0, 0, 0, 0, 0]
            };
        }

        const ageGroups = {
            '18-25': 0,
            '26-35': 0,
            '36-45': 0,
            '46-55': 0,
            '56+': 0
        };

        window.realData.forEach(item => {
            if (item.Age <= 25) ageGroups['18-25']++;
            else if (item.Age <= 35) ageGroups['26-35']++;
            else if (item.Age <= 45) ageGroups['36-45']++;
            else if (item.Age <= 55) ageGroups['46-55']++;
            else ageGroups['56+']++;
        });

        return {
            labels: Object.keys(ageGroups),
            values: Object.values(ageGroups)
        };
    }

    // 切换图表
    switchChart(chartType) {
        this.currentChartType = chartType;
        
        switch(chartType) {
            case 'heatmap':
                this.initHeatmap();
                break;
            case 'bubble':
                this.initBubbleChart();
                break;
            case 'treemap':
                this.initTreemap();
                break;
            case 'sunburst':
                this.initSunburst();
                break;
            case 'sankey':
                this.initSankey();
                break;
        }
    }

    // 更新图表
    updateCharts() {
        // 更新雷达图数据
        const avgFAF = window.realData.reduce((sum, item) => sum + item.FAF, 0) / window.realData.length;
        const avgFCVC = window.realData.reduce((sum, item) => sum + item.FCVC, 0) / window.realData.length;
        const avgCH2O = window.realData.reduce((sum, item) => sum + item.CH2O, 0) / window.realData.length;
        const avgFAVC = window.realData.reduce((sum, item) => sum + item.FAVC, 0) / window.realData.length;
        const avgTUE = window.realData.reduce((sum, item) => sum + item.TUE, 0) / window.realData.length;
        const avgFamilyHistory = window.realData.reduce((sum, item) => sum + item.family_history_with_overweight, 0) / window.realData.length;

        this.charts.radarChart.setOption({
            series: [{
                data: [{
                    value: [avgFAF, avgFCVC, avgCH2O, avgFAVC, avgTUE, avgFamilyHistory],
                    name: '当前指标'
                }]
            }]
        });

        // 更新饼图
        this.initPieChart();

        // 更新BMI趋势图
        if (this.charts.lineChart) {
            const newBMITrendData = this.generateBMITrendData();
            this.charts.lineChart.setOption({
                xAxis: {
                    data: newBMITrendData.labels
                },
                yAxis: {
                    min: Math.floor(Math.min(...newBMITrendData.values) - 1),
                    max: Math.ceil(Math.max(...newBMITrendData.values) + 1)
                },
                series: [{
                    data: newBMITrendData.values
                }]
            });
        }

        // 更新年龄分布图
        if (this.charts.barChart) {
            const newAgeDistributionData = this.generateAgeDistributionData();
            this.charts.barChart.setOption({
                xAxis: {
                    data: newAgeDistributionData.labels
                },
                series: [{
                    data: newAgeDistributionData.values
                }]
            });
        }

        // 更新热力图（如果当前显示的是热力图）
        if (this.currentChartType === 'heatmap' && this.charts.mainChart) {
            const newHeatmapData = this.generateHeatmapData();
            const maxValue = Math.max(...newHeatmapData.map(item => item[2]));
            // 压缩数据范围，避免全是红色
            const compressedMax = Math.min(maxValue, 50);
            
            this.charts.mainChart.setOption({
                visualMap: {
                    max: compressedMax
                },
                series: [{
                    data: newHeatmapData
                }]
            });
        }

        // 更新旭日图（如果当前显示的是旭日图）
        if (this.currentChartType === 'sunburst' && this.charts.mainChart) {
            const newSunburstData = this.generateSunburstData();
            this.charts.mainChart.setOption({
                series: [{
                    data: [newSunburstData],
                    levels: [
                        {
                            // 第一层：肥胖风险（红色）
                            itemStyle: {
                                color: '#ff0000',
                                borderWidth: 0
                            },
                            label: {
                                rotate: 'tangential'
                            }
                        },
                        {
                            // 第二层：风险等级（蓝色、黄色、橙色）
                            itemStyle: {
                                color: function(params) {
                                    const colors = ['#00d4ff', '#ffff00', '#ffa500'];
                                    return colors[params.dataIndex % colors.length];
                                },
                                borderWidth: 0
                            }
                        },
                        {
                            // 第三层：具体肥胖等级（绿色系）
                            itemStyle: {
                                color: function(params) {
                                    const colors = ['#00ff00', '#90ee90', '#32cd32', '#228b22', '#006400', '#004d00', '#003300'];
                                    return colors[params.dataIndex % colors.length];
                                },
                                borderWidth: 0
                            }
                        }
                    ]
                }]
            });
        }
    }

    // 获取肥胖等级颜色
    getObesityColor(level) {
        const colors = ['#00ff00', '#ffff00', '#ffa500', '#ff4500', '#ff0000', '#8b0000', '#4b0082'];
        return colors[Math.min(level, colors.length - 1)];
    }

    // 生成热力图数据
    generateHeatmapData() {
        if (!window.realData || window.realData.length === 0) {
            return [];
        }

        const heatmapData = [];
        const categories = ['18-25岁', '26-35岁', '36-45岁', '46-55岁', '56+岁'];
        const obesityLevels = ['体重不足', '正常体重', '一级超重', '二级超重', '肥胖I', '肥胖II', '肥胖III'];
        
        // 统计每个年龄组和肥胖等级的分布
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < obesityLevels.length; j++) {
                let count = 0;
                
                window.realData.forEach(item => {
                    // 确定年龄组
                    let ageGroup = 0;
                    if (item.Age <= 25) ageGroup = 0;
                    else if (item.Age <= 35) ageGroup = 1;
                    else if (item.Age <= 45) ageGroup = 2;
                    else if (item.Age <= 55) ageGroup = 3;
                    else ageGroup = 4;
                    
                    // 如果年龄组和肥胖等级匹配，计数加1
                    if (ageGroup === i && item.obesity_level === j) {
                        count++;
                    }
                });
                
                heatmapData.push([i, j, count]);
            }
        }
        
        return heatmapData;
    }

    // 获取肥胖等级描述
    getObesityLevelDescription(level) {
        const descriptions = {
            0: '体重不足',
            1: '正常体重',
            2: '一级超重',
            3: '二级超重',
            4: '肥胖类型I',
            5: '肥胖类型II',
            6: '肥胖类型III'
        };
        return descriptions[level] || '未知';
    }

    // 窗口大小改变时调整图表
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }

    // 创建弹窗图表
    createModalChart(chartType, container) {
        console.log('创建弹窗图表:', chartType, '容器:', container);
        console.log('当前数据量:', window.realData ? window.realData.length : 0);
        console.log('容器当前尺寸:', container.offsetWidth, 'x', container.offsetHeight);
        
        // 清理之前的弹窗图表
        if (this.currentModalChart) {
            try {
                this.currentModalChart.dispose();
                console.log('清理之前的弹窗图表实例');
            } catch (error) {
                console.log('清理弹窗图表时出错:', error);
            }
            this.currentModalChart = null;
        }
        
        // 清理容器
        container.innerHTML = '';
        
        // 确保容器有基本样式
        container.style.width = '100%';
        container.style.height = '500px';
        container.style.position = 'relative';
        container.style.display = 'block';
        
        try {
            switch(chartType) {
                case 'radar':
                    this.createModalRadarChart(container);
                    break;
                case 'pie':
                    this.createModalPieChart(container);
                    break;
                case 'line':
                    this.createModalLineChart(container);
                    break;
                case 'bar':
                    this.createModalBarChart(container);
                    break;
                default:
                    console.error('未知的图表类型:', chartType);
                    container.innerHTML = '<div style="color: #fff; text-align: center; padding: 50px;">未知图表类型: ' + chartType + '</div>';
            }
        } catch (error) {
            console.error('创建弹窗图表失败:', error);
            container.innerHTML = '<div style="color: #fff; text-align: center; padding: 50px;">图表加载失败: ' + error.message + '</div>';
        }
    }

    // 创建弹窗雷达图
    createModalRadarChart(container) {
        console.log('创建弹窗雷达图，容器:', container);
        
        try {
            const chart = echarts.init(container);
            
            // 保存到跟踪器
            this.currentModalChart = chart;
            
            // 使用简化的固定数据
            const option = {
                backgroundColor: 'transparent',
                radar: {
                    indicator: [
                        { name: '运动频率', max: 3 },
                        { name: '蔬菜摄入', max: 3 },
                        { name: '水分摄入', max: 3 },
                        { name: '高热量食物', max: 1 },
                        { name: '电子设备使用', max: 2 },
                        { name: '家族肥胖史', max: 1 }
                    ],
                    radius: '70%',
                    splitNumber: 5,
                    axisName: {
                        color: '#fff',
                        fontSize: 14
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                series: [{
                    type: 'radar',
                    data: [{
                        value: [1.5, 2.0, 1.8, 0.6, 1.2, 0.4],
                        name: '当前指标',
                        itemStyle: {
                            color: '#00d4ff'
                        },
                        areaStyle: {
                            color: 'rgba(0, 212, 255, 0.4)'
                        }
                    }]
                }]
            };
            
            chart.setOption(option);
            console.log('雷达图创建成功');
        } catch (error) {
            console.error('雷达图创建失败:', error);
            container.innerHTML = '<div style="color: #fff; text-align: center; padding: 50px;">雷达图加载失败: ' + error.message + '</div>';
        }
    }

    // 创建弹窗饼图
    createModalPieChart(container) {
        console.log('创建弹窗饼图，容器:', container);
        console.log('容器尺寸:', container.offsetWidth, 'x', container.offsetHeight);
        
        try {
            const chart = echarts.init(container);
            console.log('ECharts实例创建成功:', chart);
            
            // 保存到跟踪器
            this.currentModalChart = chart;
            
            // 使用简化的固定数据
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                series: [{
                    name: '肥胖等级分布',
                    type: 'pie',
                    radius: '60%',
                    data: [
                        { name: '体重不足', value: 50, itemStyle: { color: '#00ff00' } },
                        { name: '正常体重', value: 100, itemStyle: { color: '#ffff00' } },
                        { name: '一级超重', value: 80, itemStyle: { color: '#ffa500' } },
                        { name: '二级超重', value: 60, itemStyle: { color: '#ff4500' } },
                        { name: '肥胖类型I', value: 40, itemStyle: { color: '#ff0000' } },
                        { name: '肥胖类型II', value: 30, itemStyle: { color: '#8b0000' } },
                        { name: '肥胖类型III', value: 20, itemStyle: { color: '#4b0082' } }
                    ],
                    label: {
                        color: '#fff',
                        fontSize: 14
                    },
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 3
                    }
                }]
            };
            
            console.log('设置饼图配置:', option);
            chart.setOption(option);
            console.log('饼图创建成功');
            
            // 强制重新渲染
            setTimeout(() => {
                chart.resize();
                console.log('饼图重新调整尺寸');
            }, 100);
            
        } catch (error) {
            console.error('饼图创建失败:', error);
            container.innerHTML = '<div style="color: #fff; text-align: center; padding: 50px;">饼图加载失败: ' + error.message + '</div>';
        }
    }

    // 创建弹窗折线图
    createModalLineChart(container) {
        console.log('创建弹窗折线图，容器:', container);
        
        try {
            const chart = echarts.init(container);
            
            // 保存到跟踪器
            this.currentModalChart = chart;
            
            // 使用简化的固定数据
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: function(params) {
                        return `时间: ${params[0].name}<br/>平均BMI: ${params[0].value.toFixed(2)}`;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    axisLabel: { color: '#fff', fontSize: 14 }
                },
                yAxis: {
                    type: 'value',
                    name: 'BMI',
                    nameTextStyle: { color: '#fff', fontSize: 14 },
                    axisLabel: { color: '#fff', fontSize: 14 },
                    axisLine: { lineStyle: { color: '#444' } },
                    splitLine: { lineStyle: { color: '#333' } },
                    min: 20,
                    max: 30
                },
                series: [{
                    data: [25.2, 25.8, 26.1, 26.5, 26.8, 27.1],
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 10,
                    itemStyle: { 
                        color: '#00d4ff',
                        borderColor: '#fff',
                        borderWidth: 3
                    },
                    lineStyle: { 
                        color: '#00d4ff', 
                        width: 4,
                        shadowColor: 'rgba(0, 212, 255, 0.5)',
                        shadowBlur: 15
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(0, 212, 255, 0.4)' },
                                { offset: 1, color: 'rgba(0, 212, 255, 0.1)' }
                            ]
                        }
                    }
                }]
            };
            
            chart.setOption(option);
            console.log('折线图创建成功');
        } catch (error) {
            console.error('折线图创建失败:', error);
            container.innerHTML = '<div style="color: #fff; text-align: center; padding: 50px;">折线图加载失败: ' + error.message + '</div>';
        }
    }

    // 创建弹窗柱状图
    createModalBarChart(container) {
        console.log('创建弹窗柱状图，容器:', container);
        
        try {
            const chart = echarts.init(container);
            
            // 保存到跟踪器
            this.currentModalChart = chart;
            
            // 使用简化的固定数据
            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        return `年龄组: ${params[0].name}<br/>人数: ${params[0].value}`;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['18-25', '26-35', '36-45', '46-55', '56+'],
                    axisLabel: { color: '#fff', fontSize: 14 }
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                    nameTextStyle: { color: '#fff', fontSize: 14 },
                    axisLabel: { color: '#fff', fontSize: 14 },
                    axisLine: { lineStyle: { color: '#444' } },
                    splitLine: { lineStyle: { color: '#333' } }
                },
                series: [{
                    data: [120, 200, 150, 80, 70],
                    type: 'bar',
                    barWidth: '60%',
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#00d4ff' },
                                { offset: 1, color: '#0099cc' }
                            ]
                        },
                        borderRadius: [6, 6, 0, 0]
                    }
                }]
            };
            
            chart.setOption(option);
            console.log('柱状图创建成功');
        } catch (error) {
            console.error('柱状图创建失败:', error);
            container.innerHTML = '<div style="color: #fff; text-align: center; padding: 50px;">柱状图加载失败: ' + error.message + '</div>';
        }
    }
}

// 导出图表管理器
window.ChartManager = ChartManager;
