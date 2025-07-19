let viewer;
let currentSchoolId = null;

// 设置token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNDMwZTVhZC02YTdiLTQyMDYtOWM4Ny02Y2YyOTQ3ZmJjNWEiLCJpZCI6MTQ0NDM5LCJpYXQiOjE3MTg4NTA2OTl9.KVXSW5CfBgc6GUJgueZKFvDNJ1mVlW4VghdHCgPuxyY';

// 学校信息数组
const schools = [
    { 
        id: '卓越小学',
        name: '山东省德州市陵城区卓越小学', 
        longitude: 116.598458, 
        latitude: 37.324375, 
        stage: '小学',
        description: '小学阶段就读学校',
        period: '2010.9-2016.6',
        classInfo: '就读于2班',
        badge: '卓越小学校徽.jpg',
        media: {
            photos: [
                { url: '卓越小学.jpg', title: '卓越小学', type: 'file' }
            ],
            videos: [],
            audios: [],
            texts: [
                { title: '小学回忆', content: '在卓越小学度过了快乐的童年时光，这里是我学习生涯的起点，初步塑造了我的人生观和价值观。' }
            ]
        }
    },
    { 
        id: '第六中学',
        name: '山东省德州市陵城区第六中学', 
        longitude: 116.570092, 
        latitude: 37.312703, 
        stage: '初中',
        description: '初中阶段就读学校',
        period: '2016.9-2019.6',
        classInfo: '2016级16班',
        badge: '六中校徽.jpg',
        media: {
            photos: [
                { url: '六中.jpg', title: '六中学府楼', type: 'file' },
                { url: '六中1.jpg', title: '六中操场和宿舍楼', type: 'file' }
            ],
            videos: [],
            audios: [],
            texts: [
                { title: '初中回忆', content: '初中时期是成长的关键阶段，在六中我遇到了许多优秀的老师和朋友，也让我对各学科产生了浓厚的兴趣。' }
            ]
        }
    },
    { 
        id: '第一中学',
        name: '山东省德州市陵城区第一中学', 
        longitude: 116.530934, 
        latitude: 37.341323, 
        stage: '高中',
        description: '高中阶段就读学校',
        period: '2019.9-2022.6',
        classInfo: '2019级30班，副科所选科目为：地理、历史、生物',
        badge: '一中校徽.jpg',
        media: {
            photos: [
                { url: '一中.jpg', title: '一中南门', type: 'file' },
                { url: '一中1.jpg', title: '一中西门', type: 'file' }
            ],
            videos: [],
            audios: [],
            texts: [
                { title: '高中回忆', content: '高中三年是最充实的时光，学习压力大但收获更多，三年努力最终考上大学。' }
            ]
        }
    },
    { 
        id: '南宁师大',
        name: '南宁师范大学', 
        longitude: 108.278088, 
        latitude: 23.183143, 
        stage: '大学',
        description: '大学阶段就读学校',
        period: '2022.9.13-2026.6',
        classInfo: '地理科学与规划学院地理信息科学专业22地信班',
        studentId: '2225000310',
        motto: '德才并育，知行合一',
        badge: '南师大校徽.jpg',
        website: 'https://www.nnnu.edu.cn/',
        media: {
            photos: [
                { url: '南师大图书馆.jpg', title: '南宁师大图书馆', type: 'file' },
                { url: '南师大.jpg', title: '南宁师大东南门', type: 'file' }
            ],
            videos: [
                { 
                    url: '南师大视频.mp4', 
                    title: '南宁师范大学宣传视频', 
                    type: 'file' 
                }
            ],
            audios: [
                { 
                    url: '广西师范学院校歌 - 芳华人间.mp3', 
                    title: '校歌 - 芳华人间', 
                    type: 'file' 
                }
            ],
            texts: [
                { 
                    title: '大学感受', 
                    content: '南宁师范大学为我提供了广阔的学习平台。在这里我系统学习了地理信息科学专业知识，学习了专业技能，如：如何设计一个网页，进行WebGIS开发。' 
                }
            ]
        }
    }
];

// 定义不同教育阶段的图标颜色
const stageColors = {
    '小学': Cesium.Color.YELLOW,
    '初中': Cesium.Color.GREEN,
    '高中': Cesium.Color.BLUE,
    '大学': Cesium.Color.RED
};

