// Image Slider Pro - Complete Working Solution

// Global Variables
let images = [];
let currentSlide = 0;
let isPlaying = true;
let slideInterval;
let isSingleEditMode = true; // Default to single edit mode
let autoPlaySpeed = 3000;
let currentTransition = 'slide';
let currentZoomLevel = 100;

// Default Images (Loaded automatically)
const defaultImages = [
    {
        id: 'default-1',
        name: 'Beautiful Mountain',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        size: '2.4 MB',
        type: 'default'
    },
    {
        id: 'default-2',
        name: 'Ocean Waves',
        url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        size: '1.8 MB',
        type: 'default'
    },
    {
        id: 'default-3',
        name: 'Forest Path',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        size: '2.1 MB',
        type: 'default'
    },
    {
        id: 'default-4',
        name: 'City Lights',
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        size: '3.2 MB',
        type: 'default'
    },
    {
        id: 'default-5',
        name: 'Desert Sunset',
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        size: '2.7 MB',
        type: 'default'
    }
];

// DOM Elements
const slider = document.getElementById('slider');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const currentSlideEl = document.getElementById('current-slide');
const totalSlidesEl = document.getElementById('total-slides');
const slideTitle = document.getElementById('slide-title');
const slideDescription = document.getElementById('slide-description');
const progressBar = document.getElementById('progress-bar');
const imageGallery = document.getElementById('image-gallery');
const emptyGallery = document.getElementById('empty-gallery');
const imageCount = document.getElementById('image-count');

// Editor Elements
const brightnessSlider = document.getElementById('brightness-slider');
const contrastSlider = document.getElementById('contrast-slider');
const saturationSlider = document.getElementById('saturation-slider');
const blurSlider = document.getElementById('blur-slider');
const brightnessValueDisplay = document.getElementById('brightness-value-display');
const contrastValueDisplay = document.getElementById('contrast-value-display');
const saturationValueDisplay = document.getElementById('saturation-value-display');
const blurValueDisplay = document.getElementById('blur-value-display');

// Edit Mode Elements
const singleEditToggle = document.getElementById('single-edit-toggle');
const editModeStatus = document.getElementById('edit-mode-status');
const editModeBar = document.getElementById('edit-mode-bar');
const editorModeBadge = document.getElementById('editor-mode-badge');
const selectedImagePreview = document.getElementById('selected-image-preview');
const editorPreview = document.getElementById('editor-preview');
const editorImageName = document.getElementById('editor-image-name');
const editorImageSize = document.getElementById('editor-image-size');

// Settings Controls
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const autoplaySwitch = document.getElementById('autoplay-switch');
const loopSwitch = document.getElementById('loop-switch');
const transitionOptions = document.querySelectorAll('.transition-option');

// Zoom Controls
const zoomOutBtn = document.getElementById('zoom-out-btn');
const zoomInBtn = document.getElementById('zoom-in-btn');
const resetZoomBtn = document.getElementById('reset-zoom-btn');
const zoomLevelDisplay = document.getElementById('zoom-level-display');
const imageFullscreenBtn = document.getElementById('image-fullscreen-btn');

// Buttons
const uploadMainBtn = document.getElementById('upload-main-btn');
const uploadGalleryBtn = document.getElementById('upload-gallery-btn');
const fileInput = document.getElementById('file-input');
const shuffleBtn = document.getElementById('shuffle-btn');
const reverseBtn = document.getElementById('reverse-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const saveProjectBtn = document.getElementById('save-project-btn');
const downloadSlideBtn = document.getElementById('download-slide-btn');

// Editor Buttons
const presetFilters = document.querySelectorAll('.preset-filter');
const rotateLeftBtn = document.getElementById('rotate-left-btn');
const rotateRightBtn = document.getElementById('rotate-right-btn');
const flipHorizontalBtn = document.getElementById('flip-horizontal-btn');
const flipVerticalBtn = document.getElementById('flip-vertical-btn');
const resetEditorBtn = document.getElementById('reset-editor-btn');
const applyChangesBtn = document.getElementById('apply-changes-btn');
const downloadEditedBtn = document.getElementById('download-edited-btn');
const applyToAllBtn = document.getElementById('apply-to-all-btn');

// Modal Elements
const featuresBtn = document.getElementById('features-btn');
const themeToggle = document.getElementById('theme-toggle');
const featuresModal = document.getElementById('features-modal');
const closeFeaturesBtn = document.getElementById('close-features');

// Current Editor Settings
let currentEditorSettings = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
    filter: 'normal'
};

