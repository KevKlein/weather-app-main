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
    const [selectedMetrics, setSelectedMetrics] = useState(
         new Set(['cloudCover', 'temperature', 'precipitation', ])
    );
    const allMetrics = [
        { key: 'cloudCover', label: 'Cloud Cover (%)', color: colors.grey, yAxisId: 'yPercent', yAxisLabel: '%', position: 'insideRight', orientation: 'right'},
        { key: 'temperature', label: 'Temperature (°F)', color: colors.orange, yAxisId: 'yTemp', yAxisLabel: '°F', position: 'insideLeft', orientation: 'left'},
        { key: 'apparentTemp', label: 'Apparent Temp (°F)', color: colors.red, yAxisId: 'yTemp', yAxisLabel: '°F', position: 'insideLeft', orientation: 'left' },
        { key: 'precipitation', label: 'Precipitation (mm)', color: colors.blue, yAxisId: 'yPrecip', yAxisLabel: 'inches', position: 'insideLeft', orientation: 'left' },
        { key: 'precipitationChance', label: 'Chance Precipitation (%)', color: colors.blue, yAxisId: 'yPercent', yAxisLabel: '%', position: 'insideRight', orientation: 'right' },
        { key: 'humidity', label: 'Humidity (%)', color: colors.sky_blue, yAxisId: 'yPercent', yAxisLabel: '%', position: 'insideRight', orientation: 'right' },
        { key: 'windSpeed', label: 'Wind Speed (km/h)', color: colors.lime_green, yAxisId: 'ySpeed', yAxisLabel: 'mph', position: 'insideLeft', orientation: 'left' }
    ];
    
    if (!data || data.length ===0) {
        return (
        <h4 className='weatherChartFailMessage'>Choose a valid location to get a forecast.</h4>
    )}

    return (
    <div className="weather-container">
        {/* Weather Chart */}
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart id="WeatherChart" className="weather-chart" data={data}
                margin={{top: 5, left: 10, bottom: 10, right: 10 }}
                >
                <CartesianGrid stroke="#CCCCCC" />
                <XAxis
                dataKey="time"
                ticks={data.filter(entry => entry.time.endsWith("T00:00")).map(entry => entry.time)}
                label={{
                    value: "Time",
                    position: "bottom",
                    offset: -5,
                    style: { textAnchor: "middle" } }}
                tickFormatter={time => {
                    const date = new Date(time);
                    const weekdays = {0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6:"Sat", 7:"Sun"}
                    var weekday = weekdays[date.getDay()];
                    const month = date.getMonth();
                    const day = date.getDate();
                    var hour = date.getHours();
                    const ampm = hour < 12 ? 'AM' : 'PM';
                    hour = (hour % 12 === 0) ? 12 : hour % 12;
                    console.log(`date: ${weekday} ${month}/${day}`);
                    return `${weekday} ${month}/${day}`;
                    }}
                />
                {/* Y-Axes */}
                {Array.from(selectedMetrics).map(key => {
                    const metric = allMetrics.find(m => m.key === key);
                    return (
                        <YAxis
                            yAxisId={metric.yAxisId}
                            axisLine={false}
                            label={{
                                value: metric.yAxisLabel,
                                angle: -90,
                                dx: -18, 
                                style: { textAnchor: "middle", stroke: metric.color, fontWeight: "lighter"} }}
                            domain={metric.key === "precipitation" ? [0, (dataMax => { return Math.max(0.8, dataMax); })] : ['auto', 'auto']}
                            tickFormatter={value => 
                                Number.isInteger(value) 
                                ? value.toString()  // if no fractional part, 0 sigfigs
                                : value.toFixed(1)  // truncate to 1 sigfig
                            }
                        />
                    )
                })}

                
                {/* Tooltips (for chart mouseover) */}
                <Tooltip />

                {/* Lines & bars on weather chart */}
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
                            strokeWidth={1.5}
                            dot={false}
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
  