// 初始化函数，在页面加载后执行
function initCesium() {
    // 创建Cesium viewer
    viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: Cesium.createWorldTerrain(),
        baseLayerPicker: true,
        geocoder: true,
        homeButton: true,
        sceneModePicker: true,
        navigationHelpButton: true,
        animation: true,
        timeline: true,
        fullscreenButton: true,
        infoBox: true,
    });

    // 设置默认视角
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(104.1954, 35.8617, 8000000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        },
        duration: 0
    });

    // 添加学校标记和标注
    addSchoolMarkers();
    
    // 添加交互事件
    setupInteractions();
    
    // 加载SortableJS库
    loadSortableJS();
    
    // 初始化新增功能
    initEnhancedFeatures();
}

// 加载SortableJS库
function loadSortableJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js';
    document.head.appendChild(script);
}

// 初始化新增功能
function initEnhancedFeatures() {
    // 添加学校按钮事件
    document.getElementById('addSchoolBtn').addEventListener('click', function() {
        document.getElementById('schoolFormTitle').textContent = '添加学校';
        document.getElementById('schoolForm').reset();
        document.getElementById('schoolId').value = '';
        document.getElementById('schoolFormModal').style.display = 'flex';
    });
    
    // 批量操作按钮事件
    document.getElementById('batchOperationBtn').addEventListener('click', function() {
        document.getElementById('batchOperationModal').style.display = 'flex';
        loadSchoolsForBatchOperation();
    });
    
    // 数据导出按钮事件
    document.getElementById('exportDataBtn').addEventListener('click', function() {
        document.getElementById('exportDataModal').style.display = 'flex';
        updateExportDataPreview();
    });
    
    // 保存学校表单
    document.getElementById('schoolForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSchoolData();
    });
    
    // 批量删除
    document.getElementById('batchDeleteBtn').addEventListener('click', batchDeleteSchools);
    
    // 批量编辑
    document.getElementById('applyBatchOperationBtn').addEventListener('click', applyBatchOperation);
    
    // 导出为JSON
    document.getElementById('exportJsonBtn').addEventListener('click', exportToJson);
    
    // 导出为Excel
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
    
    // 关闭按钮事件
    document.querySelectorAll('.enhanced-close-modal, #cancelSchoolFormBtn, #closeBatchOperationBtn, #closeExportDataBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.enhanced-modal');
            if (modal) modal.style.display = 'none';
        });
    });
}

// 添加学校标记
function addSchoolMarkers() {
    schools.forEach(school => {
        const position = Cesium.Cartesian3.fromDegrees(school.longitude, school.latitude);
        const color = stageColors[school.stage];

        // 创建实体（标记）
        viewer.entities.add({
            id: school.id,
            name: school.name,
            position: position,
            billboard: {
                image: createIcon(color),
                scale: 0.8,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
            label: {
                text: school.name,
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                backgroundColor: color.withAlpha(0.7),
                showBackground: true,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, 5),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
            },
            description: `
                <table class="cesium-infoBox-defaultTable">
                    <tbody>
                        <tr><th>教育阶段</th><td>${school.stage}</td></tr>
                        <tr><th>学校名称</th><td>${school.name}</td></tr>
                        <tr><th>地理位置</th><td>经度: ${school.longitude}, 纬度: ${school.latitude}</td></tr>
                        <tr><th>简介</th><td>${school.description}</td></tr>
                    </tbody>
                </table>
            `
        });
    });
}