// Image Fullscreen Elements
let imageFullscreenOverlay;
let imageFullscreenImg;
let closeFullscreenBtn;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Create image fullscreen overlay
    createImageFullscreenOverlay();
    
    // Set single edit mode to ON by default
    singleEditToggle.checked = true;
    isSingleEditMode = true;
    editModeStatus.textContent = 'ON';
    editorModeBadge.textContent = 'Single Image';
    
    // Load saved images from localStorage
    loadSavedImages();
    
    // If no saved images, load defaults
    if (images.length === 0) {
        loadDefaultImages();
    } else {
        renderSlider();
        renderGallery();
        startSlideshow();
    }
    
    setupEventListeners();
    updateImageCount();
    showNotification('Welcome to Image Slider Pro!', 'info');
}

// Create Image Fullscreen Overlay
function createImageFullscreenOverlay() {
    imageFullscreenOverlay = document.createElement('div');
    imageFullscreenOverlay.className = 'image-fullscreen-overlay';
    imageFullscreenOverlay.innerHTML = `
        <div class="image-fullscreen-container">
            <img id="fullscreen-image" src="" alt="">
            <button class="close-fullscreen">&times;</button>
        </div>
    `;
    document.body.appendChild(imageFullscreenOverlay);
    
    imageFullscreenImg = document.getElementById('fullscreen-image');
    closeFullscreenBtn = document.querySelector('.close-fullscreen');
    
    closeFullscreenBtn.addEventListener('click', closeImageFullscreen);
    imageFullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === imageFullscreenOverlay) {
            closeImageFullscreen();
        }
    });
}

