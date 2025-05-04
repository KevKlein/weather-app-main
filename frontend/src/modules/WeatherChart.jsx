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
  
const colors = {
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


export default function WeatherChart({ data }) {
    console.log({data});
    const [showMetricCheckboxes, setShowMetricCheckboxes] = useState(false); // checkboxes visible?

    const allMetrics = [
        { key: 'cloudCover', label: 'Cloud Cover (%)', color: colors.grey, yAxisId: 'yPercent', yAxisLabel: '%' },
        { key: 'temperature', label: 'Temperature (°F)', color: colors.orange, yAxisId: 'yTemp', yAxisLabel: '°F'},
        { key: 'apparentTemp', label: 'Apparent Temp (°F)', color: colors.red, yAxisId: 'yApparentTemp', yAxisLabel: '°F', },
        { key: 'precipitation', label: 'Precipitation (mm)', color: colors.blue, yAxisId: 'yPrecip', yAxisLabel: 'inches' },
        { key: 'precipitationChance', label: 'Chance Precipitation (%)', color: colors.blue, yAxisId: 'yPercent', yAxisLabel: '%' },
        { key: 'humidity', label: 'Humidity (%)', color: colors.sky_blue, yAxisId: 'yPercent', yAxisLabel: '%' },
        { key: 'windSpeed', label: 'Wind Speed (km/h)', color: colors.lime_green, yAxisId: 'ySpeed', yAxisLabel: 'mph' }
    ];
    
    const [selectedMetrics, setSelectedMetrics] = useState(
         new Set(['cloudCover', 'temperature', 'precipitation', ])
    );

    if (!data || data.length ===0) {
        return (
        <p className='weatherChartFailMessage'>No weather data available.</p>
    )}
    return (
    <div className="weather-container">
        {/* Weather Chart */}
        <ResponsiveContainer>
            <ComposedChart id="WeatherChart" className="weather-chart" data={data}>
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

                {/* data visualization (lines & bars) on weather chart*/}
                {Array.from(selectedMetrics).map(key => {
                    const metric = allMetrics.find(m => m.key === key);
                    return metric.key === "precipitation" ? (
                        <Bar key={metric.key}
                            yAxisId={metric.yAxisId}
                            dataKey={metric.key} 
                            fill={colors.blue_transparent} 
                            activeBar={<Rectangle fill={colors.sky_blue_transparent} stroke={colors.blue_transparent} />}
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

            {/* "Additional Metrics" button */}
            <button
                onClick={() => setShowMetricCheckboxes(!showMetricCheckboxes)}
                className="show-additional-metrics-button"
            >
                {showMetricCheckboxes ? 'Done' : 'Additional Metrics'}
            </button>
        </div>
    </div>
    );
  }
  