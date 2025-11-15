/**
 * VMware Private AI Sizing Tool - Application Logic
 * Community Edition by StatelessPlatform.com
 * Based on VMware Private AI Foundation Sizing Guide v9
 * 
 * This is a community educational tool. For production deployments,
 * consult Broadcom and NVIDIA representatives.
 */

// ==================== State Management ====================
let currentStep = 1;
const config = {
    deploymentType: 'new',
    useCase: 'rag',
    modelSize: '8B',
    concurrentRequests: 10,
    gpuType: 'H200',
    hasVCF: 'no'
};

// ==================== Sizing Data from VMware Guide v9 ====================
const sizingData = {
    managementDomain: {
        cpu: 158,
        ram: 610,
        disk: 6.9
    },
    workloadDomainBase: {
        cpu: 57,
        ram: 203,
        disk: 1.6
    },
    rag: {
        '8B': {
            10: { cpu: 26, ram: 104, disk: 1.45, gpu: 21 },
            30: { cpu: 26, ram: 104, disk: 1.5, gpu: 32 },
            50: { cpu: 32, ram: 128, disk: 1.6, gpu: 45 },
            100: { cpu: 38, ram: 152, disk: 1.8, gpu: 70 }
        },
        '14B': {
            10: { cpu: 28, ram: 112, disk: 1.5, gpu: 35 },
            30: { cpu: 28, ram: 112, disk: 1.5, gpu: 50 },
            50: { cpu: 34, ram: 136, disk: 1.6, gpu: 70 },
            100: { cpu: 40, ram: 160, disk: 1.8, gpu: 110 }
        },
        '70B': {
            10: { cpu: 32, ram: 136, disk: 1.5, gpu: 153 },
            30: { cpu: 32, ram: 136, disk: 1.5, gpu: 180 },
            50: { cpu: 38, ram: 152, disk: 1.6, gpu: 210 },
            100: { cpu: 44, ram: 176, disk: 1.8, gpu: 280 }
        }
    },
    gpus: {
        H200: { memory: 141, name: 'NVIDIA H200', ttft: { '8B': 0.023, '14B': 0.035, '70B': 0.045 } },
        H100: { memory: 80, name: 'NVIDIA H100', ttft: { '8B': 0.035, '14B': 0.050, '70B': 0.065 } },
        L40s: { memory: 48, name: 'NVIDIA L40s', ttft: { '8B': 0.063, '14B': 0.090, '70B': 0.120 } },
        A100: { memory: 80, name: 'NVIDIA A100', ttft: { '8B': 0.040, '14B': 0.055, '70B': 0.070 } }
    }
};

// ==================== Theme Management ====================
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const theme = document.documentElement.getAttribute('data-theme');
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
}