// Open Image Fullscreen
function openImageFullscreen() {
    if (images.length === 0) return;
    
    const currentImage = images[currentSlide];
    imageFullscreenImg.src = currentImage.url;
    imageFullscreenImg.alt = currentImage.name;
    
    // Apply current zoom and transformations to fullscreen image
    applyZoomToFullscreenImage();
    
    imageFullscreenOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Image Fullscreen
function closeImageFullscreen() {
    imageFullscreenOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Apply zoom to fullscreen image
function applyZoomToFullscreenImage() {
    if (!imageFullscreenImg) return;
    
    const zoomScale = currentZoomLevel / 100;
    imageFullscreenImg.style.transform = `scale(${zoomScale})`;
    imageFullscreenImg.style.transformOrigin = 'center center';
}

// Load Default Images
function loadDefaultImages() {
    images = defaultImages.map(img => ({
        ...img,
        settings: { ...currentEditorSettings }
    }));
    
    renderSlider();
    renderGallery();
    startSlideshow();
}

// Load Saved Images from localStorage
function loadSavedImages() {
    const savedImages = localStorage.getItem('imageSliderProImages');
    const savedCurrentSlide = localStorage.getItem('imageSliderProCurrentSlide');
    
    if (savedImages) {
        try {
            const parsedImages = JSON.parse(savedImages);
            
            // Ensure all images have settings property
            parsedImages.forEach(img => {
                if (!img.settings) {
                    img.settings = { ...currentEditorSettings };
                }
                
                // Ensure URLs are valid
                if (img.url && img.url.startsWith('blob:')) {
                    console.warn('Blob URL found, replacing with default');
                    // Replace blob URLs with default images
                    const defaultImg = defaultImages.find(d => d.id === img.id);
                    if (defaultImg) {
                        img.url = defaultImg.url;
                    }
                }
            });
            
            images = parsedImages;
            
            if (savedCurrentSlide) {
                currentSlide = parseInt(savedCurrentSlide);
                if (currentSlide >= images.length) {
                    currentSlide = 0;
                }
            }
        } catch (e) {
            console.error('Error loading saved images:', e);
            images = [];
        }
    }
}

// Save Images to localStorage
function saveImagesToStorage() {
    try {
        // Prepare images for storage
        const imagesForStorage = images.map(img => {
            // Create a clean copy without File objects
            const cleanImage = {
                id: img.id,
                name: img.name,
                url: img.url,
                size: img.size,
                type: img.type,
                settings: img.settings
            };
            
            // Handle base64 images - they're already strings
            // For blob URLs, we need to convert them to base64
            if (img.url && img.url.startsWith('blob:')) {
                // If we have a file object, we can read it
                if (img.file) {
                    // Convert blob to base64
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            cleanImage.url = e.target.result;
                            resolve(cleanImage);
                        };
                        reader.readAsDataURL(img.file);
                    });
                } else {
                    // If no file object, keep the blob URL but it won't persist
                    console.warn('Cannot save blob URL without file object');
                }
            }
            
            return Promise.resolve(cleanImage);
        });
        
        // Wait for all promises to resolve
        Promise.all(imagesForStorage).then((processedImages) => {
            // Filter out any undefined images
            const validImages = processedImages.filter(img => img && img.url);
            localStorage.setItem('imageSliderProImages', JSON.stringify(validImages));
            localStorage.setItem('imageSliderProCurrentSlide', currentSlide.toString());
        }).catch(error => {
            console.error('Error processing images for storage:', error);
            // Save what we can
            const simpleImages = images.map(img => ({
                id: img.id,
                name: img.name,
                url: img.url && !img.url.startsWith('blob:') ? img.url : '',
                size: img.size,
                type: img.type,
                settings: img.settings
            })).filter(img => img.url); // Only save images with valid URLs
            
            localStorage.setItem('imageSliderProImages', JSON.stringify(simpleImages));
            localStorage.setItem('imageSliderProCurrentSlide', currentSlide.toString());
        });
    } catch (e) {
        console.error('Error saving images:', e);
        // Try a simpler save
        try {
            const simpleImages = images.map(img => ({
                id: img.id,
                name: img.name,
                url: img.type === 'default' ? img.url : '', // Only save default image URLs
                size: img.size,
                type: img.type,
                settings: img.settings
            }));
            localStorage.setItem('imageSliderProImages', JSON.stringify(simpleImages));
            localStorage.setItem('imageSliderProCurrentSlide', currentSlide.toString());
        } catch (e2) {
            console.error('Failed to save images:', e2);
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Upload Buttons
    uploadMainBtn.addEventListener('click', () => fileInput.click());
    uploadGalleryBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    
    // Gallery Actions
    shuffleBtn.addEventListener('click', shuffleImages);
    reverseBtn.addEventListener('click', reverseImages);
    clearAllBtn.addEventListener('click', clearAllImages);
    saveProjectBtn.addEventListener('click', () => {
        showNotification('Save project feature is disabled', 'info');
    });
    
    // Slide Actions
    downloadSlideBtn.addEventListener('click', downloadCurrentImage);
    
    // Zoom & Fullscreen Controls
    zoomOutBtn.addEventListener('click', () => adjustZoom(-20));
    zoomInBtn.addEventListener('click', () => adjustZoom(20));
    resetZoomBtn.addEventListener('click', resetZoom);
    imageFullscreenBtn.addEventListener('click', openImageFullscreen);
    
    // Editor Controls
    brightnessSlider.addEventListener('input', updateEditorValues);
    contrastSlider.addEventListener('input', updateEditorValues);
    saturationSlider.addEventListener('input', updateEditorValues);
    blurSlider.addEventListener('input', updateEditorValues);
    
    // Preset Filters
    presetFilters.forEach(btn => {
        btn.addEventListener('click', () => applyPresetFilter(btn.dataset.filter));
    });
    
    // Transformations
    rotateLeftBtn.addEventListener('click', () => rotateImage(-90));
    rotateRightBtn.addEventListener('click', () => rotateImage(90));
    flipHorizontalBtn.addEventListener('click', () => flipImage('horizontal'));
    flipVerticalBtn.addEventListener('click', () => flipImage('vertical'));
    
    // Editor Actions
    resetEditorBtn.addEventListener('click', resetEditor);
    applyChangesBtn.addEventListener('click', applyEditorChanges);
    downloadEditedBtn.addEventListener('click', downloadEditedImage);
    applyToAllBtn.addEventListener('click', applyToAllImages);
    
    // Settings Controls
    speedSlider.addEventListener('input', updateSpeed);
    autoplaySwitch.addEventListener('change', toggleAutoplay);
    transitionOptions.forEach(option => {
        option.addEventListener('click', () => setTransition(option.dataset.transition));
    });
    
    // Edit Mode Toggle
    singleEditToggle.addEventListener('change', toggleSingleEditMode);
    
    // Modal Controls
    featuresBtn.addEventListener('click', () => showModal('features'));
    themeToggle.addEventListener('click', toggleTheme);
    
    closeFeaturesBtn.addEventListener('click', () => hideModal('features'));
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === featuresModal) hideModal('features');
    });
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Drag and Drop
    setupDragAndDrop();
    
    // Load saved theme
    loadTheme();
    
    // Save images before page unload
    window.addEventListener('beforeunload', saveImagesToStorage);
    
    // Auto-save images periodically
    setInterval(saveImagesToStorage, 10000); // Save every 10 seconds
}

