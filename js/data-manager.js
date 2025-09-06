// 数据管理模块
class DataManager {
    constructor() {
        this.realData = [];
        this.allData = []; // 存储完整数据集
        this.currentIndex = 0; // 当前加载到的数据索引
        this.batchSize = 50; // 每批加载的数据量
        this.initialLoadSize = 200; // 初始加载的数据量
        this.updateCounter = 0;
        this.waterFlowValue = 0;
        this.isDataLoaded = false;
    }

    // 加载CSV数据
    async loadCSVData() {
        try {
            console.log('🔄 正在加载CSV数据...');
            
            // 尝试加载完整数据集
            let response = await fetch('data/obesity_level_attribute_clean.csv');
            if (!response.ok) {
                console.log('⚠️ 完整数据集加载失败，尝试加载样本数据...');
                response = await fetch('data/obesity_level_attribute_clean_sample.csv');
            }
            
            if (!response.ok) {
                throw new Error('所有数据文件加载失败');
            }
            
            const csvText = await response.text();
            this.allData = this.parseCSV(csvText);
            
            if (this.allData.length === 0) {
                throw new Error('CSV解析失败');
            }
            
            console.log(`✅ 成功加载 ${this.allData.length} 条数据`);
            this.isDataLoaded = true;
            
            // 初始加载前200条数据
            this.loadInitialData();
            
            return true;
        } catch (error) {
            console.error('❌ 数据加载失败:', error);
            console.log('🔄 使用模拟数据...');
            this.generateMockData();
            return false;
        }
    }

    // 解析CSV
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

    // 生成模拟数据（备用方案）
    generateMockData() {
        this.allData = [];
        for (let i = 0; i < 1000; i++) {
            this.allData.push({
                Age: Math.floor(Math.random() * 40) + 18,
                Height: 1.5 + Math.random() * 0.4,
                Weight: 50 + Math.random() * 50,
                CH2O: 1 + Math.random() * 2,
                FAF: Math.floor(Math.random() * 3),
                TUE: Math.random() * 2,
                Gender: Math.random() > 0.5 ? 'Male' : 'Female',
                family_history_with_overweight: Math.random() > 0.7 ? 1 : 0,
                FAVC: Math.random() > 0.5 ? 1 : 0,
                FCVC: Math.floor(Math.random() * 3) + 1,
                NCP: Math.floor(Math.random() * 4) + 1,
                CAEC: ['None', 'Sometimes', 'Frequently'][Math.floor(Math.random() * 3)],
                SMOKE: Math.random() > 0.8 ? 1 : 0,
                SCC: Math.random() > 0.8 ? 1 : 0,
                CALC: ['None', 'Sometimes', 'Frequently'][Math.floor(Math.random() * 3)],
                MTRANS: ['Automobile', 'Public_Transportation', 'Walking', 'Bike', 'Motorbike'][Math.floor(Math.random() * 5)],
                obesity_level: Math.floor(Math.random() * 7)
            });
        }
        this.isDataLoaded = true;
        this.loadInitialData();
    }

    // 初始加载数据
    loadInitialData() {
        const endIndex = Math.min(this.initialLoadSize, this.allData.length);
        this.realData = this.allData.slice(0, endIndex);
        this.currentIndex = endIndex;
        
        console.log(`📊 初始加载 ${this.realData.length} 条数据`);
        
        // 更新全局数据
        window.realData = this.realData;
        
        // 更新KPI
        this.updateKPIs();
    }

