// 数据处理模块
class DataProcessor {
    constructor() {
        this.data = [];
        this.processedData = {};
    }

    // 解析CSV数据
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',');
            const row = {};
            
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            data.push(row);
        }

        return data;
    }

    // 计算BMI
    calculateBMI(weight, height) {
        return (weight / (height * height)).toFixed(1);
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

    // 处理数据并生成统计信息
    processData(rawData) {
        this.data = rawData;
        
        const stats = {
            totalSamples: this.data.length,
            avgAge: 0,
            avgHeight: 0,
            avgWeight: 0,
            avgBMI: 0,
            obesityDistribution: {},
            genderDistribution: {},
            ageGroups: {},
            bmiRanges: {},
            healthIndicators: {
                avgFAF: 0,
                avgFCVC: 0,
                avgCH2O: 0,
                avgFAVC: 0,
                avgTUE: 0,
                avgFamilyHistory: 0
            }
        };

        let totalAge = 0, totalHeight = 0, totalWeight = 0, totalBMI = 0;
        let totalFAF = 0, totalFCVC = 0, totalCH2O = 0, totalFAVC = 0, totalTUE = 0, totalFamilyHistory = 0;

        this.data.forEach(row => {
            // 基础统计
            const age = parseFloat(row.Age) || 0;
            const height = parseFloat(row.Height) || 0;
            const weight = parseFloat(row.Weight) || 0;
            const bmi = parseFloat(this.calculateBMI(weight, height)) || 0;
            const obesityLevel = parseInt(row.obesity_level) || 0;
            const gender = row.Gender || 'Unknown';

            totalAge += age;
            totalHeight += height;
            totalWeight += weight;
            totalBMI += bmi;

            // 肥胖等级分布
            const levelDesc = this.getObesityLevelDescription(obesityLevel);
            stats.obesityDistribution[levelDesc] = (stats.obesityDistribution[levelDesc] || 0) + 1;

            // 性别分布
            stats.genderDistribution[gender] = (stats.genderDistribution[gender] || 0) + 1;

            // 年龄分组
            const ageGroup = this.getAgeGroup(age);
            stats.ageGroups[ageGroup] = (stats.ageGroups[ageGroup] || 0) + 1;

            // BMI范围分组
            const bmiRange = this.getBMIRange(bmi);
            stats.bmiRanges[bmiRange] = (stats.bmiRanges[bmiRange] || 0) + 1;

            // 健康指标
            totalFAF += parseFloat(row.FAF) || 0;
            totalFCVC += parseFloat(row.FCVC) || 0;
            totalCH2O += parseFloat(row.CH2O) || 0;
            totalFAVC += parseFloat(row.FAVC) || 0;
            totalTUE += parseFloat(row.TUE) || 0;
            totalFamilyHistory += parseFloat(row.family_history_with_overweight) || 0;
        });

        // 计算平均值
        const count = this.data.length;
        stats.avgAge = (totalAge / count).toFixed(1);
        stats.avgHeight = (totalHeight / count).toFixed(2);
        stats.avgWeight = (totalWeight / count).toFixed(1);
        stats.avgBMI = (totalBMI / count).toFixed(1);

        stats.healthIndicators.avgFAF = (totalFAF / count).toFixed(2);
        stats.healthIndicators.avgFCVC = (totalFCVC / count).toFixed(2);
        stats.healthIndicators.avgCH2O = (totalCH2O / count).toFixed(2);
        stats.healthIndicators.avgFAVC = (totalFAVC / count).toFixed(2);
        stats.healthIndicators.avgTUE = (totalTUE / count).toFixed(2);
        stats.healthIndicators.avgFamilyHistory = (totalFamilyHistory / count).toFixed(2);

        // 计算肥胖率
        const obesityCount = this.data.filter(row => {
            const level = parseInt(row.obesity_level) || 0;
            return level >= 2; // 超重和肥胖
        }).length;
        stats.obesityRate = ((obesityCount / count) * 100).toFixed(1);

        this.processedData = stats;
        return stats;
    }

    // 获取年龄分组
    getAgeGroup(age) {
        if (age < 20) return '20岁以下';
        if (age < 30) return '20-29岁';
        if (age < 40) return '30-39岁';
        if (age < 50) return '40-49岁';
        return '50岁以上';
    }

    // 获取BMI范围
    getBMIRange(bmi) {
        if (bmi < 18.5) return '偏瘦';
        if (bmi < 24) return '正常';
        if (bmi < 28) return '超重';
        return '肥胖';
    }

    // 生成地图数据
    generateMapData() {
        const cities = [
            { name: '北京', coords: [116.4074, 39.9042] },
            { name: '上海', coords: [121.4737, 31.2304] },
            { name: '广州', coords: [113.2644, 23.1291] },
            { name: '深圳', coords: [114.0579, 22.5431] },
            { name: '杭州', coords: [120.1551, 30.2741] },
            { name: '南京', coords: [118.7969, 32.0603] },
            { name: '武汉', coords: [114.3054, 30.5931] },
            { name: '成都', coords: [104.0668, 30.5728] },
            { name: '西安', coords: [108.9398, 34.3416] },
            { name: '重庆', coords: [106.5516, 29.5630] }
        ];

        return cities.map(city => {
            const randomData = this.data[Math.floor(Math.random() * this.data.length)];
            const weight = parseFloat(randomData.Weight) || 70;
            const obesityLevel = parseInt(randomData.obesity_level) || 1;
            
            return {
                name: city.name,
                value: [...city.coords, weight],
                obesity_level: obesityLevel,
                bmi: this.calculateBMI(weight, parseFloat(randomData.Height) || 1.7),
                age: parseFloat(randomData.Age) || 25,
                gender: randomData.Gender || 'Unknown'
            };
        });
    }

    // 获取雷达图数据
    getRadarData() {
        if (!this.processedData.healthIndicators) return [];
        
        const indicators = this.processedData.healthIndicators;
        return [
            parseFloat(indicators.avgFAF),
            parseFloat(indicators.avgFCVC),
            parseFloat(indicators.avgCH2O),
            parseFloat(indicators.avgFAVC),
            parseFloat(indicators.avgTUE),
            parseFloat(indicators.avgFamilyHistory)
        ];
    }

    // 获取饼图数据
    getPieData() {
        if (!this.processedData.obesityDistribution) return [];
        
        return Object.entries(this.processedData.obesityDistribution).map(([name, value]) => ({
            name,
            value
        }));
    }

    // 获取柱状图数据
    getBarData() {
        if (!this.processedData.ageGroups) return [];
        
        return Object.entries(this.processedData.ageGroups).map(([name, value]) => ({
            name,
            value
        }));
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataProcessor;
}