// Handle File Upload
function handleFileUpload(event) {
    const files = event.target.files;
    if (!files.length) return;
    
    let uploadedCount = 0;
    const totalFiles = Array.from(files).length;
    const newImages = [];
    
    Array.from(files).forEach((file, index) => {
        if (!file.type.startsWith('image/')) {
            showNotification(`File "${file.name}" is not an image`, 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`File "${file.name}" exceeds 10MB limit`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageId = `uploaded-${Date.now()}-${index}`;
            const imageName = file.name.replace(/\.[^/.]+$/, "");
            
            const imageData = {
                id: imageId,
                name: imageName,
                url: e.target.result, // This is base64
                size: formatFileSize(file.size),
                originalSize: file.size,
                file: file,
                settings: { ...currentEditorSettings },
                type: 'uploaded'
            };
            
            newImages.push(imageData);
            uploadedCount++;
            
            if (uploadedCount === totalFiles) {
                // Add all new images at once
                images.push(...newImages);
                
                renderSlider();
                renderGallery();
                
                if (images.length === newImages.length) {
                    // First upload, start slideshow
                    startSlideshow();
                }
                
                // Save to localStorage
                saveImagesToStorage();
                
                showNotification(`Uploaded ${uploadedCount} image(s) successfully`, 'success');
                fileInput.value = '';
            }
        };
        
        reader.onerror = function() {
            showNotification(`Error reading file "${file.name}"`, 'error');
            uploadedCount++;
        };
        
        reader.readAsDataURL(file);
    });
}

// Render Slider
function renderSlider() {
    slider.innerHTML = '';
    
    if (images.length === 0) {
        slideTitle.textContent = 'No Image Selected';
        slideDescription.textContent = 'Upload images to begin';
        currentSlideEl.textContent = '0';
        selectedImagePreview.style.display = 'none';
        editModeBar.style.display = 'none';
        return;
    }
    
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.setAttribute('data-id', image.id);
        slide.setAttribute('data-index', index);
        
        const img = document.createElement('img');
        img.id = `image-${image.id}`;
        img.src = image.url;
        img.alt = image.name;
        img.draggable = false;
        img.style.transform = `scale(${currentZoomLevel / 100})`;
        img.style.transformOrigin = 'center center';
        
        // Apply saved settings if any
        if (image.settings) {
            applyImageSettings(img, image.settings);
        }
        
        slide.appendChild(img);
        slider.appendChild(slide);
    });
    
    updateSlideInfo();
    updateTotalSlides();
    goToSlide(currentSlide);
}

// Render Gallery
function renderGallery() {
    if (images.length === 0) {
        imageGallery.innerHTML = emptyGallery.outerHTML;
        // Reattach event listener to upload button
        const newUploadBtn = document.getElementById('upload-gallery-btn');
        if (newUploadBtn) {
            newUploadBtn.addEventListener('click', () => fileInput.click());
        }
        return;
    }
    
    imageGallery.innerHTML = '';
    
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${index === currentSlide ? 'active' : ''}`;
        galleryItem.setAttribute('data-index', index);
        
        galleryItem.innerHTML = `
            <div class="gallery-thumb">
                <img src="${image.url}" alt="${image.name}" loading="lazy">
            </div>
            <div class="gallery-details">
                <h4>${image.name}</h4>
                <p>${image.size}</p>
            </div>
            <button class="remove-image" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        galleryItem.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-image')) {
                goToSlide(index);
            }
        });
        
        imageGallery.appendChild(galleryItem);
    });
    
    // Add remove button listeners
    document.querySelectorAll('.remove-image').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            removeImage(index);
        });
    });
    
    updateImageCount();
}

// Update Slide Info
function updateSlideInfo() {
    if (images.length === 0) {
        slideTitle.textContent = 'No Image Selected';
        slideDescription.textContent = 'Upload images to begin';
        currentSlideEl.textContent = '0';
        selectedImagePreview.style.display = 'none';
        editModeBar.style.display = 'none';
        return;
    }
    
    const currentImage = images[currentSlide];
    slideTitle.textContent = currentImage.name;
    slideDescription.textContent = currentImage.size;
    currentSlideEl.textContent = currentSlide + 1;
    
    // Update editor preview
    updateEditorPreview();
    
    // Show edit mode bar
    editModeBar.style.display = 'flex';
    selectedImagePreview.style.display = 'flex';
}