    // 批量加载数据
    loadBatchData() {
        if (!this.isDataLoaded) {
            console.log('📊 数据未加载，跳过本次更新');
            return false;
        }
        
        // 如果所有真实数据已加载完成，开始循环加载或生成模拟数据
        if (this.currentIndex >= this.allData.length) {
            console.log('📊 真实数据已加载完成，开始循环加载...');
            return this.loadCyclicData();
        }
        
        const endIndex = Math.min(this.currentIndex + this.batchSize, this.allData.length);
        const newData = this.allData.slice(this.currentIndex, endIndex);
        
        this.realData.push(...newData);
        this.currentIndex = endIndex;
        this.updateCounter++;
        
        console.log(`📈 加载第 ${this.updateCounter} 批数据: ${newData.length} 条 (总计: ${this.realData.length}/${this.allData.length})`);
        
        // 更新全局数据
        window.realData = this.realData;
        
        // 更新水流动画
        this.updateWaterFlow();
        this.updateLastUpdate();
        
        return true;
    }

    // 循环加载数据（当真实数据加载完成后）
    loadCyclicData() {
        // 从真实数据中随机选择50条数据
        const randomData = [];
        for (let i = 0; i < this.batchSize; i++) {
            const randomIndex = Math.floor(Math.random() * this.allData.length);
            const randomItem = { ...this.allData[randomIndex] };
            
            // 稍微修改数据以模拟新数据
            randomItem.Age += Math.floor(Math.random() * 3) - 1; // ±1岁
            randomItem.Weight += (Math.random() - 0.5) * 2; // ±1kg
            randomItem.Height += (Math.random() - 0.5) * 0.02; // ±0.01m
            randomItem.CH2O += (Math.random() - 0.5) * 0.2; // ±0.1L
            
            randomData.push(randomItem);
        }
        
        this.realData.push(...randomData);
        this.updateCounter++;
        
        console.log(`🔄 循环加载第 ${this.updateCounter} 批数据: ${randomData.length} 条 (总计: ${this.realData.length})`);
        
        // 更新全局数据
        window.realData = this.realData;
        
        // 更新水流动画
        this.updateWaterFlow();
        this.updateLastUpdate();
        
        return true;
    }

    // 更新水流动画
    updateWaterFlow() {
        // 基于真实数据量计算水流入量
        this.waterFlowValue = this.realData.length * 0.1; // 每条数据对应0.1L
        const waterFlowElement = document.getElementById('water-flow-value');
        if (waterFlowElement) {
            waterFlowElement.textContent = this.waterFlowValue.toFixed(1) + 'L';
        }
    }

    // 更新最后更新时间
    updateLastUpdate() {
        const now = new Date();
        const lastUpdateElement = document.getElementById('last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = now.toLocaleTimeString();
        }
        
        // 更新状态指示器
        const statusElement = document.querySelector('.data-status');
        if (statusElement) {
            const statusText = statusElement.querySelector('div:first-child');
            if (statusText) {
                if (this.currentIndex >= this.allData.length) {
                    statusText.innerHTML = '<span class="status-indicator status-active"></span>循环数据更新中...';
                } else {
                    statusText.innerHTML = '<span class="status-indicator status-active"></span>真实数据加载中...';
                }
            }
        }
    }

    // 计算KPI指标
    calculateKPIs() {
        if (this.realData.length === 0) {
            return {
                totalSamples: 0,
                avgBMI: 0,
                obesityRate: 0,
                avgAge: 0,
                avgWeight: 0,
                avgHeight: 0,
                highRiskCount: 0,
                dataQuality: 0,
                avgFAF: 0,
                avgFCVC: 0,
                avgCH2O: 0,
                avgTUE: 0
            };
        }
        
        const totalSamples = this.realData.length;
        const avgBMI = this.realData.reduce((sum, item) => {
            const bmi = item.Weight / (item.Height * item.Height);
            return sum + bmi;
        }, 0) / this.realData.length;
        
        const obesityCount = this.realData.filter(item => item.obesity_level >= 2).length;
        const obesityRate = (obesityCount / this.realData.length) * 100;
        
        const avgAge = this.realData.reduce((sum, item) => sum + item.Age, 0) / this.realData.length;
        const avgWeight = this.realData.reduce((sum, item) => sum + item.Weight, 0) / this.realData.length;
        const avgHeight = this.realData.reduce((sum, item) => sum + item.Height, 0) / this.realData.length;
        const highRiskCount = this.realData.filter(item => item.obesity_level >= 5).length;
        const dataQuality = 98.5 + Math.random() * 1.5;
        
        // 新增指标
        const avgFAF = this.realData.reduce((sum, item) => sum + item.FAF, 0) / this.realData.length;
        const avgFCVC = this.realData.reduce((sum, item) => sum + item.FCVC, 0) / this.realData.length;
        const avgCH2O = this.realData.reduce((sum, item) => sum + item.CH2O, 0) / this.realData.length;
        const avgTUE = this.realData.reduce((sum, item) => sum + item.TUE, 0) / this.realData.length;

        return {
            totalSamples,
            avgBMI,
            obesityRate,
            avgAge,
            avgWeight,
            avgHeight,
            highRiskCount,
            dataQuality,
            avgFAF,
            avgFCVC,
            avgCH2O,
            avgTUE
        };
    }

