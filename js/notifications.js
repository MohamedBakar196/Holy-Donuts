// Notification System for Holy Donuts

// Create notification container if it doesn't exist
function initNotificationContainer() {
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
}

// Show notification toast
export function showNotification(message, type = 'success', duration = 3000) {
    initNotificationContainer();
    const container = document.getElementById('notificationContainer');

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
        margin-bottom: 10px;
        animation: slideIn 0.3s ease-in-out;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    const icons = {
        success: '<i class="fas fa-check-circle me-2"></i>',
        danger: '<i class="fas fa-exclamation-circle me-2"></i>',
        warning: '<i class="fas fa-exclamation-triangle me-2"></i>',
        info: '<i class="fas fa-info-circle me-2"></i>'
    };

    notification.innerHTML = `
        ${icons[type] || icons.info}
        <span>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(notification);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    return notification;
}

// Show error notification
export function showError(message, duration = 3000) {
    return showNotification(message, 'danger', duration);
}

// Show warning notification
export function showWarning(message, duration = 3000) {
    return showNotification(message, 'warning', duration);
}

// Show info notification
export function showInfo(message, duration = 3000) {
    return showNotification(message, 'info', duration);
}

// Show success notification
export function showSuccess(message, duration = 3000) {
    return showNotification(message, 'success', duration);
}

// Badge notification (for admin orders)
export function showAdminNotification(title, message, orderId = null) {
    initNotificationContainer();
    const container = document.getElementById('notificationContainer');

    const notification = document.createElement('div');
    notification.className = 'alert alert-warning alert-dismissible fade show';
    notification.style.cssText = `
        margin-bottom: 10px;
        animation: slideIn 0.3s ease-in-out;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        background: linear-gradient(135deg, #fff3cd, #ffecb5);
        border: 2px solid #ffc107;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-bell fa-lg" style="color: #ff6b6b;"></i>
            <div>
                <strong>${title}</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">${message}</p>
            </div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(notification);

    // Play notification sound
    playNotificationSound();

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Play notification sound
function playNotificationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