// ==================== Help Panel ====================
function toggleHelp() {
    const panel = document.getElementById('helpPanel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

// ==================== Slider Update ====================
function updateSlider() {
    const value = document.getElementById('concurrentRequests').value;
    document.getElementById('concurrentValue').textContent = value;
}

// ==================== Template Loading ====================
function loadTemplate(template) {
    const templates = {
        pilot: {
            deploymentType: 'new',
            useCase: 'rag',
            modelSize: '8B',
            concurrentRequests: 10,
            gpuType: 'L40s',
            hasVCF: 'no'
        },
        production: {
            deploymentType: 'new',
            useCase: 'rag',
            modelSize: '8B',
            concurrentRequests: 30,
            gpuType: 'H200',
            hasVCF: 'no'
        },
        enterprise: {
            deploymentType: 'new',
            useCase: 'rag',
            modelSize: '70B',
            concurrentRequests: 30,
            gpuType: 'H200',
            hasVCF: 'no'
        },
        custom: {
            deploymentType: 'new',
            useCase: 'rag',
            modelSize: '8B',
            concurrentRequests: 10,
            gpuType: 'H200',
            hasVCF: 'no'
        }
    };

    if (templates[template]) {
        Object.assign(config, templates[template]);
        applyConfigToForm();
        nextStep();
    }
}

function applyConfigToForm() {
    const deploymentRadio = document.querySelector(`input[name="deploymentType"][value="${config.deploymentType}"]`);
    if (deploymentRadio) deploymentRadio.checked = true;

    const useCaseRadio = document.querySelector(`input[name="useCase"][value="${config.useCase}"]`);
    if (useCaseRadio) useCaseRadio.checked = true;

    const modelSizeSelect = document.getElementById('modelSize');
    if (modelSizeSelect) modelSizeSelect.value = config.modelSize;

    const concurrentInput = document.getElementById('concurrentRequests');
    if (concurrentInput) {
        concurrentInput.value = config.concurrentRequests;
        updateSlider();
    }

    const gpuTypeSelect = document.getElementById('gpuType');
    if (gpuTypeSelect) gpuTypeSelect.value = config.gpuType;

    const vcfRadio = document.querySelector(`input[name="hasVCF"][value="${config.hasVCF}"]`);
    if (vcfRadio) vcfRadio.checked = true;
}

// ==================== Navigation ====================
function nextStep() {
    if (currentStep < 4) {
        saveFormValues();
        currentStep++;
        updateProgress();
        showStep(currentStep);
        window.scrollTo(0, 0);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
        showStep(currentStep);
        window.scrollTo(0, 0);
    }
}

function showStep(step) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(`step${step}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updateProgress() {
    const progressLine = document.getElementById('progressLine');
    const progressPercent = ((currentStep - 1) / 3) * 100;
    if (progressLine) {
        progressLine.style.width = `${progressPercent}%`;
    }

    for (let i = 1; i <= 4; i++) {
        const circle = document.getElementById(`step${i}-circle`);
        const label = document.getElementById(`step${i}-label`);

        if (circle && label) {
            circle.classList.remove('active', 'completed');
            label.classList.remove('active');

            if (i < currentStep) {
                circle.classList.add('completed');
                circle.innerHTML = '✓';
            } else if (i === currentStep) {
                circle.classList.add('active');
                label.classList.add('active');
                circle.innerHTML = i;
            } else {
                circle.innerHTML = i;
            }
        }
    }
}

function saveFormValues() {
    const deploymentRadio = document.querySelector('input[name="deploymentType"]:checked');
    if (deploymentRadio) config.deploymentType = deploymentRadio.value;

    const useCaseRadio = document.querySelector('input[name="useCase"]:checked');
    if (useCaseRadio) config.useCase = useCaseRadio.value;

    const modelSizeSelect = document.getElementById('modelSize');
    if (modelSizeSelect) config.modelSize = modelSizeSelect.value;

    const concurrentInput = document.getElementById('concurrentRequests');
    if (concurrentInput) config.concurrentRequests = parseInt(concurrentInput.value);

    const gpuTypeSelect = document.getElementById('gpuType');
    if (gpuTypeSelect) config.gpuType = gpuTypeSelect.value;

    const vcfRadio = document.querySelector('input[name="hasVCF"]:checked');
    if (vcfRadio) config.hasVCF = vcfRadio.value;
}

// ==================== Calculation ====================
function calculateResults() {
    saveFormValues();
    document.getElementById('calculatingDiv').style.display = 'block';
    document.getElementById('resultsDiv').style.display = 'none';
    nextStep();

    setTimeout(() => {
        performCalculation();
        document.getElementById('calculatingDiv').style.display = 'none';
        document.getElementById('resultsDiv').style.display = 'block';
    }, 1500);
}

function performCalculation() {
    const concurrentOptions = [10, 30, 50, 100];
    const concurrent = concurrentOptions.reduce((prev, curr) => 
        Math.abs(curr - config.concurrentRequests) < Math.abs(prev - config.concurrentRequests) ? curr : prev
    );

    const ragSizing = sizingData.rag[config.modelSize][concurrent];

    let mgmtCPU = 0, mgmtRAM = 0, mgmtDisk = 0;
    if (config.hasVCF === 'no') {
        mgmtCPU = sizingData.managementDomain.cpu;
        mgmtRAM = sizingData.managementDomain.ram;
        mgmtDisk = sizingData.managementDomain.disk;
    }

    const wldCPU = sizingData.workloadDomainBase.cpu + ragSizing.cpu;
    const wldRAM = sizingData.workloadDomainBase.ram + ragSizing.ram;
    const wldDisk = sizingData.workloadDomainBase.disk + ragSizing.disk;
    const gpuMemory = ragSizing.gpu;

    const gpuSpec = sizingData.gpus[config.gpuType];
    const gpuCount = Math.ceil(gpuMemory / gpuSpec.memory);

    const mgmtServers = config.hasVCF === 'no' ? 4 : 0;
    const wldServers = Math.max(3, Math.ceil(gpuCount / 4));
    const totalServers = mgmtServers + wldServers;

    const ttft = gpuSpec.ttft[config.modelSize];
    const e2e = ttft + (config.modelSize === '8B' ? 0.9 : config.modelSize === '14B' ? 1.5 : 2.5);
    const maxUsers = concurrent * 5;

    // Update DOM
    document.getElementById('mgmtCPU').textContent = mgmtCPU;
    document.getElementById('mgmtRAM').textContent = mgmtRAM;
    document.getElementById('mgmtDisk').textContent = mgmtDisk.toFixed(1);

    document.getElementById('wldCPU').textContent = wldCPU;
    document.getElementById('wldRAM').textContent = wldRAM;
    document.getElementById('wldDisk').textContent = wldDisk.toFixed(1);

    document.getElementById('gpuMemory').textContent = gpuMemory;
    document.getElementById('gpuCount').textContent = gpuCount;
    document.getElementById('gpuTypeLabel').textContent = `${gpuSpec.name} GPUs`;

    document.getElementById('serverCount').textContent = totalServers;
    document.getElementById('mgmtServers').textContent = mgmtServers;
    document.getElementById('wldServers').textContent = wldServers;

    document.getElementById('specCPU').textContent = '2x 32-Core CPUs';
    const ramMin = Math.max(512, gpuCount * gpuSpec.memory * 2);
    const ramMax = Math.max(1024, gpuCount * gpuSpec.memory * 3);
    document.getElementById('specRAM').textContent = `${ramMin} - ${ramMax} GB`;
    document.getElementById('specGPU').textContent = `${Math.min(4, gpuCount)}x ${gpuSpec.name}`;
    document.getElementById('specNetwork').textContent = config.useCase === 'training' ? '2x 100GbE NICs (RoCEv2)' : '4x 25GbE NICs';
    document.getElementById('specStorage').textContent = '5-10x 7.68TB NVMe SSDs';

    document.getElementById('perfTTFT').textContent = `${ttft.toFixed(3)}s`;
    document.getElementById('perfE2E').textContent = `${e2e.toFixed(2)}s`;
    document.getElementById('perfUsers').textContent = maxUsers;

    config.results = {
        management: { cpu: mgmtCPU, ram: mgmtRAM, disk: mgmtDisk, servers: mgmtServers },
        workload: { cpu: wldCPU, ram: wldRAM, disk: wldDisk, servers: wldServers },
        gpu: { memory: gpuMemory, count: gpuCount, type: gpuSpec.name },
        performance: { ttft, e2e, maxUsers },
        totalServers
    };
}

// ==================== Export Functions ====================
function exportJSON() {
    const data = {
        configuration: config,
        timestamp: new Date().toISOString(),
        tool: 'VMware Private AI Sizing Tool - Community Edition',
        attribution: 'StatelessPlatform.com | Based on VMware Sizing Guide v9'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vmware-ai-sizing-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportText() {
    const results = config.results;
    const text = `VMware Private AI Sizing Report
Community Edition - Educational Tool
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════════

CONFIGURATION
═══════════════════════════════════════════════════════════════
Deployment Type: ${config.deploymentType}
Use Case: ${config.useCase}
Model Size: ${config.modelSize}
Concurrent Requests: ${config.concurrentRequests}
GPU Type: ${config.gpuType}
Existing VCF: ${config.hasVCF === 'yes' ? 'Yes' : 'No'}

MANAGEMENT DOMAIN
═══════════════════════════════════════════════════════════════
CPU Cores: ${results.management.cpu}
RAM: ${results.management.ram} GB
Storage: ${results.management.disk} TB
Servers: ${results.management.servers}

WORKLOAD DOMAIN
═══════════════════════════════════════════════════════════════
CPU Cores: ${results.workload.cpu}
RAM: ${results.workload.ram} GB
Storage: ${results.workload.disk} TB
Servers: ${results.workload.servers}

GPU REQUIREMENTS
═══════════════════════════════════════════════════════════════
GPU Memory: ${results.gpu.memory} GB
GPU Count: ${results.gpu.count}x ${results.gpu.type}

TOTAL SERVERS
═══════════════════════════════════════════════════════════════
Total: ${results.totalServers} servers

PERFORMANCE EXPECTATIONS
═══════════════════════════════════════════════════════════════
Time to First Token: ${results.performance.ttft.toFixed(3)}s
End-to-End Latency: ${results.performance.e2e.toFixed(2)}s
Max Concurrent Users: ${results.performance.maxUsers}

═══════════════════════════════════════════════════════════════
Generated by VMware Private AI Sizing Tool (Community Edition)
Created by StatelessPlatform.com
Based on VMware Private AI Foundation Sizing Guide v9

EDUCATIONAL TOOL - For production deployments, consult:
• Broadcom: https://support.broadcom.com
• Official Guide: https://www.vmware.com/docs/sizing-ai-workloads-on-vcf
═══════════════════════════════════════════════════════════════
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vmware-ai-sizing-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== Executive PDF Export ====================
async function exportExecutivePDF() {
    // Show loading overlay
    const overlay = document.getElementById('pdfLoadingOverlay');
    if (overlay) overlay.classList.add('active');

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const results = config.results;
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let yPos = 20;

        // ==================== PAGE 1: Cover ====================
        doc.setFontSize(28);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('VMware Private AI', 105, 80, { align: 'center' });
        doc.text('Infrastructure Assessment', 105, 95, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(102, 102, 102);
        doc.text('Executive Summary Report', 105, 110, { align: 'center' });

        doc.setFontSize(11);
        doc.text('Community Edition', 105, 125, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Generated: ${today}`, 105, 240, { align: 'center' });

        doc.setFontSize(9);
        doc.setTextColor(59, 130, 246);
        doc.text('Community educational tool by StatelessPlatform.com', 105, 255, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(102, 102, 102);
        doc.text('Based on VMware Private AI Foundation Sizing Guide v9', 105, 265, { align: 'center' });
        doc.text('For production deployments, consult Broadcom and NVIDIA', 105, 272, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(0, 102, 204);
        doc.text('Official Guide: vmware.com/docs/sizing-ai-workloads-on-vcf', 105, 285, { align: 'center' });

        // ==================== PAGE 2: Executive Summary ====================
        doc.addPage();
        yPos = 20;

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Executive Summary', 20, yPos);
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);

        const execSummary = [
            'This report presents a comprehensive infrastructure sizing analysis for deploying VMware Private AI',
            'Foundation with NVIDIA. The assessment is based on your organization\'s specific AI workload',
            'requirements and delivers actionable recommendations for decision-makers.',
            '',
            'KEY HIGHLIGHTS:',
            '',
            `• Deployment Scope: ${config.deploymentType === 'new' ? 'New VMware Cloud Foundation deployment' : 'Expansion of existing VCF infrastructure'}`,
            `• AI Use Case: ${config.useCase.toUpperCase()} with ${config.modelSize} LLM`,
            `• Expected Load: ${config.concurrentRequests} concurrent requests (~${results.performance.maxUsers} users)`,
            `• GPU Platform: ${results.gpu.type} (${results.gpu.count} GPUs required)`,
            `• Total Servers: ${results.totalServers} enterprise-grade servers`,
            '',
            'STRATEGIC BENEFITS:',
            '',
            '1. Lower TCO: On-premises private AI reduces cloud costs and provides predictable pricing.',
            '2. Data Privacy: Keep sensitive data within your infrastructure, meeting compliance requirements.',
            '3. Performance: Sub-second response times with optimized GPU acceleration.',
            '4. Scalability: Foundation built to scale from pilot to production seamlessly.',
            '',
            'BUSINESS CONTEXT:',
            '',
            'Generative AI is expected to drive up to $4.4 Trillion in annual economic value for enterprises.',
            'By 2028, 95% of organizations will have integrated generative AI into daily operations. VMware',
            'Private AI Foundation positions your organization to capture this value while maintaining control,',
            'security, and compliance.'
        ];

        execSummary.forEach(line => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, 20, yPos);
            yPos += 6;
        });

        // ==================== PAGE 3: Infrastructure Requirements ====================
        doc.addPage();
        yPos = 20;

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Infrastructure Requirements', 20, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('1. Management Domain', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        if (results.management.servers > 0) {
            doc.text(`CPU Cores: ${results.management.cpu}`, 25, yPos);
            yPos += 6;
            doc.text(`RAM: ${results.management.ram} GB`, 25, yPos);
            yPos += 6;
            doc.text(`Storage: ${results.management.disk} TB`, 25, yPos);
            yPos += 6;
            doc.text(`Servers Required: ${results.management.servers}`, 25, yPos);
            yPos += 10;
        } else {
            doc.text('Using existing VCF Management Domain', 25, yPos);
            yPos += 10;
        }

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('2. AI Workload Domain', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`CPU Cores: ${results.workload.cpu}`, 25, yPos);
        yPos += 6;
        doc.text(`RAM: ${results.workload.ram} GB`, 25, yPos);
        yPos += 6;
        doc.text(`Storage: ${results.workload.disk.toFixed(1)} TB`, 25, yPos);
        yPos += 6;
        doc.text(`GPU Memory Required: ${results.gpu.memory} GB`, 25, yPos);
        yPos += 6;
        doc.text(`GPUs: ${results.gpu.count}x ${results.gpu.type}`, 25, yPos);
        yPos += 6;
        doc.text(`Servers Required: ${results.workload.servers}`, 25, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('3. Recommended Server Specification', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('CPU: 2x 32-Core Intel Xeon or AMD EPYC processors', 25, yPos);
        yPos += 6;
        const ramMin = Math.max(512, results.gpu.count * sizingData.gpus[config.gpuType].memory * 2);
        const ramMax = Math.max(1024, results.gpu.count * sizingData.gpus[config.gpuType].memory * 3);
        doc.text(`RAM: ${ramMin} - ${ramMax} GB DDR5`, 25, yPos);
        yPos += 6;
        doc.text(`GPUs: ${Math.min(4, results.gpu.count)}x ${results.gpu.type} per server`, 25, yPos);
        yPos += 6;
        const networkSpec = config.useCase === 'training' ? '2x 100GbE NICs (RoCEv2)' : '4x 25GbE NICs';
        doc.text(`Network: ${networkSpec}`, 25, yPos);
        yPos += 6;
        doc.text('Storage: 5-10x 7.68TB NVMe SSD', 25, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('4. Total Infrastructure Summary', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Total Servers: ${results.totalServers}`, 25, yPos);
        yPos += 6;
        doc.text(`  • Management Domain: ${results.management.servers}`, 25, yPos);
        yPos += 6;
        doc.text(`  • AI Workload Domain: ${results.workload.servers}`, 25, yPos);
        yPos += 6;
        doc.text(`Total CPU Cores: ${results.management.cpu + results.workload.cpu}`, 25, yPos);
        yPos += 6;
        doc.text(`Total RAM: ${results.management.ram + results.workload.ram} GB`, 25, yPos);
        yPos += 6;
        doc.text(`Total Storage: ${(results.management.disk + results.workload.disk).toFixed(1)} TB`, 25, yPos);

        // ==================== PAGE 4: Performance Analysis ====================
        doc.addPage();
        yPos = 20;

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Performance Analysis', 20, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Expected Performance Metrics', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Time to First Token (TTFT): ${results.performance.ttft.toFixed(3)} seconds`, 25, yPos);
        yPos += 6;
        doc.text('(Industry target: < 0.2 seconds)', 25, yPos);
        yPos += 10;

        doc.text(`End-to-End Response Latency: ${results.performance.e2e.toFixed(2)} seconds`, 25, yPos);
        yPos += 6;
        doc.text('(Complete response generation time)', 25, yPos);
        yPos += 10;

        doc.text(`Maximum Concurrent Users: ${results.performance.maxUsers}`, 25, yPos);
        yPos += 6;
        doc.text(`(${config.concurrentRequests} concurrent requests × 5 users per request)`, 25, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Scalability Considerations', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const scalability = [
            '• This configuration is sized for your current requirements with built-in headroom',
            '• GPU resources can be scaled horizontally by adding additional servers',
            '• Workload Domain can grow independently from Management Domain',
            '• Modular architecture allows incremental capacity expansion',
            `• ${config.modelSize} model provides optimal balance for your use case`
        ];

        scalability.forEach(line => {
            doc.text(line, 25, yPos);
            yPos += 7;
        });

        yPos += 5;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Performance Optimization Tips', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const optimization = [
            '• Utilize vSphere with Tandem for GPU time-slicing and multi-tenancy',
            '• Implement NVIDIA AI Enterprise for optimized inference performance',
            '• Configure proper network QoS for AI workloads',
            '• Monitor GPU utilization and scale when sustained usage exceeds 70%',
            '• Consider model quantization for improved throughput'
        ];

        optimization.forEach(line => {
            doc.text(line, 25, yPos);
            yPos += 7;
        });

        // ==================== PAGE 5: Strategic Recommendations ====================
        doc.addPage();
        yPos = 20;

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Strategic Recommendations', 20, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Implementation Roadmap', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const roadmap = [
            'PHASE 1: FOUNDATION (Weeks 1-4)',
            '• Deploy VMware Cloud Foundation Management Domain',
            '• Establish networking and storage infrastructure',
            '• Configure initial security policies and compliance frameworks',
            '',
            'PHASE 2: AI INFRASTRUCTURE (Weeks 5-8)',
            '• Deploy AI Workload Domain with GPU servers',
            '• Install NVIDIA AI Enterprise software stack',
            '• Configure vSphere with Tandem for GPU management',
            '• Set up monitoring and logging infrastructure',
            '',
            'PHASE 3: MODEL DEPLOYMENT (Weeks 9-10)',
            `• Deploy ${config.modelSize} LLM using NVIDIA NIM`,
            '• Implement RAG framework with vector database',
            '• Configure model serving and load balancing',
            '• Conduct performance testing and optimization',
            '',
            'PHASE 4: PRODUCTION READINESS (Weeks 11-12)',
            '• Execute user acceptance testing',
            '• Implement backup and disaster recovery procedures',
            '• Train operations team on platform management',
            '• Go-live with production workload'
        ];

        roadmap.forEach(line => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            if (line.startsWith('PHASE')) {
                doc.setFont(undefined, 'bold');
            } else {
                doc.setFont(undefined, 'normal');
            }
            doc.text(line, 25, yPos);
            yPos += 6;
        });

        // ==================== PAGE 6: Business Value & ROI ====================
        doc.addPage();
        yPos = 20;

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Business Value & ROI', 20, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Total Cost of Ownership (TCO) Advantages', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const tcoAdvantages = [
            '1. Predictable Pricing: No per-request API costs or unpredictable cloud bills',
            '2. Data Egress Savings: Eliminate expensive cloud data transfer fees',
            '3. Long-term Value: Infrastructure investment amortizes over 3-5 year lifecycle',
            '4. Multi-workload Support: Same infrastructure can serve multiple AI applications',
            '5. No Vendor Lock-in: Open architecture with flexibility to change models'
        ];

        tcoAdvantages.forEach(line => {
            doc.text(line, 25, yPos);
            yPos += 7;
        });

        yPos += 5;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Strategic Business Benefits', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const benefits = [
            'Data Sovereignty & Compliance',
            '• Full control over data location and processing',
            '• Meet GDPR, HIPAA, and industry-specific regulatory requirements',
            '• Reduce data breach risks with on-premises deployment',
            '',
            'Performance & Reliability',
            '• Consistent low-latency responses without internet dependency',
            '• No rate limiting or throttling from external API providers',
            `• High availability with ${results.workload.servers} server cluster`,
            '',
            'Innovation Velocity',
            '• Rapid experimentation without per-query costs',
            '• Deploy custom models tailored to your domain',
            '• Integrate seamlessly with existing enterprise systems',
            '',
            'Competitive Advantage',
            '• Early adoption of Private AI positions you ahead of competition',
            '• Proprietary AI capabilities not available to competitors using public APIs',
            '• Build institutional AI expertise within your organization'
        ];

        benefits.forEach(line => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            if (!line.startsWith('•') && line !== '') {
                doc.setFont(undefined, 'bold');
            } else {
                doc.setFont(undefined, 'normal');
            }
            doc.text(line, 25, yPos);
            yPos += 6;
        });

        // ==================== PAGE 7: Next Steps & Attribution ====================
        doc.addPage();
        yPos = 20;

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text('Next Steps & Resources', 20, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Recommended Actions', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const nextSteps = [
            '1. TECHNICAL VALIDATION',
            '   • Review this sizing with your infrastructure team',
            '   • Validate hardware compatibility with Broadcom HCL',
            '   • Assess datacenter power and cooling requirements',
            '',
            '2. PROCUREMENT PLANNING',
            '   • Request detailed quotes from approved hardware vendors',
            '   • Evaluate VMware and NVIDIA software licensing options',
            '   • Plan procurement timeline (typical: 8-12 weeks lead time)',
            '',
            '3. PROOF OF CONCEPT',
            '   • Consider starting with a smaller pilot configuration',
            '   • Test representative AI workloads before full deployment',
            '   • Validate performance against your specific requirements',
            '',
            '4. PARTNER ENGAGEMENT',
            '   • Engage Broadcom and NVIDIA for technical design review',
            '   • Connect with certified implementation partners',
            '   • Schedule workshops for operations team training'
        ];

        nextSteps.forEach(line => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            if (line.match(/^\d\./)) {
                doc.setFont(undefined, 'bold');
            } else {
                doc.setFont(undefined, 'normal');
            }
            doc.text(line, 25, yPos);
            yPos += 6;
        });

        yPos += 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Official Resources & Support', 20, yPos);
        yPos += 10;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 102, 204);
        doc.text('VMware Private AI Sizing Guide (Official):', 25, yPos);
        yPos += 5;
        doc.setTextColor(0, 0, 0);
        doc.text('https://www.vmware.com/docs/sizing-ai-workloads-on-vcf', 25, yPos);
        yPos += 8;

        doc.setTextColor(0, 102, 204);
        doc.text('VMware Blog Announcement:', 25, yPos);
        yPos += 5;
        doc.setTextColor(0, 0, 0);
        doc.text('https://blogs.vmware.com/cloud-foundation/2025/10/24/', 25, yPos);
        yPos += 4;
        doc.text('introducing-the-private-ai-sizing-guide/', 25, yPos);
        yPos += 8;

        doc.setTextColor(0, 102, 204);
        doc.text('Broadcom Support Portal:', 25, yPos);
        yPos += 5;
        doc.setTextColor(0, 0, 0);
        doc.text('https://support.broadcom.com/group/ecx/productdownloads', 25, yPos);
        yPos += 8;

        doc.setTextColor(0, 102, 204);
        doc.text('NVIDIA NGC Catalog:', 25, yPos);
        yPos += 5;
        doc.setTextColor(0, 0, 0);
        doc.text('https://catalog.ngc.nvidia.com', 25, yPos);

        yPos += 15;
        doc.setFontSize(9);
        doc.setTextColor(59, 130, 246);
        doc.setFont(undefined, 'bold');
        doc.text('About This Report', 20, yPos);
        yPos += 8;

        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(102, 102, 102);
        doc.text('This report was generated by the VMware Private AI Sizing Tool (Community Edition)', 20, yPos);
        yPos += 5;
        doc.text('created by StatelessPlatform.com. This is a community educational tool based on the', 20, yPos);
        yPos += 5;
        doc.text('official VMware Private AI Foundation Sizing Guide v9.', 20, yPos);
        yPos += 8;
        doc.text('For production deployments, please validate these calculations with Broadcom and', 20, yPos);
        yPos += 5;
        doc.text('NVIDIA representatives, and refer to official documentation and support resources.', 20, yPos);

        // Save PDF
        doc.save(`VMware-Private-AI-Assessment-${new Date().getTime()}.pdf`);

        if (overlay) overlay.classList.remove('active');

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again or use the Text export option.');
        const overlay = document.getElementById('pdfLoadingOverlay');
        if (overlay) overlay.classList.remove('active');
    }
}



// ==================== Reset ====================
function resetCalculator() {
    currentStep = 1;
    config.deploymentType = 'new';
    config.useCase = 'rag';
    config.modelSize = '8B';
    config.concurrentRequests = 10;
    config.gpuType = 'H200';
    config.hasVCF = 'no';

    updateProgress();
    showStep(1);
    window.scrollTo(0, 0);
}

// ==================== URL Configuration Loading ====================
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#config=')) {
        try {
            const configEncoded = hash.substring(8);
            const loadedConfig = JSON.parse(atob(configEncoded));
            Object.assign(config, loadedConfig);
            applyConfigToForm();
            alert('Configuration loaded successfully from shared link!');
        } catch (e) {
            console.error('Failed to load configuration from URL:', e);
        }
    }
});
