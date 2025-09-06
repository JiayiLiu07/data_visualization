// 数据加载模块 - 用于读取真实CSV数据
class DataLoader {
    constructor() {
        this.csvData = [];
        this.isLoaded = false;
    }

    // 加载CSV文件
    async loadCSVFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            return this.parseCSV(csvText);
        } catch (error) {
            console.error('加载CSV文件失败:', error);
            return [];
        }
    }

    // 解析CSV文本
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
                let value = values[index];
                
                // 数据类型转换
                if (header === 'Age' || header === 'FAF' || header === 'NCP' || 
                    header === 'SMOKE' || header === 'SCC' || header === 'family_history_with_overweight' ||
                    header === 'FAVC' || header === 'FCVC' || header === 'obesity_level') {
                    value = parseInt(value) || 0;
                } else if (header === 'Height' || header === 'Weight' || header === 'CH2O' || 
                          header === 'TUE') {
                    value = parseFloat(value) || 0;
                }
                
                row[header] = value;
            });
            
            data.push(row);
        }
        
        return data;
    }

    // 获取随机样本
    getRandomSample(count = 10) {
        if (this.csvData.length === 0) return [];
        
        const shuffled = [...this.csvData].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 获取按条件筛选的数据
    getFilteredData(filters = {}) {
        let filtered = [...this.csvData];
        
        if (filters.ageRange) {
            filtered = filtered.filter(item => 
                item.Age >= filters.ageRange[0] && item.Age <= filters.ageRange[1]
            );
        }
        
        if (filters.obesityLevel !== undefined) {
            filtered = filtered.filter(item => item.obesity_level === filters.obesityLevel);
        }
        
        if (filters.gender) {
            filtered = filtered.filter(item => item.Gender === filters.gender);
        }
        
        return filtered;
    }

    // 获取统计数据
    getStatistics() {
        if (this.csvData.length === 0) return null;
        
        const ages = this.csvData.map(item => item.Age);
        const weights = this.csvData.map(item => item.Weight);
        const heights = this.csvData.map(item => item.Height);
        const bmis = this.csvData.map(item => item.Weight / (item.Height * item.Height));
        const obesityLevels = this.csvData.map(item => item.obesity_level);
        
        return {
            totalSamples: this.csvData.length,
            avgAge: ages.reduce((a, b) => a + b, 0) / ages.length,
            avgWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
            avgHeight: heights.reduce((a, b) => a + b, 0) / heights.length,
            avgBMI: bmis.reduce((a, b) => a + b, 0) / bmis.length,
            obesityDistribution: this.getObesityDistribution(),
            ageDistribution: this.getAgeDistribution(),
            genderDistribution: this.getGenderDistribution()
        };
    }

    // 获取肥胖等级分布
    getObesityDistribution() {
        const distribution = {};
        this.csvData.forEach(item => {
            const level = item.obesity_level;
            distribution[level] = (distribution[level] || 0) + 1;
        });
        return distribution;
    }

    // 获取年龄分布
    getAgeDistribution() {
        const distribution = {
            '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0
        };
        
        this.csvData.forEach(item => {
            if (item.Age <= 25) distribution['18-25']++;
            else if (item.Age <= 35) distribution['26-35']++;
            else if (item.Age <= 45) distribution['36-45']++;
            else if (item.Age <= 55) distribution['46-55']++;
            else distribution['56+']++;
        });
        
        return distribution;
    }

    // 获取性别分布
    getGenderDistribution() {
        const distribution = { 'Male': 0, 'Female': 0 };
        this.csvData.forEach(item => {
            distribution[item.Gender]++;
        });
        return distribution;
    }

    // 初始化数据加载
    async init() {
        try {
            console.log('🔄 正在加载真实数据...');
            this.csvData = await this.loadCSVFile('data/obesity_level_attribute_clean.csv');
            
            if (this.csvData.length === 0) {
                console.log('⚠️ 真实数据加载失败，使用样本数据...');
                this.csvData = await this.loadCSVFile('data/obesity_level_attribute_clean_sample.csv');
            }
            
            if (this.csvData.length > 0) {
                this.isLoaded = true;
                console.log(`✅ 成功加载 ${this.csvData.length} 条真实数据`);
                return true;
            } else {
                console.log('❌ 所有数据文件加载失败，使用模拟数据');
                return false;
            }
        } catch (error) {
            console.error('数据加载错误:', error);
            return false;
        }
    }

    // 获取真实数据样本用于实时更新
    getRealDataSample() {
        if (!this.isLoaded || this.csvData.length === 0) {
            return null;
        }
        
        // 随机选择一条数据
        const randomIndex = Math.floor(Math.random() * this.csvData.length);
        return { ...this.csvData[randomIndex] };
    }

    // 获取热力图数据
    getHeatmapData() {
        if (!this.isLoaded) return [];
        
        const ageGroups = ['18-25岁', '26-35岁', '36-45岁', '46-55岁', '56+岁'];
        const obesityLevels = ['体重不足', '正常体重', '一级超重', '二级超重', '肥胖I', '肥胖II', '肥胖III'];
        const heatmapData = [];
        
        for (let i = 0; i < ageGroups.length; i++) {
            for (let j = 0; j < obesityLevels.length; j++) {
                let count = 0;
                
                this.csvData.forEach(item => {
                    let ageGroup = 0;
                    if (item.Age <= 25) ageGroup = 0;
                    else if (item.Age <= 35) ageGroup = 1;
                    else if (item.Age <= 45) ageGroup = 2;
                    else if (item.Age <= 55) ageGroup = 3;
                    else ageGroup = 4;
                    
                    if (ageGroup === i && item.obesity_level === j) {
                        count++;
                    }
                });
                
                heatmapData.push([i, j, count]);
            }
        }
        
        return heatmapData;
    }
}

// 导出数据加载器
window.DataLoader = DataLoader;