// 设置交互事件
function setupInteractions() {
    // 点击地图获取坐标
    viewer.screenSpaceEventHandler.setInputAction(function (movement) {
        const pickedObject = viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject)) {
            const entity = pickedObject.id;
            if (entity instanceof Cesium.Entity && schools.some(s => s.id === entity.id)) {
                showSchoolModal(entity.id);
                return;
            }
        }
        
        const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            showCoordinates(cartesian, longitude, latitude);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 为左侧列表项添加点击事件
    document.querySelectorAll('.school-item').forEach(item => {
        const toggleBtn = item.querySelector('.toggle-btn');
        const schoolId = item.getAttribute('data-school');
        
        item.addEventListener('click', function(e) {
            if (e.target === toggleBtn || e.target.closest('.toggle-btn')) {
                return;
            }
            flyToSchool(schoolId);
            highlightSchoolItem(schoolId);
        });
        
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showSchoolModal(schoolId);
            this.classList.toggle('expanded');
        });
    });
    
    // 关闭弹窗事件
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('schoolModal').style.display = 'none';
    });
    
    document.getElementById('schoolModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

// 显示学校详情弹窗
function showSchoolModal(schoolId) {
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;
    
    currentSchoolId = schoolId;
    
    // 更新基本信息
    document.getElementById('modalSchoolName').textContent = school.name;
    document.getElementById('modalSchoolStage').textContent = school.stage;
    document.getElementById('modalSchoolLocation').textContent = `经度: ${school.longitude}, 纬度: ${school.latitude}`;
    document.getElementById('modalSchoolPeriod').textContent = school.period;
    document.getElementById('modalSchoolClass').textContent = school.classInfo;
    
    // 更新校徽
    document.getElementById('modalBadge').src = school.badge;
    
    // 显示多媒体内容
    displayMediaContent(school);
    
    // 设置多媒体上传事件
    setupMediaUpload(schoolId);
    
    // 显示弹窗
    document.getElementById('schoolModal').style.display = 'flex';
    flyToSchool(schoolId);
    highlightSchoolItem(schoolId);
}

// 显示多媒体内容
function displayMediaContent(school) {
    const media = school.media;
    
    // 显示照片
    const photosContainer = document.getElementById('modalSchoolPhotos');
    photosContainer.innerHTML = '';
    media.photos.forEach((photo, index) => {
        const photoItem = createPhotoItem(photo, index);
        photosContainer.appendChild(photoItem);
    });
    
    // 显示视频
    const videosContainer = document.getElementById('modalSchoolVideos');
    videosContainer.innerHTML = '';
    media.videos.forEach((video, index) => {
        const videoItem = createVideoItem(video, index);
        videosContainer.appendChild(videoItem);
    });
    
    // 显示音频
    const songsContainer = document.getElementById('modalSchoolSongs');
    songsContainer.innerHTML = '';
    media.audios.forEach((audio, index) => {
        const audioItem = createAudioItem(audio, index);
        songsContainer.appendChild(audioItem);
    });
    
    // 显示文字记录
    const feelingsContainer = document.getElementById('modalPersonalFeelings');
    feelingsContainer.innerHTML = '';
    media.texts.forEach((text, index) => {
        const textItem = createTextItem(text, index);
        feelingsContainer.appendChild(textItem);
    });
    
    // 初始化排序功能
    initSortable();
}

// 创建照片项
function createPhotoItem(photo, index) {
    const container = document.createElement('div');
    container.className = 'media-item-container';
    container.dataset.index = index;

    const img = document.createElement('img');
    img.src = photo.url;
    img.className = 'media-item';
    img.onclick = () => window.open(photo.url, '_blank');
    container.appendChild(img);
    
    // 添加删除按钮
    addDeleteButton(container, 'photos', index);
    
    return container;
}

// 创建视频项
function createVideoItem(video, index) {
    const container = document.createElement('div');
    container.className = 'video-item-container';
    container.dataset.index = index;

    let videoElement;
    if (video.type === 'file') {
        videoElement = document.createElement('video');
        videoElement.src = video.url;
        videoElement.controls = true;
    } else {
        videoElement = document.createElement('iframe');
        videoElement.src = video.url;
        videoElement.allowFullscreen = true;
    }
    
    videoElement.className = 'video-item';
    container.appendChild(videoElement);
    
    // 添加删除按钮
    addDeleteButton(container, 'videos', index);
    
    return container;
}

// 创建音频项
function createAudioItem(audio, index) {
    const container = document.createElement('div');
    container.className = 'audio-item-container';
    container.dataset.index = index;

    const audioElement = document.createElement('audio');
    audioElement.src = audio.url;
    audioElement.controls = true;
    audioElement.className = 'audio-item';
    container.appendChild(audioElement);
    
    // 添加删除按钮
    addDeleteButton(container, 'audios', index);
    
    return container;
}

// 添加删除按钮
function addDeleteButton(container, type, index) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteMediaItem(currentSchoolId, type, index);
    };
    
    const controls = document.createElement('div');
    controls.className = 'media-controls';
    controls.appendChild(deleteBtn);
    container.appendChild(controls);
}

