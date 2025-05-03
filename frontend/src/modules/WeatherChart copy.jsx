import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
import { useState } from 'react';
  

const sampleData = [
    { time: "00:00", temperature: 52, precipitation: 0, cloudCover: 40 },
    { time: "01:00", temperature: 51, precipitation: 0, cloudCover: 45 },
    { time: "02:00", temperature: 50, precipitation: 0, cloudCover: 60 },
    { time: "03:00", temperature: 49, precipitation: 5, cloudCover: 80 },
    { time: "04:00", temperature: 48, precipitation: 10, cloudCover: 100 },
    { time: "05:00", temperature: 47, precipitation: 15, cloudCover: 100 },
    { time: "06:00", temperature: 47, precipitation: 20, cloudCover: 100 },
    { time: "07:00", temperature: 48, precipitation: 15, cloudCover: 100 },
    { time: "08:00", temperature: 50, precipitation: 10, cloudCover: 100 },
    { time: "09:00", temperature: 53, precipitation: 5,  cloudCover: 80 },
    { time: "10:00", temperature: 56, precipitation: 0,  cloudCover: 65 },
    { time: "11:00", temperature: 58, precipitation: 0,  cloudCover: 50 },
    { time: "12:00", temperature: 60, precipitation: 0,  cloudCover: 45 },
    { time: "13:00", temperature: 61, precipitation: 0,  cloudCover: 50 },
    { time: "14:00", temperature: 62, precipitation: 0,  cloudCover: 55 },
    { time: "15:00", temperature: 63, precipitation: 0,  cloudCover: 65 },
    { time: "16:00", temperature: 62, precipitation: 5,  cloudCover: 75 },
    { time: "17:00", temperature: 60, precipitation: 10, cloudCover: 95 },
    { time: "18:00", temperature: 58, precipitation: 15, cloudCover: 100 },
    { time: "19:00", temperature: 56, precipitation: 20, cloudCover: 100 },
    { time: "20:00", temperature: 54, precipitation: 25, cloudCover: 100 },
    { time: "21:00", temperature: 53, precipitation: 30, cloudCover: 100 },
    { time: "22:00", temperature: 52, precipitation: 35, cloudCover: 100 },
    { time: "23:00", temperature: 51, precipitation: 40, cloudCover: 100 },
    { time: "00:00+", temperature: 50, precipitation: 35, cloudCover: 100 }
];

const sampleData7 = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setTime(date.getTime() + i * 6 * 60 * 60 * 1000); // advance 6 hours per point
  
    return {
      time: date.toLocaleDateString(),
      temperature: Math.round(50 + Math.random() * 20 * Math.sin((i / 4) * 2 * Math.PI)), // sinusoidal
      precipitation: +(Math.random() * 2).toFixed(2), // inches
      cloudCover: Math.floor(Math.random() * 101), // percent
      humidity: Math.floor(50 + 30 * Math.sin((i / 4) * 2 * Math.PI + Math.PI / 2)),
      windSpeed: +(5 + Math.random() * 10).toFixed(1), // mph
      apparentTemperature: Math.round(48 + 12 * Math.sin((i / 4) * 2 * Math.PI + 0.3)),
    };
});
  

export default function WeatherChart() {
    const [showExtras, setShowExtras] = useState(false);

    const allMetrics = [
        { key: 'temperature', label: 'Temperature (°F)', color: '#ff7300' },
        { key: 'precipitation', label: 'Precipitation (mm)', color: '#0074D9' },
        { key: 'cloudCover', label: 'Cloud Cover (%)', color: '#AAAAAA' },
        { key: 'humidity', label: 'Humidity (%)', color: '#804280' },
        { key: 'windSpeed', label: 'Wind Speed (km/h)', color: '#8dd1e1' },
        { key: 'apparentTemp', label: 'Apparent Temp (°F)', color: '#a4de6c' }
    ];
    
    const [selectedMetrics, setSelectedMetrics] = useState(
         new Set(['temperature', 'precipitation', 'cloudCover'])
    );
  
    return (
        <div style={{ display: 'flex' }}>
            {/* Chart Section */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleData7} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis
                    dataKey="time"
                    label={{
                        value: "Time",
                        position: "bottom",
                        offset: 0,
                        dy: 20,
                        style: { textAnchor: "middle" }
                    }}
                    />
                    <YAxis
                    label={{
                        value: "Metric Value",
                        angle: -90,
                        position: "insideLeft",
                        dx: -10,
                        style: { textAnchor: "middle" }
                    }}
                    />
                    <Tooltip />
                    {/* You likely already have lines like this below: */}
                    <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
                    <Line type="monotone" dataKey="precipitation" stroke="#0074D9" />
                    <Line type="monotone" dataKey="cloudCover" stroke="#AAAAAA" />
                </LineChart>
                </ResponsiveContainer>
  
            {/* Custom Legend */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginLeft: '1rem',
                    paddingTop: '0.5rem',
                    height: '300px',
                    width: '200px'
                }}
            >
                {/* Legend OR Checkboxes */}
                <div style={{ fontSize: '0.9rem', flexGrow: 1 }}>
                {showExtras ? (
                    <div>
                        {allMetrics.map(metric => (
                        <label key={metric.key} style={{ display: 'block', marginBottom: '0.25rem' }}>
                            <input
                            type="checkbox"
                            checked={selectedMetrics.has(metric.key)}
                            onChange={() => {
                                const newSet = new Set(selectedMetrics);
                                if (newSet.has(metric.key)) {
                                newSet.delete(metric.key);
                                } else {
                                newSet.add(metric.key);
                                }
                                setSelectedMetrics(newSet);
                            }}
                            />{' '}
                            <span style={{ color: metric.color }}>■</span> {metric.label}
                        </label>
                        ))}
                    </div>
                    ) : (
                    <div>
                        {Array.from(selectedMetrics).map(key => {
                        const metric = allMetrics.find(m => m.key === key);
                        return (
                            <div
                            key={key}
                            style={{
                                display: 'block',
                                marginBottom: '0.0rem',
                                marginLeft: '1.1rem',
                                lineHeight: '1.27rem',
                                // minHeight: '0.5rem'
                            }}
                            >
                            <span style={{ color: metric.color }}>■</span> {metric.label}
                            </div>
                        );
                        })}
                    </div>
                    )}

                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setShowExtras(!showExtras)}
                    style={{
                    padding: '0.4rem 0.6rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9'
                    }}
                >
                    {showExtras ? 'Hide Metrics' : 'Additional Metrics'}
                </button>
            </div>

        </div>
    );
  }
  