import React, { useState, useEffect } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { ChevronDown, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { toast } from 'sonner';
import mockData from '../../data/mockCashflowData.json';

interface SankeyNode {
  id: string;
  color?: string;
  cluster?: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface CashflowData {
  nodes: SankeyNode[];
  links: SankeyLink[];
  summary: {
    totalIn: number;
    totalOut: number;
    netFlow: number;
  }
}

function StatCard({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: any }) {
  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[12px] px-[20px] py-[16px] flex-1 flex items-center gap-[16px]">
      <div className="size-[44px] rounded-[10px] bg-[#101214] border border-[#2e2f33] flex items-center justify-center shrink-0">
        <Icon size={20} color={color} />
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="text-[#717784] text-[13px] font-medium font-['Inter_Tight',sans-serif]">{label}</p>
        <p className="text-[22px] font-bold font-['Inter_Tight',sans-serif]">
          <span className="text-white">LKR </span>
          <span style={{ color }}>{value.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

export function CashflowPage() {
  const [data, setData] = useState<CashflowData | null>(null);
  const [period, setPeriod] = useState('april-2026');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCashflowData() {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setData(mockData as CashflowData);
      } catch (error) {
        console.error('Error fetching cashflow data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCashflowData();
  }, [period]);

  const periods = [
    { value: 'april-2026', label: 'April 2026' },
    { value: 'march-2026', label: 'March 2026' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'all-time', label: 'All time' },
  ];

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#22C55E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-[32px] gap-[16px] scrollbar-hide">

      {/* Overview Cards Row */}
      <div className="flex gap-[16px] w-full shrink-0">
        <StatCard label="Total In" value={data.summary.totalIn} color="#10B981" icon={TrendingUp} />
        <StatCard label="Total Out" value={data.summary.totalOut} color="#EF4444" icon={TrendingDown} />
        <StatCard label="Net Flow" value={data.summary.netFlow} color="#3B82F6" icon={Activity} />
      </div>

      {/* Main Sankey Card */}
      <div className="flex-1 bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[40px] flex flex-col relative min-h-[600px] shadow-2xl">

        {/* Card Header */}
        <div className="flex justify-between items-center mb-[40px] shrink-0">
          <div className="flex flex-col gap-[4px]">
            <h1 className="text-white text-[20px] font-semibold font-['Inter_Tight',sans-serif]">Cash Flow Pipeline</h1>
            <p className="text-[#717784] text-[13px]">Visualized movement of funds across your ecosystem</p>
          </div>
          <div className="flex gap-[24px] items-center">
            <div className="flex items-center gap-[6px]">
              <div className="size-[8px] rounded-full bg-[#10B981]" />
              <span className="text-[#99a0ae] text-[11px] font-medium uppercase tracking-wider">Inflows</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="size-[8px] rounded-full bg-[#EF4444]" />
              <span className="text-[#99a0ae] text-[11px] font-medium uppercase tracking-wider">Outflows</span>
            </div>
          </div>
        </div>

        {/* The Sankey Component */}
        <div className="flex-1 w-full relative">
          <ResponsiveSankey
            data={data}
            margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
            align="justify"
            colors={(node: any) => node.color || '#606980'}
            nodeOpacity={1}
            nodeThickness={14}
            nodeInnerPadding={0}
            nodeSpacing={32}
            nodeBorderWidth={0}
            nodeBorderRadius={3}
            linkOpacity={0.35}
            linkHoverOpacity={0.65}
            linkHoverOthersOpacity={0.1}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={20}
            labelTextColor="#99a0ae"
            theme={{
              tooltip: {
                container: {
                  background: '#101214',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #2e2f33',
                  padding: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }
              },
              labels: {
                text: {
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  fill: '#E1E4EA'
                }
              }
            }}
            valueFormat={value => `LKR ${value.toLocaleString()}`}
          />
        </div>

        {/* Bottom Bar Tools */}
        <div className="mt-[32px] pt-[20px] border-t border-white/[0.03] flex justify-between items-center">
          <div className="flex items-center gap-[24px]">
            <div className="flex items-center gap-[8px]">
              <div className="size-[10px] rounded-[2px] bg-[#10B981]" />
              <span className="text-[#99a0ae] text-[12px] font-medium">Income Flow</span>
            </div>
            <div className="flex items-center gap-[8px]">
              <div className="size-[10px] rounded-[2px] bg-[#EF4444]" />
              <span className="text-[#99a0ae] text-[12px] font-medium">Expense Flow</span>
            </div>
            <div className="flex items-center gap-[8px]">
              <div className="size-[10px] rounded-[2px] bg-[#606980]" />
              <span className="text-[#99a0ae] text-[12px] font-medium">Cash Flow Hub</span>
            </div>
          </div>

          <Select.Root value={period} onValueChange={(val) => {
            setPeriod(val);
            const label = periods.find(p => p.value === val)?.label;
            toast.info(`Showing cash flow for ${label}`);
          }}>
            <Select.Trigger className="bg-[#101214] border border-[#2e2f33] rounded-[10px] h-[36px] px-[12px] flex items-center gap-[8px] text-white text-[13px] font-medium outline-none hover:bg-white/[0.04] transition-colors cursor-pointer">
              <Calendar size={14} className="text-[#717784]" />
              <Select.Value />
              <Select.Icon>
                <ChevronDown size={14} className="text-[#717784]" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-50 bg-[#101214] border border-[#2e2f33] rounded-[12px] p-[6px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <Select.Viewport>
                  {periods.map(p => (
                    <Select.Item
                      key={p.value}
                      value={p.value}
                      className="flex items-center px-[24px] py-[8px] rounded-[8px] text-[13px] text-[#99a0ae] hover:text-white hover:bg-white/[0.04] outline-none cursor-pointer relative select-none"
                    >
                      <Select.ItemText>{p.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

      </div>
    </div>
  );
}