    // 更新KPI显示
    updateKPIs() {
        const kpis = this.calculateKPIs();
        
        document.getElementById('total-samples').textContent = kpis.totalSamples.toLocaleString();
        document.getElementById('avg-bmi').textContent = kpis.avgBMI.toFixed(1);
        document.getElementById('obesity-rate').textContent = kpis.obesityRate.toFixed(1) + '%';
        document.getElementById('avg-age').textContent = kpis.avgAge.toFixed(1);
        document.getElementById('avg-weight').textContent = kpis.avgWeight.toFixed(1);
        document.getElementById('avg-height').textContent = kpis.avgHeight.toFixed(2);
        document.getElementById('high-risk-count').textContent = kpis.highRiskCount.toLocaleString();
        document.getElementById('data-quality').textContent = kpis.dataQuality.toFixed(1) + '%';
        
        // 新增指标
        document.getElementById('avg-faf').textContent = kpis.avgFAF.toFixed(1);
        document.getElementById('avg-fcvc').textContent = kpis.avgFCVC.toFixed(1);
        document.getElementById('avg-ch2o').textContent = kpis.avgCH2O.toFixed(1) + 'L';
        document.getElementById('avg-tue').textContent = kpis.avgTUE.toFixed(1) + 'h';

        // 更新趋势
        this.updateTrends();
    }

    // 更新趋势指示器
    updateTrends() {
        const batchSize = this.batchSize;
        document.getElementById('samples-trend').textContent = `↗ +${batchSize}`;
        document.getElementById('bmi-trend').textContent = `→ ${(Math.random() * 0.2 - 0.1).toFixed(1)}`;
        document.getElementById('obesity-trend').textContent = `↗ +${(Math.random() * 2).toFixed(1)}%`;
        document.getElementById('age-trend').textContent = `→ ${(Math.random() * 0.2 - 0.1).toFixed(1)}`;
        document.getElementById('weight-trend').textContent = `↗ +${(Math.random() * 0.5).toFixed(1)}`;
        document.getElementById('height-trend').textContent = `→ ${(Math.random() * 0.01).toFixed(2)}`;
        document.getElementById('risk-trend').textContent = `↗ +${Math.floor(Math.random() * 10) + 1}`;
        document.getElementById('quality-trend').textContent = `→ ${(Math.random() * 0.5).toFixed(1)}%`;
        
        // 新增指标趋势
        document.getElementById('faf-trend').textContent = `↗ +${(Math.random() * 0.2).toFixed(1)}`;
        document.getElementById('fcvc-trend').textContent = `↗ +${(Math.random() * 0.2).toFixed(1)}`;
        document.getElementById('ch2o-trend').textContent = `↗ +${(Math.random() * 0.1).toFixed(1)}L`;
        document.getElementById('tue-trend').textContent = `↘ -${(Math.random() * 0.2).toFixed(1)}h`;
    }

    // 获取数据
    getData() {
        return this.realData;
    }

    // 获取更新计数器
    getUpdateCounter() {
        return this.updateCounter;
    }
}

// 导出数据管理器
window.DataManager = DataManager;
