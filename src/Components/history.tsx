import Button from './button';
import { JSX, useEffect } from 'react';
import ApexCharts from 'apexcharts';
import { UserHistory } from '../types';

// OCP: add a new body metric here — chart formatter and select options update automatically
interface BodyValueOption {
  value: string;
  label: string;
  unit: string;
}

const bodyValueOptions: BodyValueOption[] = [
  { value: 'weight', label: 'Weight', unit: ' kg' },
  { value: 'bfp', label: 'Body Fat Percentage', unit: ' %' },
  { value: 'waist', label: 'Waist Circumference', unit: ' cm' },
  { value: 'hip', label: 'Hip Circumference', unit: ' cm' },
];

type HistoryProps = {
  bodyvalue: UserHistory[];
  selectedBodyValue: string;
  setSelectedBodyValue: (value: string) => void;
  setShowTrend: (value: boolean) => void;
};

function ChartRenderer({
  bodyvalue,
  type,
}: {
  bodyvalue: UserHistory[];
  type: string;
}): JSX.Element {
  useEffect(() => {
    if (!bodyvalue) return;
    console.log(bodyvalue);
    const dates = bodyvalue.map((e) => e.date.slice(0, 10));
    console.log(dates);
    const values = bodyvalue.map((e) => e[type]);

    const options = {
      series: [
        {
          name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
          data: values,
        },
      ],
      chart: {
        height: 300,
        type: 'area',
        zoom: { enabled: false },
        toolbar: { show: false },
        menubar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: {
        text: `Progress for ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        align: 'left',
        style: { color: '#FFFFFF' },
      },
      grid: { show: false },
      xaxis: {
        categories: dates,
        labels: { style: { colors: '#FFFFFF', fontSize: '9px' } },
      },
      yaxis: {
        labels: {
          style: { colors: '#FFFFFF' },
          formatter: (value) => {
            const unit = bodyValueOptions.find((o) => o.value === type)?.unit ?? '';
            return value + unit;
          },
        },
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px',
          color: '#000000',
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();

    return () => chart.destroy();
  }, [bodyvalue, type]);

  return <></>;
}

export default function History({
  bodyvalue,
  selectedBodyValue,
  setSelectedBodyValue,
  setShowTrend,
}: HistoryProps): JSX.Element {
  return (
    <div className="">
      <div id="chart"></div>

      <ChartRenderer bodyvalue={bodyvalue} type={selectedBodyValue} />
      <div className="divider divider-primary"></div>
      <div className="flex flex-row space-x-2 ">
        <select
          className="w-auto h-10 px-11 py-0 rounded-xl border border-blue-400 bg-white/10 text-white shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{
            background: 'rgba(30, 41, 59, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
            border: '1.5px solid rgba(59, 130, 246, 0.25)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
          }}
          onChange={(e) => {
            setSelectedBodyValue(e.target.value);
          }}
        >
          <option disabled selected>
            Select Body Value
          </option>
          {bodyValueOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button border="#f63b3bff" onClick={() => setShowTrend(false)}>
          Close{' '}
        </Button>
      </div>
    </div>
  );
}