// Update Editor Preview
function updateEditorPreview() {
    if (images.length === 0) return;
    
    const currentImage = images[currentSlide];
    editorPreview.src = currentImage.url;
    editorImageName.textContent = currentImage.name;
    editorImageSize.textContent = currentImage.size;
    
    // Load saved settings for current image
    if (currentImage.settings) {
        brightnessSlider.value = currentImage.settings.brightness;
        contrastSlider.value = currentImage.settings.contrast;
        saturationSlider.value = currentImage.settings.saturation;
        blurSlider.value = currentImage.settings.blur;
        currentEditorSettings = { ...currentImage.settings };
        
        // Update preset filters
        updatePresetButtons(currentImage.settings.filter);
    }
    
    updateEditorValues();
}

// Update Editor Values Display
function updateEditorValues() {
    currentEditorSettings.brightness = parseInt(brightnessSlider.value);
    currentEditorSettings.contrast = parseInt(contrastSlider.value);
    currentEditorSettings.saturation = parseInt(saturationSlider.value);
    currentEditorSettings.blur = parseInt(blurSlider.value);
    
    brightnessValueDisplay.textContent = `${currentEditorSettings.brightness}%`;
    contrastValueDisplay.textContent = `${currentEditorSettings.contrast}%`;
    saturationValueDisplay.textContent = `${currentEditorSettings.saturation}%`;
    blurValueDisplay.textContent = `${currentEditorSettings.blur}px`;
    
    // Apply changes to current image
    applyEditorChanges();
}

// Apply Editor Changes
function applyEditorChanges() {
    if (images.length === 0) return;
    
    const currentImage = images[currentSlide];
    const imageElement = document.getElementById(`image-${currentImage.id}`);
    
    if (!imageElement) return;
    
    // Apply settings to image
    applyImageSettings(imageElement, currentEditorSettings);
    
    // Save settings
    if (isSingleEditMode) {
        currentImage.settings = { ...currentEditorSettings };
    } else {
        // Apply to all images
        images.forEach(img => {
            img.settings = { ...currentEditorSettings };
            const imgElement = document.getElementById(`image-${img.id}`);
            if (imgElement) {
                applyImageSettings(imgElement, currentEditorSettings);
            }
        });
    }
    
    // Save to localStorage
    saveImagesToStorage();
}

// Apply Image Settings
function applyImageSettings(imageElement, settings) {
    let filter = '';
    filter += `brightness(${settings.brightness}%) `;
    filter += `contrast(${settings.contrast}%) `;
    filter += `saturate(${settings.saturation}%) `;
    filter += `blur(${settings.blur}px) `;
    
    // Apply preset filter effects
    switch(settings.filter) {
        case 'vintage':
            filter += 'sepia(0.5) hue-rotate(-30deg)';
            break;
        case 'dramatic':
            filter += 'contrast(1.2) saturate(1.2)';
            break;
        case 'warm':
            filter += 'hue-rotate(-10deg) saturate(1.2)';
            break;
        default:
            // Normal - no additional filter
            break;
    }
    
    let transform = `scale(${currentZoomLevel / 100}) `;
    if (settings.flipH) transform += 'scaleX(-1) ';
    if (settings.flipV) transform += 'scaleY(-1) ';
    transform += `rotate(${settings.rotation}deg)`;
    
    imageElement.style.filter = filter;
    imageElement.style.transform = transform;
    imageElement.style.transformOrigin = 'center center';
}

// Apply Preset Filter
function applyPresetFilter(preset) {
    currentEditorSettings.filter = preset;
    updatePresetButtons(preset);
    
    // Apply preset-specific settings
    switch(preset) {
        case 'vintage':
            brightnessSlider.value = 90;
            contrastSlider.value = 110;
            saturationSlider.value = 80;
            break;
        case 'dramatic':
            brightnessSlider.value = 80;
            contrastSlider.value = 130;
            saturationSlider.value = 90;
            break;
        case 'warm':
            brightnessSlider.value = 110;
            contrastSlider.value = 100;
            saturationSlider.value = 120;
            break;
        case 'normal':
            brightnessSlider.value = 100;
            contrastSlider.value = 100;
            saturationSlider.value = 100;
            blurSlider.value = 0;
            currentEditorSettings.rotation = 0;
            currentEditorSettings.flipH = false;
            currentEditorSettings.flipV = false;
            break;
    }
    
    updateEditorValues();
    applyEditorChanges();
}

