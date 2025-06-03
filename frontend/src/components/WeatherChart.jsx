import { Bar, Line, Rectangle, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ComposedChart } from 'recharts';
import { useState } from 'react';
import "./WeatherChart.css"

const colors = {
    orange: '#ff7300',           
    blue : '#0074D9',
    blue_transparent : '#0074D9aa',
    light_grey: '#CCCCCC',        
    grey : '#AAAAAA',
    dark_grey: '#222222',       
    sky_blue : '#72C4F3',             
    sky_blue_transparent : '#72C4F3aa',             
    violet: '#8845c3',         
    red : '#FA3830',
};


export default function WeatherChart({ units, data, selectedMetrics, setSelectedMetrics}) {
    const [showMetricCheckboxes, setShowMetricCheckboxes] = useState(false);

    const precipUnitLabel = (units.precipitation === 'inch') ? 'inches' : units.precipitation;
    const allMetrics = [
        { key: 'cloudCover', label: 'Cloud Cover (%)', color: colors.grey, yAxisId: 'yPercent', yAxisLabel: '%', position: 'insideRight', orientation: 'right'},
        { key: 'temperature', label: `Temperature (${units.temperature})`, color: colors.orange, yAxisId: 'yTemp', yAxisLabel: `${units.temperature}`, position: 'insideLeft', orientation: 'left'},
        { key: 'apparentTemp', label: `Apparent Temp (${units.temperature})`, color: colors.red, yAxisId: 'yTemp', yAxisLabel: `${units.temperature}`, position: 'insideLeft', orientation: 'left' },
        { key: 'precipitation', label: `Precipitation (${precipUnitLabel})`, color: colors.blue, yAxisId: 'yPrecip', yAxisLabel: `${precipUnitLabel}`, position: 'insideLeft', orientation: 'left' },
        { key: 'precipitationChance', label: 'Chance Precipitation (%)', color: colors.blue, yAxisId: 'yPercent', yAxisLabel: '%', position: 'insideRight', orientation: 'right' },
        { key: 'humidity', label: 'Humidity (%)', color: colors.sky_blue, yAxisId: 'yPercent', yAxisLabel: '%', position: 'insideRight', orientation: 'right' },
        { key: 'windSpeed', label: `Wind Speed (${units.windSpeed})`, color: colors.violet, yAxisId: 'ySpeed', yAxisLabel: `${units.windSpeed}`, position: 'insideLeft', orientation: 'left' }
    ];
    
    if (!data || data.length ===0) {
        return (
        <h4 className='weatherChartFailMessage'>Choose a valid location to get a forecast.</h4>
    )}

    return (
    <div className='weather-container'>
        {/* Weather Chart */}
        <ResponsiveContainer width='100%' height={300}>
            <ComposedChart id='WeatherChart' className='weather-chart' data={data}
                margin={{top: 5, left: 10, bottom: 10, right: 10 }}
                >
                <CartesianGrid stroke='#CCCCCC' />
                <XAxis
                dataKey='time'
                ticks={data.filter(entry => entry.time.endsWith('T00:00')).map(entry => entry.time)}
                label={{
                    value: 'Time',
                    position: 'bottom',
                    offset: -5,
                    style: { textAnchor: 'middle' } }}
                tickFormatter={time => {
                    const date = new Date(time);
                    const weekdays = {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6:'Sat'}
                    var weekday = weekdays[date.getDay()];
                    const month = date.getMonth() + 1; // + 1 because getMonth is zero indexed
                    const day = date.getDate();
                    var hour = date.getHours();
                    const ampm = hour < 12 ? 'AM' : 'PM';
                    hour = (hour % 12 === 0) ? 12 : hour % 12;
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
                                style: { textAnchor: 'middle', stroke: metric.color, fontWeight: 'lighter'} }}
                            domain={ getDomain(metric.key, units) }
                            tickFormatter={ value => 
                                (Number.isInteger(value) || metric.key != 'precipitation')
                                ? value.toFixed(0)  // if no fractional part, 0 sigfigs
                                : value.toFixed(2)  // truncate to 2 sigfigs
                            }
                        />
                    )
                })}
                {/* Tooltips (for chart mouseover) */}
                <Tooltip />
                {/* Lines & bars on weather chart */}
                {Array.from(selectedMetrics).map(key => {
                    const metric = allMetrics.find(m => m.key === key);
                    return (metric.key === 'precipitation') ? (
                        <Bar key={metric.key}
                            yAxisId={metric.yAxisId}
                            dataKey={metric.key} 
                            fill={colors.blue_transparent} 
                            activeBar={<Rectangle fill={colors.sky_blue_transparent} stroke={colors.blue_transparent} />}
                        />
                    ) : (
                        <Line key={metric.key} 
                            yAxisId={metric.yAxisId}
                            type='monotone' 
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
        <div className='weather-legend'>
            <div className='weather-legend-checkboxes'>
                {showMetricCheckboxes ? (
                    <div>
                        {/* showing checkboxes and all available metrics */}
                        {allMetrics.map(metric => (
                        <label key={metric.key} className='weather-legend-label'>
                            <input type='checkbox'
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
                                <div key={key} className='weather-legend-item'>
                                <span style={{ color: metric.color }}>■</span> 
                                {' '}
                                {metric.label}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 'Additional Metrics' button */}
            <button
                onClick={() => setShowMetricCheckboxes(!showMetricCheckboxes)}
                className='show-additional-metrics-button'
            >
                {showMetricCheckboxes ? 'Done' : 'Additional Metrics'}
            </button>
        </div>
    </div>
    );
}
  

function getDomain(metricKey, units) {
    switch (metricKey) {
        case 'precipitation':
            return [0, (dataMax) => {
                            return (units.precipitation === 'mm')
                                ? Math.max(4, dataMax)
                                : Math.max(0.2, dataMax);
            }];
        case 'cloudCover':
        case 'precipitationChance':
        case 'humidity':
            return [0, 100];
        default:
            return ['auto', 'auto'];
    }
}