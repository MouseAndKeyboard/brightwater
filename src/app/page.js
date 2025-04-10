"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [stage, setStage] = useState(1);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  const [deviceName, setDeviceName] = useState('');
  const [serverName, setServerName] = useState('');
  const [serverPasscode, setServerPasscode] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [ping, setPing] = useState(102);

  const allNetworks = [
    { name: 'CareNet-01', signal: '📶📶📶', delay: 1000 },
    { name: 'FacilityWiFi', signal: '📶📶⚪', delay: 2000 },
    { name: 'Guest-Network', signal: '📶⚪⚪', delay: 3000 },
  ];

  const [availableNetworks, setAvailableNetworks] = useState([]);
  const [loadingNetworks, setLoadingNetworks] = useState(true);

  useEffect(() => {
    allNetworks.forEach((network) => {
      setTimeout(() => {
        setAvailableNetworks((prev) => [...prev, network]);
        if (network.delay === Math.max(...allNetworks.map(n => n.delay))) {
          setTimeout(() => setLoadingNetworks(false), 700);
        }
      }, network.delay);
    });
  }, []);

  useEffect(() => {
    let interval;
    if (setupComplete) {
      interval = setInterval(() => {
        setPing(102 + Math.floor(Math.random() * 5 - 2));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [setupComplete]);

  const handleConnectWifi = () => {
    if (selectedNetwork && wifiPassword) {
      setConnecting(true);
      setTimeout(() => {
        setConnecting(false);
        setConnected(true);
        setTimeout(() => setStage(2), 2000);
      }, 2500);
    }
  };

  const handleCompleteSetup = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setSetupComplete(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Device Configuration Portal</h2>

          {stage === 1 && (
            <>
              <h3 className="font-semibold text-lg mb-2">Select Wi-Fi Network</h3>
              {loadingNetworks && (
                <div className="text-gray-500 animate-pulse">🔄 Scanning for networks...</div>
              )}
              <table className="w-full text-left mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2">Network</th>
                    <th className="pb-2">Signal Strength</th>
                  </tr>
                </thead>
                <tbody>
                  {availableNetworks.map((network, index) => (
                    <tr
                      key={network.name}
                      className={`cursor-pointer transition-opacity duration-500 ease-in-out hover:bg-gray-100 ${selectedNetwork === network.name ? 'bg-gray-200' : ''}`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                      onClick={() => setSelectedNetwork(network.name)}
                    >
                      <td className="py-2">{network.name}</td>
                      <td className="py-2 text-xl">{network.signal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <input
                type="password"
                placeholder="Wi-Fi Password"
                className="w-full border rounded p-2 mb-4"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
              />

              <button
                onClick={handleConnectWifi}
                disabled={connecting || !selectedNetwork}
                className={`w-full py-2 rounded text-white transition-colors duration-300
                  ${connected ? 'bg-green-500' : connecting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {connecting ? 'Connecting...' : connected ? 'Connected!' : 'Connect'}
              </button>

              {connected && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
                  <p>MAC Address: <strong>00:1B:44:11:3A:B7</strong></p>
                  <p>IP Address: <strong>192.168.1.42</strong></p>
                  <p className="mt-2">🔒 Secure connection established.</p>
                </div>
              )}
            </>
          )}

          {stage === 2 && !setupComplete && (
            <>
              <h3 className="font-semibold text-lg mb-2">Device & Server Setup</h3>
              <input placeholder="Device Name" className="w-full border rounded p-2 mb-3" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
              <input placeholder="Master Server Name" className="w-full border rounded p-2 mb-3" value={serverName} onChange={(e) => setServerName(e.target.value)} />
              <input placeholder="Master Server Passcode" type="password" className="w-full border rounded p-2 mb-4" value={serverPasscode} onChange={(e) => setServerPasscode(e.target.value)} />
              <button onClick={handleCompleteSetup} disabled={connecting} className="w-full bg-green-600 hover:bg-green-700 py-2 text-white rounded">
                {connecting ? 'Finalizing...' : 'Complete Setup'}
              </button>
            </>
          )}

          {setupComplete && (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">✅ Connection Established!</p>
              <p className="text-gray-600 mt-2">📱 Phone to Device: Connected</p>
              <p className="text-gray-600">🌐 Device to Internet: Connected</p>
              <p className="text-gray-600">🖥️ Device to Master Server: Connected</p>
              <p className="text-gray-600 mt-2">Ping: {ping} ms</p>
            </div>
          )}

          <div className="mt-6 text-sm text-center text-gray-600">
            Support: (1800) 555-0199 | support@connectcare.com
          </div>
        </div>
      </div>
    </div>
  );
}