// 创建文本项
function createTextItem(textData, index) {
    const container = document.createElement('div');
    container.className = 'text-item';
    container.dataset.index = index;
    
    const title = document.createElement('h4');
    title.textContent = textData.title || '个人回忆';
    
    const content = document.createElement('p');
    content.textContent = textData.content;
    
    const controls = document.createElement('div');
    controls.className = 'text-controls';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'button';
    editBtn.textContent = '编辑';
    editBtn.onclick = () => editTextItem(currentSchoolId, index, textData);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'button';
    deleteBtn.textContent = '删除';
    deleteBtn.onclick = () => deleteTextItem(currentSchoolId, index);
    
    controls.appendChild(editBtn);
    controls.appendChild(deleteBtn);
    
    container.appendChild(title);
    container.appendChild(content);
    container.appendChild(controls);
    
    return container;
}

// 设置多媒体上传功能
function setupMediaUpload(schoolId) {
    const school = schools.find(s => s.id === schoolId);
    
    // 照片上传
    document.querySelector('[data-type="photo"]').onclick = () => {
        document.getElementById('photoUpload').click();
    };
    
    document.getElementById('photoUpload').onchange = (e) => {
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                school.media.photos.push({
                    url: event.target.result,
                    type: 'file',
                    title: file.name
                });
                displayMediaContent(school);
            };
            reader.readAsDataURL(file);
        });
    };
    
    // 视频上传
    document.querySelector('[data-type="video"]').onclick = () => {
        document.getElementById('videoUpload').click();
    };
    
    document.getElementById('videoUpload').onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            school.media.videos.push({
                url: event.target.result,
                type: 'file',
                title: file.name
            });
            displayMediaContent(school);
        };
        reader.readAsDataURL(file);
    };
    
    // 视频链接添加
    document.querySelector('.add-link-btn').onclick = () => {
        const link = prompt('请输入视频链接(YouTube/Bilibili等):');
        if (link) {
            school.media.videos.push({
                url: link,
                type: 'link',
                title: '外部视频'
            });
            displayMediaContent(school);
        }
    };
    
    // 音频上传
    document.querySelector('[data-type="audio"]').onclick = () => {
        document.getElementById('audioUpload').click();
    };
    
    document.getElementById('audioUpload').onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            school.media.audios.push({
                url: event.target.result,
                type: 'file',
                title: file.name
            });
            displayMediaContent(school);
        };
        reader.readAsDataURL(file);
    };
    
    // 添加文字记录
    document.querySelector('.add-text-btn').onclick = () => {
        const title = prompt('请输入记录标题:');
        if (title) {
            const content = prompt('请输入记录内容:');
            if (content) {
                school.media.texts.push({
                    title: title,
                    content: content
                });
                displayMediaContent(school);
            }
        }
    };
}

// 初始化排序功能
function initSortable() {
    if (typeof Sortable === 'undefined') {
        setTimeout(initSortable, 100);
        return;
    }
    
    // 照片排序
    new Sortable(document.getElementById('modalSchoolPhotos'), {
        animation: 150,
        handle: '.sort-handle',
        onEnd: function() {
            updateMediaOrder('photos');
        }
    });
    
    // 视频排序
    new Sortable(document.getElementById('modalSchoolVideos'), {
        animation: 150,
        handle: '.sort-handle',
        onEnd: function() {
            updateMediaOrder('videos');
        }
    });
    
    // 音频排序
    new Sortable(document.getElementById('modalSchoolSongs'), {
        animation: 150,
        handle: '.sort-handle',
        onEnd: function() {
            updateMediaOrder('audios');
        }
    });
    
    // 文本排序
    new Sortable(document.getElementById('modalPersonalFeelings'), {
        animation: 150,
        handle: '.sort-handle',
        onEnd: function() {
            updateMediaOrder('texts');
        }
    });
}

