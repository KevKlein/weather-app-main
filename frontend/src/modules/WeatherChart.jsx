import {
    Bar,
    Line,
    Rectangle,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    ComposedChart,
  } from 'recharts';
import React, { useState } from 'react';
  
const chartColors = {
    orange: "#ff7300",           
    blue : "#0074D9",
    blue_transparent : "#0074D9aa",
    light_grey: "#CCCCCC",        
    grey : "#AAAAAA",
    dark_grey: "#222222",       
    sky_blue : "#72C4F3",             
    sky_blue_transparent : "#72C4F3aa",             
    lime_green : "#BFF52D",             
    red : "#FA3830",
};


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
    date.setTime(date.getTime() + i * 6 * 60 * 60 * 1000); // advance 6 hours per point (6hr * 60min/hr * 60sec/min * 1000ms/s)
  
    return {
      time: date.toLocaleDateString(),
      temperature: Math.round(50 + Math.random() * 20 * Math.sin((i / 4) * 2 * Math.PI)), // sine wave
      precipitation: +(Math.random() * 1).toFixed(2), // inches
      cloudCover: Math.floor(Math.random() * 100), // percent
      humidity: Math.floor(50 + 30 * Math.sin((i / 4) * 2 * Math.PI + Math.PI / 2)),
      windSpeed: +(5 + Math.random() * 10).toFixed(1), // mph
      apparentTemperature: Math.round(48 + 12 * Math.sin((i / 4) * 2 * Math.PI + 0.3)),
    };
});


export default function WeatherChart() {
    const [showMetricCheckboxes, setShowMetricCheckboxes] = useState(false); // checkboxes visible?

    const allMetrics = [
        { key: 'cloudCover', label: 'Cloud Cover (%)', 
            color: chartColors.grey, yAxisId: 'y_percent', yAxisLabel: '%' },
        { key: 'temperature', label: 'Temperature (°F)', 
            color: chartColors.orange, yAxisId: 'y_temperature', yAxisLabel: '°F'},
        { key: 'apparentTemp', label: 'Apparent Temp (°F)', 
            color: chartColors.red, yAxisId: 'y_temperature', yAxisLabel: '°F', },
        { key: 'precipitation', label: 'Precipitation (mm)', 
            color: chartColors.blue, yAxisId: 'y_precipitation', yAxisLabel: 'inches' },
        { key: 'precipitationChance', label: 'Chance Precipitation (%)', 
            color: chartColors.blue, yAxisId: 'y_percent', yAxisLabel: '%' },
        { key: 'humidity', label: 'Humidity (%)', 
            color: chartColors.sky_blue, yAxisId: 'y_percent', yAxisLabel: '%' },
        { key: 'windSpeed', label: 'Wind Speed (km/h)', 
            color: chartColors.lime_green, yAxisId: 'y_speed', yAxisLabel: 'mph' }
    ];
    
    const [selectedMetrics, setSelectedMetrics] = useState(
         new Set(['cloudCover', 'temperature', 'precipitation', ])
    );

    return (
    <div className="weather-container">
        {/* Weather Chart */}
        <ResponsiveContainer>
            <ComposedChart id="WeatherChart" className="weather-chart" data={sampleData7}>
                <CartesianGrid stroke="#CCCCCC" />
                <XAxis
                dataKey="time"
                label={{
                    value: "Time",
                    position: "bottom",
                    offset: 0,
                    dy: 20,
                    style: { textAnchor: "middle" } }}
                />
                {/* Y-Axes */}
                {Array.from(selectedMetrics).map(key => {
                    const metric = allMetrics.find(m => m.key === key);
                    return (
                        <YAxis
                            yAxisId={metric.yAxisId}
                            label={{
                                value: metric.yAxisLabel,
                                angle: -90,
                                position: "insideLeft",
                                dx: 10, 
                                style: { textAnchor: "middle", stroke: metric.color, fontWeight: "lighter"} }}
                            // stroke={metric.color}
                            domain={metric.key === "precipitation" ? [0, 3] : ['auto', 'auto']}
                        />
                    )
                })}
                {/* Tooltips (for chart mouseover) */}
                <Tooltip />

                {/* data visualization (lines) on weather chart*/}
                {Array.from(selectedMetrics).map(key => {
                    const metric = allMetrics.find(m => m.key === key);
                    return metric.key === "precipitation" ? (
                        <Bar key={metric.key}
                            yAxisId={metric.yAxisId}
                            dataKey={metric.key} 
                            fill={chartColors.blue_transparent} 
                            activeBar={<Rectangle fill={chartColors.sky_blue_transparent} stroke={chartColors.blue_transparent} />}
                        />
                    ) : (
                        <Line key={metric.key} 
                            yAxisId={metric.yAxisId}
                            type="monotone" 
                            dataKey={metric.key} 
                            stroke={metric.color} 
                        />
                    );
                })}
            </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="weather-legend">
            <div className="weather-legend-checkboxes">
                {showMetricCheckboxes ? (
                    <div>
                        {/* showing checkboxes and all available metrics */}
                        {allMetrics.map(metric => (
                        <label key={metric.key} className="weather-legend-label">
                            <input type="checkbox"
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
                            /> 
                            {' '}
                            <span style={{ color: metric.color }}>■</span>
                            {' '}
                            {metric.label}
                        </label>
                        ))}
                    </div>
                ) : (
                    <div>
                        {/* just showing selected metrics */}
                        {Array.from(selectedMetrics).map(key => {
                            const metric = allMetrics.find(m => m.key === key);
                            return (
                                <div key={key} className="weather-legend-item">
                                <span style={{ color: metric.color }}>■</span> 
                                {' '}
                                {metric.label}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* additional metric checkboxes button */}
            <button
                onClick={() => setShowMetricCheckboxes(!showMetricCheckboxes)}
                className="show-additional-metrics-button"
            >
                {showMetricCheckboxes ? 'Hide Metrics' : 'Additional Metrics'}
            </button>
        </div>
    </div>
    );
  }
  