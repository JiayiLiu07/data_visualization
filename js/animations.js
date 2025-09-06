// 动画效果模块
class AnimationManager {
    constructor() {
        this.particles = [];
        this.waterDrops = [];
    }

    // 初始化动画
    initAnimations() {
        this.createParticles();
        this.initWaterFlow();
    }

    // 创建浮动粒子
    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        // 创建9个粒子
        for (let i = 0; i < 9; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particlesContainer.appendChild(particle);
        }
    }

    // 初始化水流动画
    initWaterFlow() {
        this.createWaterDrop();
    }

    // 创建水滴
    createWaterDrop() {
        const dropsContainer = document.getElementById('water-drops');
        if (!dropsContainer) return;

        const drop = document.createElement('div');
        drop.className = 'water-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        dropsContainer.appendChild(drop);

        // 3秒后移除水滴
        setTimeout(() => {
            if (drop.parentNode) {
                drop.remove();
            }
        }, 3000);
    }

    // 更新时钟
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }

    // 添加数字滚动动画
    animateNumber(element, startValue, endValue, duration = 1000) {
        const startTime = performance.now();
        const difference = endValue - startValue;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (difference * easeOutQuart);
            
            if (element) {
                if (Number.isInteger(endValue)) {
                    element.textContent = Math.floor(currentValue).toLocaleString();
                } else {
                    element.textContent = currentValue.toFixed(1);
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 添加KPI卡片动画
    animateKPICard(element) {
        if (!element) return;
        
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.3)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 5px 15px rgba(0, 212, 255, 0.2)';
        }, 200);
    }

    // 添加图表加载动画
    animateChartLoad(chartElement) {
        if (!chartElement) return;
        
        chartElement.style.opacity = '0';
        chartElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            chartElement.style.transition = 'all 0.5s ease-out';
            chartElement.style.opacity = '1';
            chartElement.style.transform = 'translateY(0)';
        }, 100);
    }

    // 添加数据更新闪烁效果
    flashElement(element) {
        if (!element) return;
        
        element.style.transition = 'all 0.3s ease';
        element.style.backgroundColor = 'rgba(0, 212, 255, 0.2)';
        element.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
        
        setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.boxShadow = '';
        }, 300);
    }

    // 添加进度条动画
    animateProgressBar(progressElement, targetProgress) {
        if (!progressElement) return;
        
        const currentProgress = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = currentProgress + (targetProgress - currentProgress) * progress;
            progressElement.style.width = currentValue + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 添加打字机效果
    typewriterEffect(element, text, speed = 100) {
        if (!element) return;
        
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // 添加脉冲效果
    addPulseEffect(element) {
        if (!element) return;
        
        element.style.animation = 'pulse 2s infinite';
    }

    // 移除脉冲效果
    removePulseEffect(element) {
        if (!element) return;
        
        element.style.animation = '';
    }

    // 添加旋转效果
    addRotationEffect(element, duration = 2000) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms linear`;
        element.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            element.style.transform = 'rotate(0deg)';
        }, duration);
    }

    // 添加弹跳效果
    addBounceEffect(element) {
        if (!element) return;
        
        element.style.animation = 'bounce 0.6s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    // 添加淡入效果
    fadeIn(element, duration = 500) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    // 添加淡出效果
    fadeOut(element, duration = 500) {
        if (!element) return;
        
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, duration);
    }

    // 添加滑动效果
    slideIn(element, direction = 'left', duration = 500) {
        if (!element) return;
        
        const startPosition = direction === 'left' ? '-100%' : 
                             direction === 'right' ? '100%' : 
                             direction === 'up' ? '-100%' : '100%';
        
        element.style.transform = `translate${direction === 'left' || direction === 'right' ? 'X' : 'Y'}(${startPosition})`;
        element.style.transition = `transform ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
        }, 10);
    }

    // 添加缩放效果
    scaleIn(element, duration = 500) {
        if (!element) return;
        
        element.style.transform = 'scale(0)';
        element.style.transition = `transform ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 10);
    }

    // 添加摇摆效果
    addShakeEffect(element) {
        if (!element) return;
        
        element.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // 清理动画
    cleanup() {
        // 清理所有动画定时器
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        this.waterDrops.forEach(drop => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        });
    }
}

// 导出动画管理器
window.AnimationManager = AnimationManager;