// 更新媒体项顺序
function updateMediaOrder(type) {
    const school = schools.find(s => s.id === currentSchoolId);
    const containerId = type === 'texts' ? 'modalPersonalFeelings' : `modalSchool${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const container = document.getElementById(containerId);
    
    const newOrder = Array.from(container.children).map(el => parseInt(el.dataset.index));
    school.media[type] = newOrder.map(i => school.media[type][i]);
    displayMediaContent(school);
}

// 删除媒体项
function deleteMediaItem(schoolId, type, index) {
    if (confirm('确定要删除此项吗？')) {
        const school = schools.find(s => s.id === schoolId);
        if (school && school.media && school.media[type]) {
            school.media[type].splice(index, 1);
            displayMediaContent(school);
        }
    }
}

// 编辑文本项
function editTextItem(schoolId, index, data) {
    const school = schools.find(s => s.id === schoolId);
    const newTitle = prompt('请输入新的标题:', data.title);
    if (newTitle !== null) {
        const newContent = prompt('请输入新的内容:', data.content);
        if (newContent !== null) {
            school.media.texts[index] = {
                title: newTitle,
                content: newContent
            };
            displayMediaContent(school);
        }
    }
}

// 删除文本项
function deleteTextItem(schoolId, index) {
    if (confirm('确定要删除此项吗？')) {
        const school = schools.find(s => s.id === schoolId);
        school.media.texts.splice(index, 1);
        displayMediaContent(school);
    }
}

// 显示坐标标签
function showCoordinates(position, longitude, latitude) {
    const existingLabel = viewer.entities.getById('clickCoordinateLabel');
    if (existingLabel) {
        viewer.entities.remove(existingLabel);
    }
    
    viewer.entities.add({
        id: 'clickCoordinateLabel',
        position: position,
        label: {
            text: `📍 点击位置坐标\n经度: ${longitude.toFixed(6)}\n纬度: ${latitude.toFixed(6)}`,
            font: 'bold 14px sans-serif',
            fillColor: Cesium.Color.YELLOW,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            showBackground: true,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, 20),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
        }
    });
    
    setTimeout(() => {
        const label = viewer.entities.getById('clickCoordinateLabel');
        if (label) {
            viewer.entities.remove(label);
        }
    }, 5000);
}

// 飞行到指定学校
function flyToSchool(schoolId) {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(school.longitude, school.latitude, 2000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0.0
            }
        });
    }
}

// 高亮显示左侧列表项
function highlightSchoolItem(schoolId) {
    document.querySelectorAll('.school-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.school-item[data-school="${schoolId}"]`).classList.add('active');
}

// 创建自定义图标（类似感叹号）
function createIcon(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const context = canvas.getContext('2d');

    // 绘制感叹号
    context.beginPath();
    context.moveTo(12, 4);
    context.lineTo(12, 16);
    context.strokeStyle = color.toCssColorString();
    context.lineWidth = 4;
    context.stroke();

    context.beginPath();
    context.arc(12, 20, 2, 0, 2 * Math.PI);
    context.fillStyle = color.toCssColorString();
    context.fill();

    return canvas.toDataURL();
}

// 页面加载完成后执行初始化函数
window.onload = function () {
    initCesium();
};

// 3D/2D模式转换按钮事件
document.getElementById('scene3DButton').addEventListener('click', function () {
    viewer.scene.mode = Cesium.SceneMode.SCENE3D;
});

document.getElementById('scene2DButton').addEventListener('click', function () {
    viewer.scene.mode = Cesium.SceneMode.SCENE2D;
});

// 登录按钮事件
document.getElementById('loginButton').addEventListener('click', function () {
    window.location.href = 'login.html';
});

// 用户按钮事件
document.getElementById('userButton').addEventListener('click', function () {
    window.location.href = 'profile.html';
});

// 搜索和筛选功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const searchInput = document.getElementById('schoolSearch');
    const timeFilter = document.getElementById('timeFilter');
    const searchButton = document.getElementById('searchButton');
    const resetButton = document.getElementById('resetButton');
    const schoolItems = document.querySelectorAll('.school-item');

    // 搜索函数
    function performSearch() {
        const keyword = searchInput.value.toLowerCase();
        const timePeriod = timeFilter.value;
        
        schoolItems.forEach(item => {
            const schoolName = item.querySelector('.school-name').textContent.toLowerCase();
            const schoolStage = item.querySelector('.school-stage').textContent;
            const matchesKeyword = keyword === '' || schoolName.includes(keyword);
            const matchesTime = timePeriod === '' || schoolStage === timePeriod;
            
            if (matchesKeyword && matchesTime) {
                item.classList.add('highlight');
                item.classList.remove('no-match');
            } else {
                item.classList.remove('highlight');
                item.classList.add('no-match');
            }
        });
    }

    // 重置函数
    function resetSearch() {
        searchInput.value = '';
        timeFilter.value = '';
        schoolItems.forEach(item => {
            item.classList.remove('highlight', 'no-match');
        });
    }

    // 事件监听
    searchButton.addEventListener('click', performSearch);
    resetButton.addEventListener('click', resetSearch);
    
    // 回车键触发搜索
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