// Update Preset Buttons
function updatePresetButtons(activePreset) {
    presetFilters.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activePreset);
    });
}

// Rotate Image
function rotateImage(degrees) {
    currentEditorSettings.rotation += degrees;
    applyEditorChanges();
}

// Flip Image
function flipImage(direction) {
    if (direction === 'horizontal') {
        currentEditorSettings.flipH = !currentEditorSettings.flipH;
    } else {
        currentEditorSettings.flipV = !currentEditorSettings.flipV;
    }
    applyEditorChanges();
}

// Reset Editor
function resetEditor() {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    blurSlider.value = 0;
    currentEditorSettings = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        rotation: 0,
        flipH: false,
        flipV: false,
        filter: 'normal'
    };
    
    updatePresetButtons('normal');
    updateEditorValues();
    showNotification('Editor reset to default settings', 'info');
}

// Apply to All Images
function applyToAllImages() {
    if (images.length === 0) return;
    
    images.forEach(img => {
        img.settings = { ...currentEditorSettings };
        const imgElement = document.getElementById(`image-${img.id}`);
        if (imgElement) {
            applyImageSettings(imgElement, currentEditorSettings);
        }
    });
    
    saveImagesToStorage();
    showNotification('Settings applied to all images', 'success');
}

// Zoom Functions
function adjustZoom(amount) {
    currentZoomLevel += amount;
    if (currentZoomLevel < 50) currentZoomLevel = 50;
    if (currentZoomLevel > 300) currentZoomLevel = 300;
    
    updateZoomDisplay();
    applyZoomToCurrentImage();
    
    // Update fullscreen image if open
    if (imageFullscreenOverlay.classList.contains('active')) {
        applyZoomToFullscreenImage();
    }
}

function resetZoom() {
    currentZoomLevel = 100;
    updateZoomDisplay();
    applyZoomToCurrentImage();
    showNotification('Zoom reset to 100%', 'info');
}

function updateZoomDisplay() {
    zoomLevelDisplay.textContent = `${currentZoomLevel}%`;
}

function applyZoomToCurrentImage() {
    if (images.length === 0) return;
    
    const currentImage = images[currentSlide];
    const imageElement = document.getElementById(`image-${currentImage.id}`);
    
    if (imageElement) {
        // Get current transform and replace scale
        let transform = imageElement.style.transform || '';
        
        // Remove existing scale and rotation
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
            transform = transform.replace(/scale\([^)]+\)/, `scale(${currentZoomLevel / 100})`);
        } else {
            transform = `scale(${currentZoomLevel / 100}) ${transform}`;
        }
        
        imageElement.style.transform = transform;
    }
}

// Go to Slide
function goToSlide(index) {
    if (images.length === 0 || index < 0 || index >= images.length) return;
    
    currentSlide = index;
    const translateX = -currentSlide * 100;
    
    // Apply transition
    switch(currentTransition) {
        case 'slide':
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(${translateX}%)`;
            break;
        case 'fade':
            slider.style.transition = 'opacity 0.5s ease';
            slider.style.opacity = '0';
            setTimeout(() => {
                slider.style.transform = `translateX(${translateX}%)`;
                slider.style.opacity = '1';
            }, 250);
            break;
        case 'zoom':
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(${translateX}%) scale(1.1)`;
            setTimeout(() => {
                slider.style.transform = `translateX(${translateX}%) scale(1)`;
            }, 300);
            break;
    }
    
    updateSlideInfo();
    renderGallery();
    resetProgressBar();
    
    // Apply current zoom to new slide
    applyZoomToCurrentImage();
    
    // Save current slide to localStorage
    saveImagesToStorage();
}

// Next Slide
function nextSlide() {
    if (images.length === 0) return;
    
    if (currentSlide < images.length - 1) {
        currentSlide++;
    } else if (loopSwitch.checked) {
        currentSlide = 0;
    } else {
        return;
    }
    
    goToSlide(currentSlide);
}

// Previous Slide
function prevSlide() {
    if (images.length === 0) return;
    
    if (currentSlide > 0) {
        currentSlide--;
    } else if (loopSwitch.checked) {
        currentSlide = images.length - 1;
    } else {
        return;
    }
    
    goToSlide(currentSlide);
}

