import React, { useState, useEffect, useRef } from 'react';
import { deviceService } from '../services/deviceService';
import { connectMqtt, sendConfigUpdate, sendWifiUpdate, onConfigResponse } from '../services/mqttService';
import { ConfigStatus } from '../constants/scaleConstants';
import { SettingsSidebar } from '../components/deviceSettings/SettingsSidebar';
import { GeneralTab } from '../components/deviceSettings/GeneralTab';
import { NetworkTab } from '../components/deviceSettings/NetworkTab';

// MOCK DATA - Device Information
const MOCK_DEVICE_INFO = {
  model: "ESP32-S3-WROOM",
};

// Settings Tabs Configuration
const SETTINGS_TABS = [
  { id: 'general', label: 'General', icon: 'tune' },
  { id: 'wifi', label: 'Network', icon: 'wifi' },
];

export const DeviceSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  
  // General settings state
  const [deviceName, setDeviceName] = useState('');
  const [caliFactor, setCaliFactor] = useState('');
  const [offset, setOffset] = useState('');
  const [configStatus, setConfigStatus] = useState(ConfigStatus.IDLE);
  const [configMessage, setConfigMessage] = useState('');
  
  // Network settings state
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [wifiStatus, setWifiStatus] = useState(ConfigStatus.IDLE);
  const [wifiMessage, setWifiMessage] = useState('');
  const [currentSsid, setCurrentSsid] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  // Timeout ref for WiFi connection
  const wifiTimeoutRef = useRef(null);

  // Device info state
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: '',
    name: '',
    caliFactor: ''
  });

  // Load device info from BE on mount
  useEffect(() => {
    const loadDeviceInfo = async () => {
      try {
        await connectMqtt();
        const info = await deviceService.getInfo();
        setDeviceName(info.name);
        setCaliFactor(info.caliFactor.toString());
        setOffset(info.offset.toString());
        setDeviceInfo({
          deviceId: info.deviceId,
          name: info.name,
          caliFactor: info.caliFactor
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to load device info:', error);
        setLoading(false);
      }
    };

    loadDeviceInfo();

    // Subscribe to config responses from ESP32
    const unsubscribe = onConfigResponse((response) => {
      console.log('[DeviceSettings] Config response:', response);
      
      if (response.type === 'config_update') {
        if (response.success) {
          setConfigStatus(ConfigStatus.SUCCESS);
          setConfigMessage('Device configuration updated successfully');
          
          // Auto-reload device info from API after successful update
          setTimeout(async () => {
            try {
              const info = await deviceService.getInfo();
              setDeviceInfo({
                deviceId: info.deviceId,
                name: info.name,
                caliFactor: info.caliFactor
              });
              console.log('[DeviceSettings] Device info reloaded');
            } catch (error) {
              console.error('[DeviceSettings] Failed to reload device info:', error);
            }
          }, 1000);
        } else {
          setConfigStatus(ConfigStatus.FAILED);
          setConfigMessage(response.message || 'Configuration update failed');
        }
      }
      
      if (response.type === 'wifi_update') {
        // Clear timeout when response received
        if (wifiTimeoutRef.current) {
          clearTimeout(wifiTimeoutRef.current);
          wifiTimeoutRef.current = null;
        }
        
        if (response.success) {
          setWifiStatus(ConfigStatus.SUCCESS);
          setWifiMessage(`Connected to ${response.ssid}`);
          setCurrentSsid(response.ssid);
          setIsConnected(true);
        } else {
          setWifiStatus(ConfigStatus.FAILED);
          setWifiMessage(response.message || 'WiFi connection failed');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle save general settings
  const handleSaveConfig = () => {
    setConfigStatus(ConfigStatus.SENDING);
    setConfigMessage('Sending configuration to device...');
    
    const success = sendConfigUpdate({
      name: deviceName,
      caliFactor: caliFactor,
      offset: offset
    });

    if (!success) {
      setConfigStatus(ConfigStatus.FAILED);
      setConfigMessage('Failed to send command. MQTT not connected.');
    }
  };

  // Handle save network settings
  const handleSaveWifi = () => {
    if (!ssid || !password) {
      setWifiStatus(ConfigStatus.FAILED);
      setWifiMessage('Please enter both SSID and password');
      return;
    }

    // Clear any existing timeout
    if (wifiTimeoutRef.current) {
      clearTimeout(wifiTimeoutRef.current);
    }

    setWifiStatus(ConfigStatus.SENDING);
    setWifiMessage('Connecting to WiFi...');
    
    const success = sendWifiUpdate({
      ssid: ssid,
      password: password
    });

    if (!success) {
      setWifiStatus(ConfigStatus.FAILED);
      setWifiMessage('Failed to send command. MQTT not connected.');
      return;
    }

    // Set timeout: if no response in 10 seconds, assume failed
    wifiTimeoutRef.current = setTimeout(() => {
      setWifiStatus(ConfigStatus.FAILED);
      setWifiMessage('Connection timeout. No response from device.');
    }, 10000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Device Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Manage hardware configuration for ESP32 Smart Scale.</p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading device information...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SettingsSidebar 
            SETTINGS_TABS={SETTINGS_TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            deviceInfo={deviceInfo}
            MOCK_DEVICE_INFO={MOCK_DEVICE_INFO}
          />

          <div className="md:col-span-3">
            {activeTab === 'general' && (
              <GeneralTab 
                deviceName={deviceName}
                setDeviceName={setDeviceName}
                caliFactor={caliFactor}
                setCaliFactor={setCaliFactor}
                offset={offset}
                setOffset={setOffset}
                configStatus={configStatus}
                configMessage={configMessage}
                onSave={handleSaveConfig}
              />
            )}

            {activeTab === 'wifi' && (
              <NetworkTab 
                ssid={ssid}
                setSsid={setSsid}
                password={password}
                setPassword={setPassword}
                wifiStatus={wifiStatus}
                wifiMessage={wifiMessage}
                currentSsid={currentSsid}
                isConnected={isConnected}
                onSave={handleSaveWifi}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