// 教育轨迹数据
const educationData = [
    { id: '卓越小学', name: '山东省德州市陵城区卓越小学', stage: '小学', period: '2010.9-2016.6', duration: '5年9个月' },
    { id: '第六中学', name: '山东省德州市陵城区第六中学', stage: '初中', period: '2016.9-2019.6', duration: '2年9个月' },
    { id: '第一中学', name: '山东省德州市陵城区第一中学', stage: '高中', period: '2019.9-2022.6', duration: '2年9个月' },
    { id: '南宁师大', name: '南宁师范大学', stage: '大学', period: '2022.9-2026.6', duration: '3年9个月' }
];

// 初始化教育轨迹功能
function initEducationTrack() {
    setupEducationControls();
}

// 设置教育控制按钮
function setupEducationControls() {
    const showTimelineBtn = document.getElementById('showTimelineBtn');
    const showStatsBtn = document.getElementById('showStatsBtn');
    const showOverviewBtn = document.getElementById('showOverviewBtn');
    const educationTimeline = document.getElementById('educationTimeline');
    const educationStats = document.getElementById('educationStats');
    const educationOverview = document.getElementById('educationOverview');
    
    // 为所有关闭按钮添加事件
    document.querySelectorAll('.close-panel-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.parentElement.style.display = 'none';
        });
    });
    
    // 时间线按钮事件
    showTimelineBtn.addEventListener('click', function() {
        educationTimeline.style.display = educationTimeline.style.display === 'block' ? 'none' : 'block';
        if (educationTimeline.style.display === 'block') {
            initEducationTimeline();
        }
    });
    
    // 统计按钮事件
    showStatsBtn.addEventListener('click', function() {
        educationStats.style.display = educationStats.style.display === 'block' ? 'none' : 'block';
        if (educationStats.style.display === 'block') {
            initEducationStats();
        }
    });
    
    // 总览按钮事件
    showOverviewBtn.addEventListener('click', function() {
        educationOverview.style.display = educationOverview.style.display === 'block' ? 'none' : 'block';
        if (educationOverview.style.display === 'block') {
            initEducationOverview();
        }
    });
    
    // 点击外部关闭弹窗
    [educationTimeline, educationStats, educationOverview].forEach(panel => {
        panel.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

// 初始化教育时间线
function initEducationTimeline() {
    const container = document.getElementById('timeline');
    const items = new vis.DataSet(educationData.map(school => {
        const [start, end] = school.period.split('-');
        return {
            id: school.id,
            content: `${school.stage}: ${school.name}`,
            start: parseEducationDate(start),
            end: parseEducationDate(end),
            className: school.stage.toLowerCase()
        };
    }));
    
    const options = {
        zoomable: true,
        moveable: true,
        orientation: 'top',
        showCurrentTime: false,
        margin: {
            item: 10,
            axis: 5
        },
        groupOrder: function(a, b) {
            const order = { '小学': 1, '初中': 2, '高中': 3, '大学': 4 };
            return order[a.content.split(':')[0]] - order[b.content.split(':')[0]];
        }
    };
    
    new vis.Timeline(container, items, options);
}

// 初始化教育统计
function initEducationStats() {
    const ctx = document.getElementById('statsChart');
    if (!ctx) return;
    
    // 如果已有图表实例则销毁
    if (window.educationChart) {
        window.educationChart.destroy();
    }

    // 准备数据
    const stageData = {
        '小学': { duration: 5.75, color: 'rgba(255, 206, 86, 0.7)' },
        '初中': { duration: 2.75, color: 'rgba(75, 192, 192, 0.7)' },
        '高中': { duration: 2.75, color: 'rgba(54, 162, 235, 0.7)' },
        '大学': { duration: 3.75, color: 'rgba(255, 99, 132, 0.7)' }
    };

    // 创建新图表
    window.educationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(stageData),
            datasets: [{
                label: '就读时长 (年)',
                data: Object.values(stageData).map(v => v.duration),
                backgroundColor: Object.values(stageData).map(v => v.color),
                borderColor: Object.values(stageData).map(v => v.color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '就读时长 (年)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '年';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const years = Math.floor(context.parsed.y);
                            const months = Math.round((context.parsed.y - years) * 12);
                            return `${years}年${months > 0 ? months + '个月' : ''}`;
                        }
                    }
                }
            }
        }
    });
}