// Start Slideshow
function startSlideshow() {
    if (images.length === 0 || !autoplaySwitch.checked) return;
    
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, autoPlaySpeed);
    
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
    startProgressBar();
}

// Pause Slideshow
function pauseSlideshow() {
    clearInterval(slideInterval);
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    stopProgressBar();
}

// Toggle Play/Pause
function togglePlayPause() {
    if (images.length === 0) return;
    
    if (isPlaying) {
        pauseSlideshow();
    } else {
        startSlideshow();
    }
}

// Progress Bar Functions
function startProgressBar() {
    if (!autoplaySwitch.checked) return;
    
    progressBar.style.width = '0%';
    const interval = autoPlaySpeed / 100;
    let width = 0;
    
    const progressInterval = setInterval(() => {
        if (!isPlaying || !autoplaySwitch.checked) {
            clearInterval(progressInterval);
            return;
        }
        
        width += 1;
        progressBar.style.width = width + '%';
        
        if (width >= 100) {
            clearInterval(progressInterval);
        }
    }, interval);
}

function resetProgressBar() {
    progressBar.style.width = '0%';
    if (isPlaying && autoplaySwitch.checked) {
        startProgressBar();
    }
}

function stopProgressBar() {
    progressBar.style.width = '0%';
}

// Update Speed
function updateSpeed() {
    const speed = parseInt(speedSlider.value);
    const speeds = ['Very Slow', 'Slow', 'Medium Slow', 'Medium', 'Medium Fast', 'Fast', 'Very Fast', 'Ultra Fast', 'Lightning', 'Extreme'];
    speedValue.textContent = speeds[speed - 1];
    autoPlaySpeed = 6000 - (speed * 500);
    
    if (isPlaying) {
        startSlideshow();
    }
}

// Toggle Autoplay
function toggleAutoplay() {
    if (autoplaySwitch.checked) {
        startSlideshow();
    } else {
        pauseSlideshow();
    }
}

// Set Transition
function setTransition(transition) {
    currentTransition = transition;
    transitionOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.transition === transition);
    });
    showNotification(`Transition set to ${transition}`, 'info');
}

// Toggle Single Edit Mode
function toggleSingleEditMode() {
    isSingleEditMode = singleEditToggle.checked;
    
    if (isSingleEditMode) {
        editModeStatus.textContent = 'ON';
        editorModeBadge.textContent = 'Single Image';
        editModeBar.style.backgroundColor = 'rgba(67, 97, 238, 0.2)';
        editModeBar.style.borderColor = 'rgba(67, 97, 238, 0.4)';
    } else {
        editModeStatus.textContent = 'OFF';
        editorModeBadge.textContent = 'All Images';
        editModeBar.style.backgroundColor = '';
        editModeBar.style.borderColor = '';
    }
    
    showNotification(`Single edit mode: ${isSingleEditMode ? 'ON' : 'OFF'}`, 'info');
}

// Remove Image
function removeImage(index) {
    if (images.length === 0 || index < 0 || index >= images.length) return;
    
    // Remove only the selected image
    images.splice(index, 1);
    
    // Update current slide if needed
    if (currentSlide >= images.length) {
        currentSlide = Math.max(0, images.length - 1);
    }
    
    // If no images left, load defaults
    if (images.length === 0) {
        loadDefaultImages();
    } else {
        renderSlider();
        renderGallery();
        updateSlideInfo();
    }
    
    // Save to localStorage
    saveImagesToStorage();
    
    showNotification('Image removed successfully', 'info');
}

// Clear All Images
function clearAllImages() {
    if (images.length === 0) return;
    
    // Ask for confirmation
    const confirmed = confirm('Are you sure you want to remove all uploaded images? Default images will be restored.');
    
    if (confirmed) {
        // Remove only uploaded images, keep default images
        const defaultImageIds = defaultImages.map(img => img.id);
        images = images.filter(img => defaultImageIds.includes(img.id));
        
        // If no default images left, load them
        if (images.length === 0) {
            loadDefaultImages();
        } else {
            currentSlide = 0;
            renderSlider();
            renderGallery();
            updateSlideInfo();
        }
        
        // Save to localStorage
        saveImagesToStorage();
        
        showNotification('All uploaded images cleared successfully', 'info');
    }
}

