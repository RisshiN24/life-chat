chrome.runtime.onInstalled.addListener(() => {
    // Create an alarm that triggers every 60 minutes
    chrome.alarms.create('reminderAlarm', { periodInMinutes: 60 });
  });
  
  // Listen for the alarm event and trigger the notification
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'reminderAlarm') {
      showNotification();
    }
  });
  
  function showNotification() {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Reminder',
      message: 'Check the MotivationChat extension!',
      priority: 2
    });
  }

  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      // All Chrome windows have lost focus
      sendResetRequest();
    }
  });
  
  chrome.windows.onRemoved.addListener((windowId) => {
    // A window was closed
    sendResetRequest();
  });
  
  function sendResetRequest() {
    fetch('http://localhost:5000/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      // Handle error silently
    });
  }