// 初始化教育总览
function initEducationOverview() {
    const overviewContent = document.getElementById('overviewContent');
    overviewContent.innerHTML = '';
    
    educationData.forEach(school => {
        const item = document.createElement('div');
        item.className = 'education-overview-item';
        
        const stage = document.createElement('div');
        stage.className = 'education-overview-stage';
        stage.textContent = school.stage;
        
        const details = document.createElement('div');
        details.className = 'education-overview-details';
        
        const name = document.createElement('div');
        name.textContent = school.name;
        
        const period = document.createElement('div');
        period.className = 'education-overview-period';
        period.textContent = `${school.period} (${school.duration})`;
        
        details.appendChild(name);
        details.appendChild(period);
        
        item.appendChild(stage);
        item.appendChild(details);
        
        overviewContent.appendChild(item);
    });
}

// 解析教育日期
function parseEducationDate(dateStr) {
    const [year, month] = dateStr.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
}

// 页面加载完成后初始化教育轨迹功能
window.addEventListener('load', function() {
    initEducationTrack();
});

// 加载学校数据到批量操作表格
function loadSchoolsForBatchOperation() {
    const tbody = document.getElementById('batchOperationTableBody');
    tbody.innerHTML = '';
    
    schools.forEach(school => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="enhanced-checkbox-cell"><input type="checkbox" class="school-checkbox" data-id="${school.id}"></td>
            <td>${school.name}</td>
            <td>${school.stage}</td>
            <td>${school.period}</td>
            <td>
                <button class="button edit-school-btn" data-id="${school.id}">编辑</button>
                <button class="button delete-school-btn" data-id="${school.id}">删除</button>
            </td>
        `;
        tbody.appendChild(row);
        
        // 编辑按钮事件
        row.querySelector('.edit-school-btn').addEventListener('click', function() {
            editSchool(this.getAttribute('data-id'));
        });
        
        // 删除按钮事件
        row.querySelector('.delete-school-btn').addEventListener('click', function() {
            deleteSchool(this.getAttribute('data-id'));
        });
    });
    
    // 全选/取消全选
    document.getElementById('selectAllSchools').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.school-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = this.checked;
        });
    });
}

// 保存学校数据
function saveSchoolData() {
    const schoolData = {
        id: document.getElementById('schoolId').value || generateId(),
        name: document.getElementById('schoolName').value,
        stage: document.getElementById('schoolStage').value,
        longitude: parseFloat(document.getElementById('schoolLongitude').value),
        latitude: parseFloat(document.getElementById('schoolLatitude').value),
        period: document.getElementById('schoolPeriod').value,
        classInfo: document.getElementById('schoolClassInfo').value,
        description: document.getElementById('schoolDescription').value,
        media: {
            photos: [],
            videos: [],
            audios: [],
            texts: []
        }
    };
    
    // 检查是新增还是编辑
    const existingIndex = schools.findIndex(s => s.id === schoolData.id);
    
    if (existingIndex >= 0) {
        // 编辑现有学校
        schools[existingIndex] = schoolData;
        alert('学校信息已更新');
    } else {
        // 添加新学校
        schools.push(schoolData);
        alert('新学校已添加');
    }
    
    // 更新地图标记
    updateSchoolMarkers();
    // 更新左侧列表
    updateSchoolList();
    // 关闭模态框
    document.getElementById('schoolFormModal').style.display = 'none';
}

// 编辑学校
function editSchool(schoolId) {
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;
    
    document.getElementById('schoolFormTitle').textContent = '编辑学校';
    document.getElementById('schoolId').value = school.id;
    document.getElementById('schoolName').value = school.name;
    document.getElementById('schoolStage').value = school.stage;
    document.getElementById('schoolLongitude').value = school.longitude;
    document.getElementById('schoolLatitude').value = school.latitude;
    document.getElementById('schoolPeriod').value = school.period;
    document.getElementById('schoolClassInfo').value = school.classInfo;
    document.getElementById('schoolDescription').value = school.description || '';
    
    document.getElementById('schoolFormModal').style.display = 'flex';
}

// 删除学校
function deleteSchool(schoolId) {
    if (confirm('确定要删除这所学校吗？')) {
        const index = schools.findIndex(s => s.id === schoolId);
        if (index >= 0) {
            schools.splice(index, 1);
            alert('学校已删除');
            updateSchoolMarkers();
            updateSchoolList();
        }
    }
}

// 批量删除学校
function batchDeleteSchools() {
    const selectedIds = getSelectedSchoolIds();
    if (selectedIds.length === 0) {
        alert('请至少选择一所学校');
        return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedIds.length} 所学校吗？`)) {
        selectedIds.forEach(id => {
            const index = schools.findIndex(s => s.id === id);
            if (index >= 0) {
                schools.splice(index, 1);
            }
        });
        alert('批量删除完成');
        updateSchoolMarkers();
        updateSchoolList();
    }
}