// Shuffle Images
function shuffleImages() {
    if (images.length < 2) return;
    
    for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
    }
    
    currentSlide = 0;
    renderSlider();
    renderGallery();
    updateSlideInfo();
    
    // Save to localStorage
    saveImagesToStorage();
    
    showNotification('Images shuffled', 'success');
}

// Reverse Images
function reverseImages() {
    if (images.length < 2) return;
    
    images.reverse();
    currentSlide = 0;
    renderSlider();
    renderGallery();
    updateSlideInfo();
    
    // Save to localStorage
    saveImagesToStorage();
    
    showNotification('Images reversed', 'success');
}

// Download Current Image
function downloadCurrentImage() {
    if (images.length === 0) return;
    
    const currentImage = images[currentSlide];
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentImage.url;
    
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Apply current filter settings
        const filter = getCurrentFilterString();
        ctx.filter = filter;
        
        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        if (currentEditorSettings.flipH) ctx.scale(-1, 1);
        if (currentEditorSettings.flipV) ctx.scale(1, -1);
        ctx.rotate(currentEditorSettings.rotation * Math.PI / 180);
        
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();
        
        // Create download link
        const link = document.createElement('a');
        const fileName = `${currentImage.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('Image downloaded successfully', 'success');
    };
}

// Get current filter as CSS string
function getCurrentFilterString() {
    let filter = '';
    filter += `brightness(${currentEditorSettings.brightness}%) `;
    filter += `contrast(${currentEditorSettings.contrast}%) `;
    filter += `saturate(${currentEditorSettings.saturation}%) `;
    filter += `blur(${currentEditorSettings.blur}px) `;
    
    switch(currentEditorSettings.filter) {
        case 'vintage':
            filter += 'sepia(0.5) hue-rotate(-30deg)';
            break;
        case 'dramatic':
            filter += 'contrast(1.2) saturate(1.2)';
            break;
        case 'warm':
            filter += 'hue-rotate(-10deg) saturate(1.2)';
            break;
        default:
            break;
    }
    
    return filter;
}

// Download Edited Image
function downloadEditedImage() {
    downloadCurrentImage();
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.className = document.body.classList.contains('dark-theme') 
        ? 'fas fa-sun' 
        : 'fas fa-moon';
    
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    showNotification(`Theme switched to ${document.body.classList.contains('dark-theme') ? 'dark' : 'light'}`, 'info');
}

// Load Theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Theme';
    }
}

// Show Modal
function showModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide Modal
function hideModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Update Total Slides
function updateTotalSlides() {
    totalSlidesEl.textContent = images.length;
}

// Update Image Count
function updateImageCount() {
    imageCount.textContent = `${images.length} image${images.length !== 1 ? 's' : ''}`;
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Setup Drag and Drop
function setupDragAndDrop() {
    const dropZone = document.body;
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.backgroundColor = '';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Create a mock event object for handleFileUpload
            const event = { target: { files } };
            handleFileUpload(event);
        }
    });
}

// Handle Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSlide();
            break;
        case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        case '+':
        case '=':
            e.preventDefault();
            adjustZoom(20);
            break;
        case '-':
        case '_':
            e.preventDefault();
            adjustZoom(-20);
            break;
        case 'z':
        case 'Z':
            if (!e.ctrlKey) {
                e.preventDefault();
                resetZoom();
            }
            break;
        case 'f':
        case 'F':
            if (e.ctrlKey) return;
            e.preventDefault();
            if (imageFullscreenOverlay.classList.contains('active')) {
                closeImageFullscreen();
            } else {
                openImageFullscreen();
            }
            break;
        case 'Escape':
            if (imageFullscreenOverlay.classList.contains('active')) {
                closeImageFullscreen();
            }
            hideModal('features');
            break;
        case 's':
        case 'S':
            if (e.ctrlKey) {
                e.preventDefault();
                // Save project is disabled, show notification instead
                showNotification('Save project feature is disabled', 'info');
            }
            break;
        case 'd':
        case 'D':
            if (e.ctrlKey) {
                e.preventDefault();
                downloadCurrentImage();
            }
            break;
        case 'r':
        case 'R':
            if (!e.ctrlKey) {
                e.preventDefault();
                resetEditor();
            }
            break;
        case 'e':
        case 'E':
            e.preventDefault();
            singleEditToggle.checked = !singleEditToggle.checked;
            toggleSingleEditMode();
            break;
        case 'h':
        case 'H':
            if (e.ctrlKey) {
                e.preventDefault();
                featuresBtn.click();
            }
            break;
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
}