// 应用批量操作
function applyBatchOperation() {
    const selectedIds = getSelectedSchoolIds();
    if (selectedIds.length === 0) {
        alert('请至少选择一所学校');
        return;
    }
    
    const operationType = document.getElementById('batchOperationType').value;
    let newValue;
    
    if (operationType === 'stage') {
        newValue = prompt('请输入新的教育阶段:');
        if (!newValue) return;
    } else if (operationType === 'period') {
        newValue = prompt('请输入新的就读时间(例如: 2010.9-2016.6):');
        if (!newValue) return;
    }
    
    selectedIds.forEach(id => {
        const school = schools.find(s => s.id === id);
        if (school) {
            school[operationType] = newValue;
        }
    });
    
    alert('批量更新完成');
    updateSchoolMarkers();
    updateSchoolList();
}

// 获取选中的学校ID
function getSelectedSchoolIds() {
    const checkboxes = document.querySelectorAll('.school-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
}

// 更新学校标记
function updateSchoolMarkers() {
    // 清除所有现有标记
    viewer.entities.removeAll();
    // 重新添加所有学校标记
    addSchoolMarkers();
}

// 更新左侧学校列表
function updateSchoolList() {
    const schoolList = document.getElementById('schoolList');
    schoolList.innerHTML = '';
    
    schools.forEach(school => {
        const item = document.createElement('div');
        item.className = 'school-item';
        item.setAttribute('data-school', school.id);
        
        item.innerHTML = `
            <div class="school-stage">${school.stage}</div>
            <div class="school-name-container">
                <div class="school-name">${school.name}</div>
                <div class="toggle-btn"></div>
            </div>
        `;
        
        // 添加点击事件
        item.addEventListener('click', function() {
            flyToSchool(school.id);
            highlightSchoolItem(school.id);
        });
        
        // 添加详情按钮事件
        const toggleBtn = item.querySelector('.toggle-btn');
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showSchoolModal(school.id);
        });
        
        schoolList.appendChild(item);
    });
}

// 更新导出数据预览
function updateExportDataPreview() {
    const exportData = schools.map(school => ({
        id: school.id,
        name: school.name,
        stage: school.stage,
        longitude: school.longitude,
        latitude: school.latitude,
        period: school.period,
        classInfo: school.classInfo,
        description: school.description
    }));
    
    document.getElementById('exportDataPreview').value = JSON.stringify(exportData, null, 2);
}

// 导出为JSON
function exportToJson() {
    const data = document.getElementById('exportDataPreview').value;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'education_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// 导出为Excel
function exportToExcel() {
    try {
        const jsonData = JSON.parse(document.getElementById('exportDataPreview').value);
        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "教育数据");
        XLSX.writeFile(wb, "education_data.xlsx");
    } catch (e) {
        alert('导出Excel失败: ' + e.message);
    }
}

// 生成随机ID
function generateId() {
    return 'school-' + Math.random().toString(36).substr(2, 9);
}